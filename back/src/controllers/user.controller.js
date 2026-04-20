// src/controllers/user.controller.js

import { success } from "../utils/response.js"
import { getMe } from "../services/user.service.js"

export const me = async (req, res, next) => {
  try {
    const user = await getMe(req.user.id)

    return success(res, user)
  } catch (e) {
    next(e)
  }
}