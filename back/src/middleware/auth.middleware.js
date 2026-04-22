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
      return next(
        new ApiError(401, "Access token expired", "AUTH_ACCESS_TOKEN_EXPIRED")
      );
    }

    // ВАЖНО: проверяем сессию
    const session = await prisma.session.findUnique({
      where: { id: decoded.sid },
    });

    if (!session || !session.isValid) {
      return next(
        new ApiError(401, "Session revoked", "AUTH_SESSION_REVOKED")
      );
    }

    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    req.sessionId = decoded.sid;

    next();
  } catch (e) {
    return next(new ApiError(401, "Unauthorized", "AUTH_UNAUTHORIZED"));
  }
};