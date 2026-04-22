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
    const users = await getAllUsers();
    return success(res, users);
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