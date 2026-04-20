import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { sessionMiddleware } from "../middleware/session.middleware.js";

import {
  me,
  sessions,
  deleteSessionController,
  deleteOtherSessionsController,
} from "../controllers/user.controller.js";

const router = express.Router();

// lightweight route (можно без sessionMiddleware, но оставим пока стабильно)
router.get("/me", authMiddleware, sessionMiddleware, me);

router.get("/sessions", authMiddleware, sessionMiddleware, sessions);

router.delete(
  "/sessions/:sessionId",
  authMiddleware,
  sessionMiddleware,
  deleteSessionController
);

router.delete(
  "/sessions",
  authMiddleware,
  sessionMiddleware,
  deleteOtherSessionsController
);

export default router;