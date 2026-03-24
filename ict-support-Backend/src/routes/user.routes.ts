import { Router, Response } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";
import { authenticate, authorize, AuthRequest } from "../middleware/auth";
import { Role } from "@prisma/client";

const router = Router();
router.use(authenticate);

// GET /api/users — Manager/Admin: list all users
router.get("/", authorize("MANAGER", "ADMIN"), async (_req, res: Response) => {
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, department: true, phone: true, isActive: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });
  res.json(users);
});

// GET /api/users/technicians — Manager: list technicians
router.get("/technicians", authorize("MANAGER", "ADMIN"), async (_req, res: Response) => {
  const technicians = await prisma.user.findMany({
    where: { role: Role.TECHNICIAN, isActive: true },
    select: { id: true, name: true, email: true, department: true },
  });
  res.json(technicians);
});

// GET /api/users/:id
router.get("/:id", authorize("MANAGER", "ADMIN"), async (req, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.params.id },
    select: { id: true, name: true, email: true, role: true, department: true, phone: true, isActive: true },
  });
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});

// POST /api/users — Manager/Admin: create user
router.post("/", authorize("MANAGER", "ADMIN"), async (req: AuthRequest, res: Response) => {
  try {
    const { name, email, password, role, department, phone } = req.body;
    if (!name || !email || !password || !role)
      return res.status(400).json({ message: "name, email, password and role are required" });

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return res.status(409).json({ message: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashed, role: role as Role, department, phone },
      select: { id: true, name: true, email: true, role: true, department: true },
    });

    await prisma.auditLog.create({
      data: { action: "CREATE_USER", entity: "User", entityId: user.id, userId: req.user!.userId, details: `Created user ${email}` },
    });

    res.status(201).json(user);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/users/:id — Admin: update user
router.put("/:id", authorize("ADMIN"), async (req: AuthRequest, res: Response) => {
  try {
    const { name, role, department, phone, isActive } = req.body;
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { name, role: role as Role, department, phone, isActive },
      select: { id: true, name: true, email: true, role: true, department: true, isActive: true },
    });
    await prisma.auditLog.create({
      data: { action: "UPDATE_USER", entity: "User", entityId: user.id, userId: req.user!.userId },
    });
    res.json(user);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/users/:id — Admin only
router.delete("/:id", authorize("ADMIN"), async (req: AuthRequest, res: Response) => {
  try {
    await prisma.user.update({ where: { id: req.params.id }, data: { isActive: false } });
    await prisma.auditLog.create({
      data: { action: "DEACTIVATE_USER", entity: "User", entityId: req.params.id, userId: req.user!.userId },
    });
    res.json({ message: "User deactivated" });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
