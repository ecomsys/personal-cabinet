// src/utils/helpers.js

import { prisma } from "../config/prisma.js";

/* ==================================
  BASE URL
===================================== */
export const getBaseUrl = (req) => {
  return `${req.protocol}://${req.get("host")}`;
};

/* ==================================
   INVALIDATE OTHER SESSIONS => VOID
===================================== */
export const invalidateOtherSessions = async (userId, sessionId) => {
  await prisma.session.updateMany({
    where: {
      userId,
      id: { not: sessionId },
    },
    data: {
      isValid: false,
    },
  });
};

/* =========================
   DEVICE VALIDATE (TRUE/FALSE)
========================= */
export const validateDevice = (session, meta) => {
  return (
    !session.deviceId ||
    !meta?.deviceId ||
    session.deviceId === meta.deviceId
  );
};