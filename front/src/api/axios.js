import axios from "axios";
import { v4 as uuid } from "uuid";

export const api = axios.create({
  // baseURL: "http://localhost:5000/api",
  baseURL: "/api",
  withCredentials: true,
});

let deviceId = localStorage.getItem("deviceId");

if (!deviceId) {
  deviceId = uuid();
  localStorage.setItem("deviceId", deviceId);
}

/**
 * ACCESS TOKEN (in-memory)
 */
let accessToken = null;

export const setAccessToken = (token) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;

/**
 * REQUEST INTERCEPTOR (ONLY attach token)
 */
api.interceptors.request.use((config) => {
  const token = getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const deviceId = localStorage.getItem("deviceId");
  if (deviceId) {
    config.headers["x-device-id"] = deviceId;
  }

  return config;
});
