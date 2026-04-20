import { ApiError } from "../utils/api-error.js";

export const csrfMiddleware = (req, res, next) => {
  const origin = req.headers.origin;

  const allowedOrigins = [
    "http://localhost:5173",
  ];

  if (!allowedOrigins.includes(origin)) {
    return next(
      new ApiError(403, "Invalid origin", "CSRF_BLOCKED")
    );
  }

  next();
};