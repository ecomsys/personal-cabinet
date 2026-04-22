import { prisma } from "../../config/prisma.js";
import { ApiError } from "../../utils/api-error.js";

/* =========================
   GET ALL USERS
========================= */
export const getAllUsers = async () => {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      sessions: true,
    },
  });

  return users.map(({ password, ...user }) => user);
};

/* =========================
   GET USER BY ID
========================= */
export const getUserById = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id },
    include: { sessions: true },
  });

  if (!user) {
    throw new ApiError(404, "User not found", "USER_NOT_FOUND");
  }

  const { password, ...safe } = user;
  return safe;
};

/* =========================
   UPDATE USER (admin)
========================= */
export const updateUser = async (id, data) => {
  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) {
    throw new ApiError(404, "User not found", "USER_NOT_FOUND");
  }

  const updated = await prisma.user.update({
    where: { id },
    data: {
      name: data.name,
      status: data.status,
      role: data.role,
    },
  });

  const { password, ...safe } = updated;
  return safe;
};

/* =========================
   DELETE USER
========================= */
export const deleteUser = async (id) => {
  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) {
    throw new ApiError(404, "User not found", "USER_NOT_FOUND");
  }

  await prisma.user.delete({ where: { id } });

  return true;
};