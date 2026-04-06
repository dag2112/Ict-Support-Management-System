import { Router, Response } from "express";
import { prisma } from "../lib/prisma";
import { authenticate, authorize, AuthRequest } from "../middleware/auth";
import { SpareStatus, Role } from "@prisma/client";

const router = Router();
router.use(authenticate);

// GET /api/spares
router.get("/", authorize("TECHNICIAN", "MANAGER", "STOREKEEPER", "ADMIN"), async (req: AuthRequest, res: Response) => {
  try {
    const { role, userId } = req.user!;
    const where: any = {};
    if (role === "TECHNICIAN") where.requestedById = userId;

    const spares = await prisma.spareRequest.findMany({
      where,
      include: {
        request: { select: { requestNumber: true, title: true } },
        requestedBy: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(spares);
  } catch (err: any) {
    console.error("[GET /spares]", err?.message);
    res.status(500).json({ message: err?.message || "Server error" });
  }
});

// POST /api/spares — Technician requests spare
router.post("/", authorize("TECHNICIAN"), async (req: AuthRequest, res: Response) => {
  try {
    const { requestId, spareName, quantity, description } = req.body;
    if (!requestId || !spareName)
      return res.status(400).json({ message: "requestId and spareName are required" });

    const spare = await prisma.spareRequest.create({
      data: { requestId, spareName, quantity: quantity || 1, description, requestedById: req.user!.userId },
      include: { request: { select: { requestNumber: true, title: true } } },
    });

    const managers = await prisma.user.findMany({ where: { role: Role.MANAGER, isActive: true } });
    for (const manager of managers) {
      await prisma.notification.create({
        data: { title: "Spare Part Requested", message: `Technician requested spare: ${spareName}`, userId: manager.id, requestId },
      });
    }

    res.status(201).json(spare);
  } catch (err: any) {
    console.error("[POST /spares]", err?.message);
    res.status(500).json({ message: err?.message || "Server error" });
  }
});

// PUT /api/spares/:id/approve — Manager approves
router.put("/:id/approve", authorize("MANAGER"), async (req: AuthRequest, res: Response) => {
  try {
    const spare = await prisma.spareRequest.findUnique({ where: { id: req.params.id }, include: { requestedBy: true } });
    if (!spare) return res.status(404).json({ message: "Spare request not found" });

    const updated = await prisma.spareRequest.update({
      where: { id: req.params.id },
      data: { status: SpareStatus.APPROVED },
    });

    const storekeepers = await prisma.user.findMany({ where: { role: Role.STOREKEEPER, isActive: true } });
    for (const sk of storekeepers) {
      await prisma.notification.create({
        data: { title: "Spare Request Approved", message: `Spare request for ${spare.spareName} has been approved.`, userId: sk.id, requestId: spare.requestId },
      });
    }

    res.json(updated);
  } catch (err: any) {
    console.error("[PUT /spares/approve]", err?.message);
    res.status(500).json({ message: err?.message || "Server error" });
  }
});

// PUT /api/spares/:id/allocate — Storekeeper allocates
router.put("/:id/allocate", authorize("STOREKEEPER"), async (req: AuthRequest, res: Response) => {
  try {
    const spare = await prisma.spareRequest.findUnique({ where: { id: req.params.id } });
    if (!spare) return res.status(404).json({ message: "Spare request not found" });
    if (spare.status !== SpareStatus.APPROVED)
      return res.status(400).json({ message: "Only approved spare requests can be allocated" });

    const updated = await prisma.spareRequest.update({
      where: { id: req.params.id },
      data: { status: SpareStatus.ALLOCATED },
    });

    await prisma.supportRequest.update({
      where: { id: spare.requestId },
      data: { status: "SPARE_ALLOCATED" },
    });

    await prisma.notification.create({
      data: { title: "Spare Allocated", message: `Spare part ${spare.spareName} has been allocated.`, userId: spare.requestedById, requestId: spare.requestId },
    });

    res.json(updated);
  } catch (err: any) {
    console.error("[PUT /spares/allocate]", err?.message);
    res.status(500).json({ message: err?.message || "Server error" });
  }
});

// PUT /api/spares/:id/purchase — Storekeeper requests purchase
router.put("/:id/purchase", authorize("STOREKEEPER"), async (req: AuthRequest, res: Response) => {
  try {
    const updated = await prisma.spareRequest.update({
      where: { id: req.params.id },
      data: { status: SpareStatus.PURCHASE_REQUESTED },
    });
    res.json(updated);
  } catch (err: any) {
    console.error("[PUT /spares/purchase]", err?.message);
    res.status(500).json({ message: err?.message || "Server error" });
  }
});

export default router;
