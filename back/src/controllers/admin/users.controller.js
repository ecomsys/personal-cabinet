import { success } from "../../utils/response.js";
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../../services/admin/users.service.js";

/* =========================
   GET /admin/users
========================= */
export const getUsersController = async (req, res, next) => {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);

    const result = await getAllUsers({
      page,
      limit,
    });

    return success(res, result);
  } catch (e) {
    next(e);
  }
};

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
   GET /admin/users/:id
========================= */
export const getUserController = async (req, res, next) => {
  try {
    const user = await getUserById(req.params.id);
    return success(res, user);
  } catch (e) {
    next(e);
  }
};

/* =========================
   PATCH /admin/users/:id
========================= */
export const updateUserController = async (req, res, next) => {
  try {
    const user = await updateUser(req.params.id, req.body);
    return success(res, user);
  } catch (e) {
    next(e);
  }
};

/* =========================
   DELETE /admin/users/:id
========================= */
export const deleteUserController = async (req, res, next) => {
  try {
    await deleteUser(req.params.id);
    return success(res, { message: "User deleted" });
  } catch (e) {
    next(e);
  }
};
