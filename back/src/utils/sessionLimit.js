import { prisma } from "../config/prisma.js";
/*======================================================================================================
Session limit
=======================================================================================================*/
const MAX_SESSIONS = 5;

export const enforceSessionLimit = async (userId) => {
  const sessions = await prisma.session.findMany({
    where: {
      userId,
      isValid: true,
    },
    orderBy: {
      createdAt: "asc", // самые старые первые
    },
  });

  if (sessions.length < MAX_SESSIONS) return;

  const toDelete = sessions.slice(0, sessions.length - MAX_SESSIONS + 1);

  await prisma.session.updateMany({
    where: {
      id: { in: toDelete.map((s) => s.id) },
    },
    data: {
      isValid: false,
    },
  });
};
