import { prisma } from "../config/prisma.js";
import { ApiError } from "../utils/api-error.js";

export const getMe = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new ApiError(404, "User not found", "AUTH_USER_NOT_FOUND");
  }

  const { password, ...safeUser } = user;

  return safeUser;
};
