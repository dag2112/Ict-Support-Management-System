import { Router, Response } from "express";
import { prisma } from "../lib/prisma";
import { authenticate, authorize, AuthRequest } from "../middleware/auth";

const router = Router();
router.use(authenticate);

// POST /api/feedback — Requester submits feedback
router.post("/", authorize("REQUESTER"), async (req: AuthRequest, res: Response) => {
  try {
    const { requestId, rating, comment } = req.body;
    if (!requestId || !rating)
      return res.status(400).json({ message: "requestId and rating are required" });
    if (rating < 1 || rating > 5)
      return res.status(400).json({ message: "Rating must be between 1 and 5" });

    const request = await prisma.supportRequest.findUnique({ where: { id: requestId } });
    if (!request) return res.status(404).json({ message: "Request not found" });
    if (request.submittedById !== req.user!.userId)
      return res.status(403).json({ message: "You can only give feedback on your own requests" });
    if (request.status !== "FIXED")
      return res.status(400).json({ message: "Feedback can only be given on fixed requests" });

    const existing = await prisma.feedback.findUnique({ where: { requestId } });
    if (existing) return res.status(409).json({ message: "Feedback already submitted for this request" });

    const feedback = await prisma.feedback.create({
      data: { requestId, rating, comment, userId: req.user!.userId },
    });

    res.status(201).json(feedback);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/feedback — Manager/Admin views all feedback
router.get("/", authorize("MANAGER", "ADMIN"), async (_req, res: Response) => {
  try {
    const feedbacks = await prisma.feedback.findMany({
      include: {
        request: { select: { requestNumber: true, title: true } },
        user: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(feedbacks);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
