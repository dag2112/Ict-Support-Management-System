import { Router, Response } from "express";
import { prisma } from "../lib/prisma";
import { authenticate, authorize, AuthRequest } from "../middleware/auth";
import { RequestStatus, Urgency, Role } from "@prisma/client";
import { sendEmail, emailTemplates } from "../lib/mailer";
import { upload } from "../lib/upload";
import { createNotification } from "../lib/notify";

const router = Router();
router.use(authenticate);

const requestSelect = {
  id: true, requestNumber: true, title: true, description: true,
  issueType: true, urgency: true, status: true, location: true,
  rejectionReason: true, resolutionNote: true, createdAt: true, updatedAt: true,
  attachments: true,
  submittedBy: { select: { id: true, name: true, email: true } },
  assignedTo: { select: { id: true, name: true, email: true } },
  approvedBy: { select: { id: true, name: true } },
  feedback: true,
};

// GET /api/requests
router.get("/", async (req: AuthRequest, res: Response) => {
  try {
    const { status, urgency, issueType, search, page = "1", limit = "20" } = req.query;
    const { userId, role } = req.user!;
    const where: any = {};

    if (role === "REQUESTER") where.submittedById = userId;
    if (role === "TECHNICIAN") where.assignedToId = userId;
    if (status) where.status = status as RequestStatus;
    if (urgency) where.urgency = urgency as Urgency;
    if (issueType) where.issueType = issueType as string;
    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: "insensitive" } },
        { requestNumber: { contains: search as string, mode: "insensitive" } },
        { description: { contains: search as string, mode: "insensitive" } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [requests, total] = await Promise.all([
      prisma.supportRequest.findMany({ where, select: requestSelect, orderBy: { createdAt: "desc" }, skip, take: Number(limit) }),
      prisma.supportRequest.count({ where }),
    ]);

    res.json({ requests, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err: any) {
    res.status(500).json({ message: err?.message || "Server error" });
  }
});

// GET /api/requests/:id
router.get("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const request = await prisma.supportRequest.findUnique({
      where: { id: req.params.id },
      select: requestSelect,
    });
    if (!request) return res.status(404).json({ message: "Request not found" });
    res.json(request);
  } catch (err: any) {
    res.status(500).json({ message: err?.message || "Server error" });
  }
});

// POST /api/requests — Requester submits
router.post("/", authorize("REQUESTER"), upload.array("attachments", 3), async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, issueType, urgency, location } = req.body;
    if (!title || !description || !issueType)
      return res.status(400).json({ message: "title, description and issueType are required" });

    const count = await prisma.supportRequest.count();
    const requestNumber = `REQ-${String(count + 1).padStart(4, "0")}`;
    const files = (req.files as Express.Multer.File[]) || [];
    const attachments = files.map((f) => `/uploads/${f.filename}`);

    const request = await prisma.supportRequest.create({
      data: {
        requestNumber, title, description, issueType,
        urgency: (urgency as Urgency) || Urgency.MEDIUM,
        location: location || null,
        submittedById: req.user!.userId,
        attachments,
      },
      select: requestSelect,
    });

    // Notify all managers in real-time
    const managers = await prisma.user.findMany({ where: { role: Role.MANAGER, isActive: true } });
    for (const manager of managers) {
      await createNotification(manager.id, "New Request Pending Approval", `Request ${requestNumber} needs your review.`, request.id);
    }

    try {
      const submitter = await prisma.user.findUnique({ where: { id: req.user!.userId } });
      if (submitter) {
        const { subject, html } = emailTemplates.requestSubmitted(submitter.name, requestNumber);
        await sendEmail(submitter.email, subject, html);
      }
    } catch (e: any) { console.warn("[Email]", e?.message); }

    res.status(201).json(request);
  } catch (err: any) {
    console.error("[POST /requests]", err?.message);
    res.status(500).json({ message: err?.message || "Server error" });
  }
});

// PUT /api/requests/:id/approve — Manager
router.put("/:id/approve", authorize("MANAGER"), async (req: AuthRequest, res: Response) => {
  try {
    const request = await prisma.supportRequest.findUnique({ where: { id: req.params.id }, include: { submittedBy: true } });
    if (!request) return res.status(404).json({ message: "Request not found" });
    if (request.status !== RequestStatus.PENDING)
      return res.status(400).json({ message: "Only pending requests can be approved" });

    const updated = await prisma.supportRequest.update({
      where: { id: req.params.id },
      data: { status: RequestStatus.APPROVED, approvedById: req.user!.userId },
      select: requestSelect,
    });

    await createNotification(request.submittedById, "Request Approved", `Your request ${request.requestNumber} has been approved.`, request.id);

    try {
      const { subject, html } = emailTemplates.requestApproved(request.submittedBy.name, request.requestNumber);
      await sendEmail(request.submittedBy.email, subject, html);
    } catch (e: any) { console.warn("[Email]", e?.message); }

    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ message: err?.message || "Server error" });
  }
});

