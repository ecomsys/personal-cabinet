import rateLimit from "express-rate-limit"

// глобальный лимит от брутфорса
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false
})

// лимит на логин - 5 раз
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 500,
  message: {
    success: false,
    error: {
      message: "Too many login attempts",
      code: "LOGIN_RATE_LIMIT"
    }
  }
})

// лимит на регистрацию 3 раза
export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 300,
  message: {
    success: false,
    error: {
      message: "Too many registrations",
      code: "REGISTER_RATE_LIMIT"
    }
  }
})

// лимит для рефреш 30 раз за 15 минут
export const refreshLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300
})