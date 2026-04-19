// логика refresh здесь

import { api, setAccessToken } from "./axios";

let isRefreshing = false;
let queue = [];

const processQueue = (error, token = null) => {
  queue.forEach((cb) => {
    if (token) cb(token);
    else cb(null, error);
  });

  queue = [];
};

export const authClient = {
  async refresh() {
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        queue.push((token, err) => {
          if (token) resolve(token);
          else reject(err);
        });
      });
    }

    isRefreshing = true;

    try {
      const res = await api.post("/auth/refresh");

      const token = res.data.data.accessToken;

      setAccessToken(token);

      processQueue(null, token);

      return token;
    } catch (err) {
      processQueue(err, null);
      setAccessToken(null);
      throw err;
    } finally {
      isRefreshing = false;
    }
  },
};