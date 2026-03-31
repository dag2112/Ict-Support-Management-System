import { Router, Response } from "express";
import { prisma } from "../lib/prisma";
import { authenticate, AuthRequest } from "../middleware/auth";

const router = Router();
router.use(authenticate);

// GET /api/chat/:requestId — get messages for a request
router.get("/:requestId", async (req: AuthRequest, res: Response) => {
  try {
    const { requestId } = req.params;
    const { userId, role } = req.user!;

    // Verify user has access to this request
    const request = await prisma.supportRequest.findUnique({ where: { id: requestId } });
    if (!request) return res.status(404).json({ message: "Request not found" });

    const hasAccess =
      role === "ADMIN" || role === "MANAGER" ||
      request.submittedById === userId ||
      request.assignedToId === userId;

    if (!hasAccess) return res.status(403).json({ message: "Access denied" });

    const messages = await prisma.chatMessage.findMany({
      where: { requestId },
      include: { sender: { select: { id: true, name: true, role: true } } },
      orderBy: { createdAt: "asc" },
    });

    res.json(messages);
  } catch (err: any) {
    res.status(500).json({ message: err?.message || "Server error" });
  }
});

// POST /api/chat/:requestId — send a message
router.post("/:requestId", async (req: AuthRequest, res: Response) => {
  try {
    const { requestId } = req.params;
    const { message } = req.body;
    const { userId, role } = req.user!;

    if (!message?.trim()) return res.status(400).json({ message: "Message is required" });

    const request = await prisma.supportRequest.findUnique({ where: { id: requestId } });
    if (!request) return res.status(404).json({ message: "Request not found" });

    const hasAccess =
      role === "ADMIN" || role === "MANAGER" ||
      request.submittedById === userId ||
      request.assignedToId === userId;

    if (!hasAccess) return res.status(403).json({ message: "Access denied" });

    const chatMessage = await prisma.chatMessage.create({
      data: { message: message.trim(), requestId, senderId: userId },
      include: { sender: { select: { id: true, name: true, role: true } } },
    });

    // Notify the other party
    const notifyIds: string[] = [];
    if (request.submittedById !== userId) notifyIds.push(request.submittedById);
    if (request.assignedToId && request.assignedToId !== userId) notifyIds.push(request.assignedToId);

    // Also notify managers if not the sender
    if (role !== "MANAGER" && role !== "ADMIN") {
      const managers = await prisma.user.findMany({ where: { role: "MANAGER", isActive: true } });
      managers.forEach(m => { if (m.id !== userId) notifyIds.push(m.id); });
    }

    const sender = await prisma.user.findUnique({ where: { id: userId }, select: { name: true } });
    for (const uid of [...new Set(notifyIds)]) {
      await prisma.notification.create({
        data: {
          title: "New Chat Message",
          message: `${sender?.name} sent a message on request ${request.requestNumber}`,
          userId: uid,
          requestId,
        },
      });
    }

    res.status(201).json(chatMessage);
  } catch (err: any) {
    res.status(500).json({ message: err?.message || "Server error" });
  }
});

export default router;
