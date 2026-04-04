import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import http from "http";
import { Server as SocketServer } from "socket.io";
import { errorHandler, notFound } from "./middleware/errorHandler";

import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import requestRoutes from "./routes/request.routes";
import feedbackRoutes from "./routes/feedback.routes";
import assetRoutes from "./routes/asset.routes";
import notificationRoutes from "./routes/notification.routes";
import reportRoutes from "./routes/report.routes";

const app = express();
const httpServer = http.createServer(app);
const PORT = process.env.PORT || 5000;

// Socket.io setup
export const io = new SocketServer(httpServer, {
  cors: { origin: process.env.CLIENT_URL || "http://localhost:3000", credentials: true },
});

io.on("connection", (socket) => {
  // Each user joins their own room by userId
  socket.on("join", (userId: string) => {
    socket.join(userId);
  });

  socket.on("disconnect", () => {});
});

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get("/api/health", (_req, res) => res.json({ status: "ok", timestamp: new Date().toISOString() }));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/assets", assetRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/reports", reportRoutes);

app.use(notFound);
app.use(errorHandler);

httpServer.listen(PORT, () => {
  console.log(`✅ ICT Support API running on http://localhost:${PORT}`);
});

export default app;
