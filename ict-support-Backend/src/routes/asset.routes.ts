import { Router, Response } from "express";
import { prisma } from "../lib/prisma";
import { authenticate, authorize, AuthRequest } from "../middleware/auth";
import { AssetStatus } from "@prisma/client";

const router = Router();
router.use(authenticate);

// GET /api/assets
router.get("/", authorize("TECHNICIAN", "MANAGER", "ADMIN"), async (req, res: Response) => {
  try {
    const { status, type, search } = req.query;
    const where: any = {};
    if (status) where.status = status as AssetStatus;
    if (type) where.type = { contains: type as string, mode: "insensitive" };
    if (search) {
      where.OR = [
        { assetNumber: { contains: search as string, mode: "insensitive" } },
        { model: { contains: search as string, mode: "insensitive" } },
        { serialNumber: { contains: search as string, mode: "insensitive" } },
        { location: { contains: search as string, mode: "insensitive" } },
      ];
    }
    const assets = await prisma.asset.findMany({ where, orderBy: { createdAt: "desc" } });
    res.json(assets);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/assets/:id
router.get("/:id", authorize("TECHNICIAN", "MANAGER", "ADMIN"), async (req, res: Response) => {
  const asset = await prisma.asset.findUnique({ where: { id: req.params.id } });
  if (!asset) return res.status(404).json({ message: "Asset not found" });
  res.json(asset);
});

// POST /api/assets — Manager/Admin
router.post("/", authorize("MANAGER", "ADMIN"), async (req: AuthRequest, res: Response) => {
  try {
    const { type, model, serialNumber, location, status, purchaseDate, notes } = req.body;
    if (!type || !model || !serialNumber || !location)
      return res.status(400).json({ message: "type, model, serialNumber and location are required" });

    const count = await prisma.asset.count();
    const assetNumber = `AST-${String(count + 1).padStart(4, "0")}`;

    const asset = await prisma.asset.create({
      data: { assetNumber, type, model, serialNumber, location, status: status as AssetStatus || AssetStatus.ACTIVE, purchaseDate: purchaseDate ? new Date(purchaseDate) : undefined, notes },
    });

    await prisma.auditLog.create({
      data: { action: "CREATE_ASSET", entity: "Asset", entityId: asset.id, userId: req.user!.userId },
    });

    res.status(201).json(asset);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/assets/:id — Manager/Admin
router.put("/:id", authorize("MANAGER", "ADMIN"), async (req: AuthRequest, res: Response) => {
  try {
    const { type, model, location, status, notes } = req.body;
    const existing = await prisma.asset.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ message: "Asset not found" });

    const asset = await prisma.asset.update({
      where: { id: req.params.id },
      data: { type, model, location, status: status as AssetStatus, notes },
    });

    // Record history if status changed
    if (status && status !== existing.status) {
      await prisma.assetHistory.create({
        data: {
          action: "STATUS_CHANGE",
          oldStatus: existing.status,
          newStatus: status,
          notes: notes || null,
          assetId: asset.id,
          userId: req.user!.userId,
        },
      });
    }

    await prisma.auditLog.create({
      data: { action: "UPDATE_ASSET", entity: "Asset", entityId: asset.id, userId: req.user!.userId },
    });
    res.json(asset);
  } catch (err: any) {
    console.error("[PUT /assets]", err?.message);
    res.status(500).json({ message: err?.message || "Server error" });
  }
});

// GET /api/assets/:id/history — Asset maintenance history
router.get("/:id/history", authorize("TECHNICIAN", "MANAGER", "ADMIN"), async (req, res: Response) => {
  try {
    const history = await prisma.assetHistory.findMany({
      where: { assetId: req.params.id },
      include: { user: { select: { name: true, role: true } } },
      orderBy: { createdAt: "desc" },
    });
    res.json(history);
  } catch (err: any) {
    res.status(500).json({ message: err?.message || "Server error" });
  }
});

// DELETE /api/assets/:id — Admin
router.delete("/:id", authorize("ADMIN"), async (req: AuthRequest, res: Response) => {
  try {
    await prisma.asset.delete({ where: { id: req.params.id } });
    res.json({ message: "Asset deleted" });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
