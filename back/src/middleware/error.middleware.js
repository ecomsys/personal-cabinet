// src/middleware/error.middleware.js

import { logger } from "../utils/logger.js";

export const errorMiddleware = (err, req, res, next) => {
  const status = err.status || 500;

  logger.error({
    message: err.message,
    code: err.code,
    status,
    url: req.url,
    method: req.method,
    time: new Date().toISOString(),
  });

  return res.status(status).json({
    success: false,
    error: {
      message: err.message || "Internal server error",
      code: err.code || "INTERNAL_ERROR",
      details: err.details || null,
    },
  });
};
