import { api } from "./axios";
import { authClient } from "./authClient";

export const request = async (config) => {
  try {
    return await api(config);
  } catch (err) {
    const original = config;
    const status = err.response?.status;
    const backendError = err.response?.data?.error;
    const code = backendError?.code;

    // НЕ 401 — просто ошибка
    if (status !== 401) {
      throw {
        message: backendError?.message || "Request error",
        code: code || "UNKNOWN_ERROR",
        status,
      };
    }

    // 401 → refresh ТОЛЬКО если access token истёк
    if (code === "AUTH_ACCESS_TOKEN_EXPIRED") {
      try {
        const token = await authClient.refresh();

        original.headers = {
          ...original.headers,
          Authorization: `Bearer ${token}`,
        };

        return await api(original);
      } catch {
        throw {
          message: "Session expired",
          code: "AUTH_SESSION_EXPIRED",
          status: 401,
        };
      }
    }

    // все остальные 401 — без refresh
    throw {
      message: backendError?.message || "Unauthorized",
      code: code || "AUTH_UNAUTHORIZED",
      status: 401,
    };
  }
};