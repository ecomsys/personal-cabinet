import rateLimit from "express-rate-limit";

/* =========================================
   GLOBAL (мягкий щит)
========================================= */
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 1000,
  standardHeaders: true,
  legacyHeaders: false,
});

/* =========================================
   LOGIN (реальная защита от brute force)
========================================= */
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      message: "Too many login attempts",
      code: "LOGIN_RATE_LIMIT",
    },
  },
});

/* =========================================
   REGISTER (anti spam)
========================================= */
export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      message: "Too many registrations",
      code: "REGISTER_RATE_LIMIT",
    },
  },
});

/* =========================================
   REFRESH (защита от token spam)
========================================= */
export const refreshLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
});