import "dotenv/config";
import express from "express";
import cors from "cors";
import { errorHandler, notFound } from "./middleware/errorHandler";

import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import requestRoutes from "./routes/request.routes";
import spareRoutes from "./routes/spare.routes";
import feedbackRoutes from "./routes/feedback.routes";
import assetRoutes from "./routes/asset.routes";
import notificationRoutes from "./routes/notification.routes";
import reportRoutes from "./routes/report.routes";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/api/health", (_req, res) => res.json({ status: "ok", timestamp: new Date().toISOString() }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/spares", spareRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/assets", assetRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/reports", reportRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`✅ ICT Support API running on http://localhost:${PORT}`);
});

export default app;
