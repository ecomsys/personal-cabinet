// src/routes/admin.routes.js

import express from "express"
import { authMiddleware } from "../middleware/auth.middleware.js"
import { sessionMiddleware } from "../middleware/session.middleware.js"
import { roleMiddleware } from "../middleware/role.middleware.js"

const router = express.Router()

router.get(
    "/panel",
    authMiddleware,
    sessionMiddleware,
    roleMiddleware(["admin"]),
    (req, res) => {
        res.json({
            message: "Welcome admin panel",
            user: req.user
        })
    }
)

export default router