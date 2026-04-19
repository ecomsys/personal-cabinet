import { ApiError } from "../utils/api-error.js";

export const roleMiddleware = (roles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(
        new ApiError(
          401,
          "Unauthorized",
          "AUTH_UNAUTHORIZED"
        )
      );
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError(
          403,
          "Forbidden",
          "AUTH_FORBIDDEN"
        )
      );
    }

    next();
  };
};