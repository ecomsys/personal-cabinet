import jwt from "jsonwebtoken"
import { ApiError } from "../utils/api-error.js"

export const authMiddleware = (req, res, next) => {
  try {
    const header = req.headers.authorization

    if (!header) {
      return next(new ApiError(
        401,
        "No token",
        "AUTH_NO_TOKEN"
      ))
    }

    const token = header.split(" ")[1]
    const user = jwt.verify(token, process.env.ACCESS_SECRET);

    req.user = user

    next()
  } catch (e) {
    next(new ApiError(
      401,
      "Invalid token",
      "AUTH_INVALID_TOKEN"
    ))
  }
}