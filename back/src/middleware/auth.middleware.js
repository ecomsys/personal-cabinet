// src/middleware/auth.middleware.js

import jwt from "jsonwebtoken";
import { ApiError } from "../utils/api-error.js";

export const authMiddleware = (req, res, next) => {
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
      return next(new ApiError(401, "Access token expired", "AUTH_ACCESS_TOKEN_EXPIRED"));
    }
 
    
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    req.sessionId = decoded.sid;

    next();
  } catch (e) {
    return next(
      new ApiError(401, "Unauthorized", "AUTH_UNAUTHORIZED")
    );
  }
};