// src/middleware/auth.middleware.js

import jwt from "jsonwebtoken";
import { prisma } from "../config/prisma.js";
import { ApiError } from "../utils/api-error.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header?.startsWith("Bearer ")) {
      return next(new ApiError(401, "No token", "AUTH_NO_TOKEN"));
    }

    const token = header.split(" ")[1];

    let decoded;

    try {
      decoded = jwt.verify(token, process.env.ACCESS_SECRET);
    } catch {
      return next(new ApiError(401, "Invalid token", "AUTH_INVALID_TOKEN"));
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      return next(new ApiError(401, "User not found", "AUTH_USER_NOT_FOUND"));
    }

    const session = await prisma.session.findUnique({
      where: {
        id: decoded.sid,
      },
    });

    if (!session || !session.isValid) {
      return next(new ApiError(401, "Session expired", "AUTH_SESSION_EXPIRED"));
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (e) {
    return next(new ApiError(401, "Unauthorized", "AUTH_UNAUTHORIZED"));
  }
};
