import { Router, Response } from "express";
import { prisma } from "../lib/prisma";
import { authenticate, authorize } from "../middleware/auth";

const router = Router();
router.use(authenticate, authorize("MANAGER", "ADMIN"));

// GET /api/reports/summary
router.get("/summary", async (_req, res: Response) => {
  try {
    const [total, pending, approved, assigned, fixed, escalated, rejected] = await Promise.all([
      prisma.supportRequest.count(),
      prisma.supportRequest.count({ where: { status: "PENDING" } }),
      prisma.supportRequest.count({ where: { status: "APPROVED" } }),
      prisma.supportRequest.count({ where: { status: "ASSIGNED" } }),
      prisma.supportRequest.count({ where: { status: "FIXED" } }),
      prisma.supportRequest.count({ where: { status: "ESCALATED" } }),
      prisma.supportRequest.count({ where: { status: "REJECTED" } }),
    ]);

    const byIssueType = await prisma.supportRequest.groupBy({
      by: ["issueType"],
      _count: { id: true },
    });

    const byUrgency = await prisma.supportRequest.groupBy({
      by: ["urgency"],
      _count: { id: true },
    });

    const avgRating = await prisma.feedback.aggregate({ _avg: { rating: true } });

    res.json({
      total, pending, approved, assigned, fixed, escalated, rejected,
      byIssueType: byIssueType.map((r) => ({ issueType: r.issueType, count: r._count.id })),
      byUrgency: byUrgency.map((r) => ({ urgency: r.urgency, count: r._count.id })),
      avgFeedbackRating: avgRating._avg.rating,
    });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/reports/technician-performance
router.get("/technician-performance", async (_req, res: Response) => {
  try {
    const technicians = await prisma.user.findMany({ where: { role: "TECHNICIAN" } });

    const performance = await Promise.all(
      technicians.map(async (tech) => {
        const [assigned, fixed, escalated] = await Promise.all([
          prisma.supportRequest.count({ where: { assignedToId: tech.id } }),
          prisma.supportRequest.count({ where: { assignedToId: tech.id, status: "FIXED" } }),
          prisma.supportRequest.count({ where: { assignedToId: tech.id, status: "ESCALATED" } }),
        ]);
        return { id: tech.id, name: tech.name, assigned, fixed, escalated, fixRate: assigned > 0 ? Math.round((fixed / assigned) * 100) : 0 };
      })
    );

    res.json(performance);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/reports/audit-logs — Admin only
router.get("/audit-logs", authorize("ADMIN"), async (_req, res: Response) => {
  try {
    const logs = await prisma.auditLog.findMany({
      include: { user: { select: { name: true, role: true } } },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    res.json(logs);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
