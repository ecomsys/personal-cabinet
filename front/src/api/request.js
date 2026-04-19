import { api } from "./axios";
import { authClient } from "./authClient";

export const request = async (config) => {
  try {
    return await api(config);
  } catch (err) {
    const original = config;
    const status = err.response?.status;
    const backendError = err.response?.data?.error;

    // если не 401 → просто ошибка
    if (status !== 401) {
      throw {
        message: backendError?.message || "Request error",
        code: backendError?.code || "UNKNOWN_ERROR",
        status,
      };
    }

    // пробуем refresh
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
};
