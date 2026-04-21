import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { sessionMiddleware } from "../middleware/session.middleware.js";

import { validate } from "../middleware/validate.middleware.js";
import { uploadAvatar } from "../middleware/upload.middleware.js";

import {
  updateProfileSchema,
  changePasswordSchema,
  changeEmailSchema,
} from "../validators/user.validator.js";

import {
  me,
  updateProfileController,
  changePasswordController,
  changeEmailController,
  updateAvatarController,
  sessions,
  deleteSessionController,
  deleteOtherSessionsController,
} from "../controllers/user.controller.js";

const router = express.Router();

// lightweight route (можно без sessionMiddleware, но оставим пока стабильно)
router.get("/me", authMiddleware, sessionMiddleware, me);

// PATCH /api/user/profile
// {
//   "name": "John",
//   "status": "coding",
//   "avatarUrl": "https://site.com/avatar.png"
// }
router.patch(
  "/profile",
  authMiddleware,
  sessionMiddleware,
  validate(updateProfileSchema),
  updateProfileController,
);

// PATCH /api/user/password
// {
//   "currentPassword": "old123",
//   "newPassword": "new123456"
// }
router.patch(
  "/password",
  authMiddleware,
  sessionMiddleware,
  validate(changePasswordSchema),
  changePasswordController,
);

// PATCH /api/user/email
// {
//   "newEmail": "new@mail.com",
//   "password": "currentPassword123"
// }
router.patch(
  "/email",
  authMiddleware,
  sessionMiddleware,
  validate(changeEmailSchema),
  changeEmailController
);

// Как фронт отправляет
// PATCH /api/user/avatar
// Content-Type: multipart/form-data
// avatar: file
router.patch(
  "/avatar",
  authMiddleware,
  sessionMiddleware,
  uploadAvatar.single("avatar"),
  updateAvatarController
);

router.get("/sessions", authMiddleware, sessionMiddleware, sessions);

router.delete(
  "/sessions/:sessionId",
  authMiddleware,
  sessionMiddleware,
  deleteSessionController,
);

router.delete(
  "/sessions",
  authMiddleware,
  sessionMiddleware,
  deleteOtherSessionsController,
);

export default router;
