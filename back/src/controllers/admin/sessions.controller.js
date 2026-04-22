import { success } from "../../utils/response.js";

import {
  getAllSessions,
  getSessionById,
  deleteSession,
  deleteAllSessions,
} from "../../services/admin/sessions.service.js";

/* =========================
   GET /admin/sessions
========================= */
/* =========================
   GET /admin/sessions
========================= */
export const getSessionsController = async (req, res, next) => {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);

    const result = await getAllSessions({
      page,
      limit,
    });

    return success(res, result);
  } catch (e) {
    next(e);
  }
};

/* =========================
   GET /admin/sessions/:id
========================= */
export const getSessionController = async (req, res, next) => {
  try {
    const session = await getSessionById(req.params.id);
    return success(res, session);
  } catch (e) {
    next(e);
  }
};

/* =========================
   DELETE /admin/sessions/:id
========================= */
export const deleteSessionController = async (req, res, next) => {
  try {
    await deleteSession(req.params.id);
    return success(res, { message: "Session disabled" });
  } catch (e) {
    next(e);
  }
};

/* =========================
   DELETE /admin/sessions
========================= */
export const deleteAllSessionsController = async (req, res, next) => {
  try {
    await deleteAllSessions();
    return success(res, { message: "All sessions disabled" });
  } catch (e) {
    next(e);
  }
};