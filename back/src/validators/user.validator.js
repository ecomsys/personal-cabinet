// src/validators/user.validator.js

import { z } from "zod"

export const updateProfileSchema = z.object({
  name: z.string().min(1).max(50).optional(),
  avatarUrl: z.string().url().optional(),
  status: z.string().max(100).optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(6),
});

export const changeEmailSchema = z.object({
  newEmail: z.string().email(),
  password: z.string().min(6),
});