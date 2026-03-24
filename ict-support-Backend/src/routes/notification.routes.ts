import { Router, Response } from "express";
import { prisma } from "../lib/prisma";
import { authenticate, AuthRequest } from "../middleware/auth";

const router = Router();
router.use(authenticate);

// GET /api/notifications — current user's notifications
router.get("/", async (req: AuthRequest, res: Response) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user!.userId },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    res.json(notifications);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/notifications/:id/read
router.put("/:id/read", async (req: AuthRequest, res: Response) => {
  try {
    const notification = await prisma.notification.findUnique({ where: { id: req.params.id } });
    if (!notification || notification.userId !== req.user!.userId)
      return res.status(404).json({ message: "Notification not found" });

    const updated = await prisma.notification.update({ where: { id: req.params.id }, data: { isRead: true } });
    res.json(updated);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/notifications/read-all
router.put("/read-all", async (req: AuthRequest, res: Response) => {
  try {
    await prisma.notification.updateMany({ where: { userId: req.user!.userId, isRead: false }, data: { isRead: true } });
    res.json({ message: "All notifications marked as read" });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
