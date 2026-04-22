// src/routes/admin.routes.js
import express from "express";

import { authMiddleware } from "../middleware/auth.middleware.js";
import { sessionMiddleware } from "../middleware/session.middleware.js";
import { roleMiddleware } from "../middleware/role.middleware.js";

import {
  getUsersController,
  getUserController,
  updateUserController,
  deleteUserController,
} from "../controllers/admin/users.controller.js";

import {
  getSessionsController,
  getSessionController,
  deleteSessionController,
  deleteAllSessionsController,
} from "../controllers/admin/sessions.controller.js";

import { getStatsController } from "../controllers/admin/stats.controller.js";

const router = express.Router();

/* =========================
   USERS ADMIN
========================= */
router.get(
  "/users",
  authMiddleware,
  sessionMiddleware,
  roleMiddleware(["admin"]),
  getUsersController
);

router.get(
  "/users/:id",
  authMiddleware,
  sessionMiddleware,
  roleMiddleware(["admin"]),
  getUserController
);

router.patch(
  "/users/:id",
  authMiddleware,
  sessionMiddleware,
  roleMiddleware(["admin"]),
  updateUserController
);

router.delete(
  "/users/:id",
  authMiddleware,
  sessionMiddleware,
  roleMiddleware(["admin"]),
  deleteUserController
);

/* =========================
   SESSIONS ADMIN
========================= */
router.get(
  "/sessions",
  authMiddleware,
  sessionMiddleware,
  roleMiddleware(["admin"]),
  getSessionsController
);

router.get(
  "/sessions/:id",
  authMiddleware,
  sessionMiddleware,
  roleMiddleware(["admin"]),
  getSessionController
);

router.delete(
  "/sessions/:id",
  authMiddleware,
  sessionMiddleware,
  roleMiddleware(["admin"]),
  deleteSessionController
);

router.delete(
  "/sessions",
  authMiddleware,
  sessionMiddleware,
  roleMiddleware(["admin"]),
  deleteAllSessionsController
);

/* =========================
   STATS ADMIN
========================= */
router.get(
  "/stats",
  authMiddleware,
  sessionMiddleware,
  roleMiddleware(["admin"]),
  getStatsController
);

// ЧТО МОЖНО УЛУЧШИТЬ ?

// Если захочешь “уровень выше”:

// Redis online tracking
// WebSocket presence
// pagination stats
// caching stats (5–10 sec TTL)

export default router;