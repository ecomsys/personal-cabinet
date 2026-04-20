// src/routes/user.routes.js

import express from "express"
import { me } from "../controllers/user.controller.js"
import { authMiddleware } from "../middleware/auth.middleware.js"

const router = express.Router()

router.get("/me", authMiddleware, me)

export default router