import { ApiError } from "../utils/api-error.js"

export const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (e) {
    return next(new ApiError(400, "Validation error", "VALIDATION_ERROR"));
  }
};
