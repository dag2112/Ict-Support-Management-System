import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendEmail(to: string, subject: string, html: string) {
  if (!process.env.SMTP_USER) return; // skip if not configured
  await transporter.sendMail({ from: process.env.SMTP_FROM, to, subject, html });
}

export const emailTemplates = {
  requestSubmitted: (name: string, requestNumber: string) => ({
    subject: `Request ${requestNumber} Submitted`,
    html: `<p>Hi ${name},</p><p>Your ICT support request <strong>${requestNumber}</strong> has been submitted and is pending approval.</p>`,
  }),
  requestApproved: (name: string, requestNumber: string) => ({
    subject: `Request ${requestNumber} Approved`,
    html: `<p>Hi ${name},</p><p>Your request <strong>${requestNumber}</strong> has been <strong style="color:green">approved</strong> and will be assigned to a technician shortly.</p>`,
  }),
  requestRejected: (name: string, requestNumber: string, reason: string) => ({
    subject: `Request ${requestNumber} Rejected`,
    html: `<p>Hi ${name},</p><p>Your request <strong>${requestNumber}</strong> has been <strong style="color:red">rejected</strong>.</p><p>Reason: ${reason}</p>`,
  }),
  taskAssigned: (techName: string, requestNumber: string, title: string) => ({
    subject: `New Task Assigned: ${requestNumber}`,
    html: `<p>Hi ${techName},</p><p>You have been assigned to resolve request <strong>${requestNumber}</strong>: ${title}.</p>`,
  }),
  requestFixed: (name: string, requestNumber: string) => ({
    subject: `Request ${requestNumber} Fixed`,
    html: `<p>Hi ${name},</p><p>Your request <strong>${requestNumber}</strong> has been resolved. Please log in to provide feedback.</p>`,
  }),
};
