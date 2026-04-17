import axios from "axios"

export const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true
})

/**
 * ===== ACCESS TOKEN (memory) =====
 */
let accessToken = null

export const setAccessToken = (token) => {
  accessToken = token
}

/**
 * ===== REQUEST INTERCEPTOR =====
 */
api.interceptors.request.use((config) => {
  //  не добавляем токен в refresh запрос
  if (accessToken && !config.url.includes("/auth/refresh")) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  return config
})

/**
 * ===== RESPONSE INTERCEPTOR =====
 */

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const resData = error.response?.data

    console.log("FULL ERROR:", resData)

    const data = resData?.error || resData

    return Promise.reject({
      message: data?.message || "Unknown error",
      code: data?.code || "UNKNOWN_ERROR",
      status: error.response?.status
    })
  }
)

export default api