// src/middleware/logger.middleware.js
import { logger } from "../utils/logger.js";

export const requestLogger = (req, res, next) => {
  logger.info({
    type: "HTTP_REQUEST",
    requestId: req.requestId,
    method: req.method,
    url: req.url,
    ip: req.ip,
    time: new Date().toISOString(),
  });

  next();
};