import { register, login, refresh, logout } from "../services/auth.service.js";
import { success } from "../utils/response.js";

// Registr
export const registerController = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const data = await register(email, password, {
      userAgent: req.headers["user-agent"],
      ip: req.ip,
    });

    res.cookie("refreshToken", data.tokens.refreshToken, {
      httpOnly: true,
      secure: false,
      // secure: true,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return success(res, {
      user: data.user,
      accessToken: data.tokens.accessToken,
    });
  } catch (e) {
    next(e);
  }
};

// Login
export const loginController = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const data = await login(email, password, {
      userAgent: req.headers["user-agent"],
      ip: req.ip,
    });

    res.cookie("refreshToken", data.tokens.refreshToken, {
      httpOnly: true,
      secure: false,
      // secure: true,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return success(res, {
      user: data.user,
      accessToken: data.tokens.accessToken,
    });
  } catch (e) {
    next(e);
  }
};

// Refresh
export const refreshController = async (req, res, next) => {
  try {
    const data = await refresh(req.cookies.refreshToken, {
      userAgent: req.headers["user-agent"],
      ip: req.ip,
    });

    res.cookie("refreshToken", data.refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return success(res, {
      accessToken: data.accessToken,
    });
  } catch (e) {
    next(e);
  }
};

// Logout
export const logoutController = async (req, res, next) => {
  try {
    await logout(req.cookies.refreshToken);

    res.clearCookie("refreshToken");

    return success(res, { message: "Logged out" });
  } catch (e) {
    next(e);
  }
};
