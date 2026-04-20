import { prisma } from "../config/prisma.js";
import { logger } from "../utils/logger.js";

export const detectSuspiciousActivity = async (userId, meta) => {
  const lastSession = await prisma.session.findFirst({
    where: {
      userId,
      isValid: true,
    },
    orderBy: {
      lastUsedAt: "desc",
    },
  });

  if (!lastSession) return;

  // смена IP
  if (lastSession.ip && meta?.ip && lastSession.ip !== meta.ip) {
    logger.warn({
      type: "SECURITY",
      event: "IP_CHANGED",
      userId,
      ip: meta.ip,
      deviceId: meta.deviceId,
    });
  }

  // смена устройства
  if (
    lastSession.deviceId &&
    meta?.deviceId &&
    lastSession.deviceId !== meta.deviceId
  ) {
    logger.warn({
      type: "SECURITY",
      event: "NEW_DEVICE",
      userId,
      ip: meta.ip,
      deviceId: meta.deviceId,
    });
  }
};