// PUT /api/requests/:id/reject — Manager
router.put("/:id/reject", authorize("MANAGER"), async (req: AuthRequest, res: Response) => {
  try {
    const { rejectionReason } = req.body;
    if (!rejectionReason) return res.status(400).json({ message: "Rejection reason is required" });

    const request = await prisma.supportRequest.findUnique({ where: { id: req.params.id }, include: { submittedBy: true } });
    if (!request) return res.status(404).json({ message: "Request not found" });
    if (request.status !== RequestStatus.PENDING)
      return res.status(400).json({ message: "Only pending requests can be rejected" });

    const updated = await prisma.supportRequest.update({
      where: { id: req.params.id },
      data: { status: RequestStatus.REJECTED, rejectionReason, approvedById: req.user!.userId },
      select: requestSelect,
    });

    await createNotification(request.submittedById, "Request Rejected", `Your request ${request.requestNumber} was rejected: ${rejectionReason}`, request.id);

    try {
      const { subject, html } = emailTemplates.requestRejected(request.submittedBy.name, request.requestNumber, rejectionReason);
      await sendEmail(request.submittedBy.email, subject, html);
    } catch (e: any) { console.warn("[Email]", e?.message); }

    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ message: err?.message || "Server error" });
  }
});

// PUT /api/requests/:id/assign — Manager
router.put("/:id/assign", authorize("MANAGER"), async (req: AuthRequest, res: Response) => {
  try {
    const { technicianId } = req.body;
    if (!technicianId) return res.status(400).json({ message: "technicianId is required" });

    const request = await prisma.supportRequest.findUnique({ where: { id: req.params.id }, include: { submittedBy: true } });
    if (!request) return res.status(404).json({ message: "Request not found" });
    if (request.status !== RequestStatus.APPROVED)
      return res.status(400).json({ message: "Only approved requests can be assigned" });

    const technician = await prisma.user.findUnique({ where: { id: technicianId } });
    if (!technician) return res.status(404).json({ message: "Technician not found" });

    const updated = await prisma.supportRequest.update({
      where: { id: req.params.id },
      data: { status: RequestStatus.ASSIGNED, assignedToId: technicianId },
      select: requestSelect,
    });

    await createNotification(technicianId, "Task Assigned", `You have been assigned to request ${request.requestNumber}: ${request.title}`, request.id);

    try {
      const { subject, html } = emailTemplates.taskAssigned(technician.name, request.requestNumber, request.title);
      await sendEmail(technician.email, subject, html);
    } catch (e: any) { console.warn("[Email]", e?.message); }

    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ message: err?.message || "Server error" });
  }
});

// PUT /api/requests/:id/status — Technician updates status
router.put("/:id/status", authorize("TECHNICIAN"), async (req: AuthRequest, res: Response) => {
  try {
    const { status, resolutionNote } = req.body;
    const allowed: RequestStatus[] = [RequestStatus.FIXED, RequestStatus.ESCALATED, RequestStatus.NEED_SPARE];
    if (!allowed.includes(status))
      return res.status(400).json({ message: "Invalid status. Use FIXED, ESCALATED, or NEED_SPARE" });

    const request = await prisma.supportRequest.findUnique({ where: { id: req.params.id }, include: { submittedBy: true } });
    if (!request) return res.status(404).json({ message: "Request not found" });
    if (request.assignedToId !== req.user!.userId)
      return res.status(403).json({ message: "You are not assigned to this request" });

    const updated = await prisma.supportRequest.update({
      where: { id: req.params.id },
      data: { status, resolutionNote },
      select: requestSelect,
    });

    if (status === RequestStatus.FIXED) {
      await createNotification(request.submittedById, "Request Fixed 🎉", `Your request ${request.requestNumber} has been resolved.`, request.id);
      try {
        const { subject, html } = emailTemplates.requestFixed(request.submittedBy.name, request.requestNumber);
        await sendEmail(request.submittedBy.email, subject, html);
      } catch (e: any) { console.warn("[Email]", e?.message); }
    }

    if (status === RequestStatus.ESCALATED || status === RequestStatus.NEED_SPARE) {
      const managers = await prisma.user.findMany({ where: { role: Role.MANAGER, isActive: true } });
      const msg = status === RequestStatus.ESCALATED
        ? `Request ${request.requestNumber} has been escalated.`
        : `Request ${request.requestNumber} needs a spare part.`;
      const title = status === RequestStatus.ESCALATED ? "Request Escalated ⚠️" : "Spare Part Needed 🔩";
      for (const manager of managers) {
        await createNotification(manager.id, title, msg, request.id);
      }
    }

    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ message: err?.message || "Server error" });
  }
});

// PUT /api/requests/:id/escalate — Requester escalates
router.put("/:id/escalate", authorize("REQUESTER"), async (req: AuthRequest, res: Response) => {
  try {
    const request = await prisma.supportRequest.findUnique({ where: { id: req.params.id } });
    if (!request) return res.status(404).json({ message: "Request not found" });

    const updated = await prisma.supportRequest.update({
      where: { id: req.params.id },
      data: { status: RequestStatus.ESCALATED },
      select: requestSelect,
    });

    const managers = await prisma.user.findMany({ where: { role: Role.MANAGER, isActive: true } });
    for (const manager of managers) {
      await createNotification(manager.id, "Request Escalated ⚠️", `Request ${request.requestNumber} has been escalated by the requester.`, request.id);
    }

    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ message: err?.message || "Server error" });
  }
});

export default router;
