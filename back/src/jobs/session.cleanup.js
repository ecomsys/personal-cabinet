import { prisma } from "../config/prisma.js";
import { logger } from "../utils/logger.js";

const SESSION_TTL_DAYS = 30;

export const cleanupSessions = async () => {
  try {
    const expiredDate = new Date(
      Date.now() - SESSION_TTL_DAYS * 24 * 60 * 60 * 1000
    );

    // сначала мягкая деактивация
    const deactivated = await prisma.session.updateMany({
      where: {
        OR: [
          { isValid: false },
          { lastUsedAt: { lt: expiredDate } },
        ],
      },
      data: {
        isValid: false,
      },
    });

    // потом физическое удаление старого мусора
    const deleted = await prisma.session.deleteMany({
      where: {
        isValid: false,
        lastUsedAt: { lt: expiredDate },
      },
    });

    logger.info({
      type: "CRON",
      event: "SESSION_CLEANUP",
      deactivated: deactivated.count,
      deleted: deleted.count,
    });
  } catch (e) {
    logger.error({
      type: "CRON",
      event: "SESSION_CLEANUP_FAILED",
      message: e.message,
    });
  }
};