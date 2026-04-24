import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import cron from "node-cron";
import { logger } from "./utils/logger.js";
import { cleanupSessions } from "./jobs/session.cleanup.js";

import rateLimit from "express-rate-limit";
import { globalLimiter } from "./utils/limits.js";
import { errorMiddleware } from "./middleware/error.middleware.js";
import { requestIdMiddleware } from "./middleware/requestId.middleware.js";
import { requestLogger } from "./middleware/logger.middleware.js";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import adminRoutes from "./routes/admin.routes.js";

let isCleaning = false;
const isProd = process.env.NODE_ENV === "production";
const prodUrl = process.env.PROD_URL?.trim();

const app = express();

app.set("trust proxy", 1);

app.use(requestIdMiddleware);

const allowedOrigins = isProd && prodUrl
  ? [prodUrl]
  : ["http://localhost:5173", "http://localhost:4173"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(null, true); // fallback (или false если хочешь строго)
    },
    credentials: true,
  }),
);

if (!isProd) {
  app.use("/uploads", express.static("uploads"));
}

app.use(express.json());
app.use(cookieParser());

app.use(globalLimiter);
app.use(requestLogger);

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);

app.use(errorMiddleware);

// каждый час очищаем невалидные сессии
cron.schedule("0 * * * *", async () => {
  if (isCleaning) return;

  isCleaning = true;

  try {
    await cleanupSessions();

    logger.info({
      type: "CRON",
      event: "SESSION_CLEANUP_SUCCESS",
    });
  } catch (e) {
    logger.error({
      type: "CRON",
      event: "SESSION_CLEANUP_FAILED",
      message: e.message,
    });
  } finally {
    isCleaning = false;
  }
});

export default app;
