// src/controllers/user.controller.js
import { ApiError } from "../utils/api-error.js";

import { success } from "../utils/response.js";
import {
  getMe,
  updateProfile,
  changePassword,
  changeEmail,
  updateAvatar,
  getSessions,
  deleteSession,
  deleteOtherSessions,
} from "../services/user.service.js";

/*======================================================================================================
Get user
=======================================================================================================*/
export const me = async (req, res, next) => {
  try {
    const user = await getMe(req.user.id);

    return success(res, user);
  } catch (e) {
    next(e);
  }
};

/*======================================================================================================
Update profile
=======================================================================================================*/
export const updateProfileController = async (req, res, next) => {
  try {
    const user = await updateProfile(req.user.id, req.body);

    return success(res, user);
  } catch (e) {
    next(e);
  }
};

/*======================================================================================================
Change password
=======================================================================================================*/
export const changePasswordController = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    await changePassword(
      req.user.id,
      currentPassword,
      newPassword,
      req.sessionId,
    );

    return success(res, { message: "Password updated" });
  } catch (e) {
    next(e);
  }
};

/*======================================================================================================
Change email
=======================================================================================================*/
export const changeEmailController = async (req, res, next) => {
  try {
    const { newEmail, password } = req.body;

    await changeEmail(req.user.id, newEmail, password, req.sessionId);

    return success(res, { message: "Email updated" });
  } catch (e) {
    next(e);
  }
};

/*======================================================================================================
Update avatar
=======================================================================================================*/
export const updateAvatarController = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new ApiError(400, "No file uploaded", "NO_FILE");
    }

    const user = await updateAvatar(req.user.id, req.file.filename);

    return success(res, user);
  } catch (e) {
    next(e);
  }
};

/*======================================================================================================
Get all sessions
=======================================================================================================*/
export const sessions = async (req, res, next) => {
  try {
    const data = await getSessions(req.user.id, req.sessionId);
    return success(res, data);
  } catch (e) {
    next(e);
  }
};

/*======================================================================================================
Delete one session
=======================================================================================================*/
export const deleteSessionController = async (req, res, next) => {
  try {
    if (req.params.sessionId === req.sessionId) {
      throw new ApiError(
        400,
        "Cannot delete current session",
        "INVALID_DELETE_CURRENT_SESSION",
      );
    }

    await deleteSession(req.user.id, req.params.sessionId);

    return success(res, { message: "Session removed" });
  } catch (e) {
    next(e);
  }
};

/*======================================================================================================
Delete other sessions
=======================================================================================================*/
export const deleteOtherSessionsController = async (req, res, next) => {
  try {
    await deleteOtherSessions(req.user.id, req.sessionId);
    return success(res, { message: "Other sessions removed" });
  } catch (e) {
    next(e);
  }
};
