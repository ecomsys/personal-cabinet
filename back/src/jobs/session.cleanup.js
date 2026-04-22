import { prisma } from "../config/prisma.js";
import { logger } from "../utils/logger.js";

const SESSION_TTL_DAYS = 30;

export const cleanupSessions = async () => {
  try {
    const expiredDate = new Date(
      Date.now() - SESSION_TTL_DAYS * 24 * 60 * 60 * 1000
    );

    // =========================
    // 1. CLEANUP (soft condition is optional)
    // =========================
    // Удаляем всё, что:
    // - либо невалидное
    // - либо старше TTL
    const deleted = await prisma.session.deleteMany({
      where: {
        OR: [
          { isValid: false },
          { lastUsedAt: { lt: expiredDate } },
        ],
      },
    });

    logger.info({
      type: "CRON",
      event: "SESSION_CLEANUP",
      deleted: deleted.count,
      expiredDate,
    });
  } catch (e) {
    logger.error({
      type: "CRON",
      event: "SESSION_CLEANUP_FAILED",
      message: e.message,
    });
  }
};