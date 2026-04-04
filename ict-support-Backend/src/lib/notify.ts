import { prisma } from "./prisma";
import { io } from "../server";

export async function createNotification(
  userId: string,
  title: string,
  message: string,
  requestId?: string
) {
  const notification = await prisma.notification.create({
    data: { title, message, userId, requestId },
  });

  // Emit real-time to the user's socket room
  io.to(userId).emit("notification", {
    id: notification.id,
    title,
    message,
    isRead: false,
    requestId,
    createdAt: notification.createdAt,
  });

  return notification;
}
