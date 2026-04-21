// src/middleware/validate.middleware.js
import { ZodError } from "zod";
import { ApiError } from "../utils/api-error.js";

export const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (e) {
    if (e instanceof ZodError) {
      const details = (e.issues || []).map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));

      return next(
        new ApiError(
          400,
          "Validation error",
          "VALIDATION_ERROR",
          details
        )
      );
    }

    return next(
      new ApiError(400, "Validation error", "VALIDATION_ERROR")
    );
  }
};