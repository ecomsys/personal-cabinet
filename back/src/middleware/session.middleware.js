// src/middleware/session.middleware.js

import { prisma } from "../config/prisma.js";
import { ApiError } from "../utils/api-error.js";

const SHOULD_UPDATE_INTERVAL = 60 * 1000; // 1 минута

let cachedSession = null;

export const sessionMiddleware = async (req, res, next) => {
  try {
    if (!req.sessionId || !req.user?.id) {
      return next(new ApiError(401, "Unauthorized", "AUTH_UNAUTHORIZED"));
    }

    if (!cachedSession) {
      cachedSession = await prisma.session.findUnique({
        where: { id: req.sessionId },
      });
    }

    const session = cachedSession;

    if (!session || !session.isValid) {
      return next(new ApiError(401, "Session expired", "AUTH_SESSION_EXPIRED"));
    }

    // device/IP update (лёгкий трекинг)
    const now = Date.now();
    const last = new Date(session.lastUsedAt).getTime();

    if (now - last > SHOULD_UPDATE_INTERVAL) {
      await prisma.session.update({
        where: { id: session.id },
        data: {
          lastUsedAt: new Date(),
        },
      });
    }

    req.session = session;

    next();
  } catch (e) {
    return next(new ApiError(401, "Session error", "AUTH_SESSION_ERROR"));
  }
};
