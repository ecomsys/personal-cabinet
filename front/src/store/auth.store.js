import { create } from "zustand";
import { request } from "@/api/request";
import { setAccessToken } from "@/api/axios";
import { authClient } from "../api/authClient";

export const useAuthStore = create((set) => ({
  user: null,
  loading: true,
  logined: false,

  setUser: (user) => set({ user }),

  login: async (email, password) => {
    try {
      const res = await request({
        method: "POST",
        url: "/auth/login",
        data: { email, password },
      });

      const { user, accessToken } = res.data.data;

      setAccessToken(accessToken);

      set({
        user,
        logined: true,
        loading: false,
      });

      return { ok: true };
    } catch (err) {
      return {
        ok: false,
        message: err.message,
        code: err.code,
        status: err.status,
      };
    }
  },

  register: async (email, password) => {
    try {
      const res = await request({
        method: "POST",
        url: "/auth/register",
        data: { email, password },
      });

      const { user, accessToken } = res.data.data;

      setAccessToken(accessToken);

      set({
        user,
        logined: true,
        loading: false,
      });

      return { ok: true };
    } catch (err) {
      return {
        ok: false,
        message: err.message,
        code: err.code,
        status: err.status,
      };
    }
  },

  logout: async () => {
    try {
      await request({
        method: "POST",
        url: "/auth/logout",
      });
    } catch {
      // Holly Dolly
    }

    setAccessToken(null);

    set({
      user: null,
      logined: false,
      loading: false,
    });
  },

  me: async () => {
    try {
      const res = await request({
        method: "GET",
        url: "/user/me",
      });

      set({
        user: res.data.data,
        logined: true,
        loading: false,
      });
    } catch {
      set({
        user: null,
        logined: false,
        loading: false,
      });
    }
  },

  init: async () => {
    try {
      const token = await authClient.refresh();

      setAccessToken(token);

      const res = await request({
        method: "GET",
        url: "/user/me",
      });

      set({
        user: res.data.data,
        logined: true,
        loading: false,
      });
    } catch {
      set({
        user: null,
        logined: false,
        loading: false,
      });
    }
  },
}));



