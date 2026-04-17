import { create } from "zustand"
import { api, setAccessToken } from "@/api/axios"
import { normalizeError } from "../utils/normalize-error"

export const useAuthStore = create((set) => ({
  user: null,
  loading: true,
  logined: false,

  setUser: (user) => set({ user }),

  login: async (email, password) => {
    try {
      const res = await api.post("/auth/login", { email, password })

      const { user, tokens } = res.data.data

      set({
        user,
        logined: true,
      })

      setAccessToken(tokens.accessToken)

      return { ok: true }
    } catch (err) {
      const e = normalizeError(err)

      return {
        ok: false,
        ...e
      }
    }
  },

  register: async (email, password) => {
    try {
      const res = await api.post("/auth/register", { email, password })

      const { user, tokens } = res.data.data

      set({
        user,
        logined: true
      })

      setAccessToken(tokens.accessToken)

      return { ok: true }
    } catch (err) {
      const e = normalizeError(err)

      return {
        ok: false,
        ...e
      }
    }
  },

  logout: async () => {
    await api.post("/auth/logout")

    set({
      user: null,
      loading: false,
      logined: false
    })

    setAccessToken(null)
  },

  me: async () => {
    try {
      const res = await api.get("/user/me")

      set({
        user: res.data.data,
        loading: false,
        logined: true
      })

      console.log("User data fetched successfully")
    } catch {
      set({
        user: null,
        loading: false,
        logined: false
      })


    }
  },

  init: async () => {
    try {
      // пробуем восстановить сессию
      const res = await api.post("/auth/refresh")

      const token = res.data.data.accessToken
      setAccessToken(token)

      const meRes = await api.get("/user/me")

      set({
        user: meRes.data.data,
        loading: false,
        logined: true
      })
    } catch {
      set({
        user: null,
        loading: false,
        logined: false
      })
    }
  }
}))