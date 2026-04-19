import express from "express";
import {
  registerController,
  loginController,
  logoutController,
  refreshController,
} from "../controllers/auth.controller.js";

import rateLimit from "express-rate-limit";
import {
  registerLimiter,
  loginLimiter,
  refreshLimiter,
} from "../utils/limits.js";

import { validate } from "../middleware/validate.middleware.js";
import { registerSchema, loginSchema } from "../validators/auth.validator.js";

const router = express.Router();

router.post(
  "/register",
  registerLimiter,
  validate(registerSchema),
  registerController,
);
router.post("/login", loginLimiter, validate(loginSchema), loginController);

router.post("/refresh", refreshLimiter, refreshController);
router.post("/logout", logoutController);

export default router;
