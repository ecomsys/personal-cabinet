import { request } from "./request";

/* =========================
   ADMIN - GET USERS
========================= */
export const getUsersAdmin = async ({ page = 1, limit = 10 } = {}) => {
  const res = await request({
    method: "GET",
    url: "/admin/users",
    params: {
      page,
      limit,
    },
  });

  return res.data.data;
};

/* =========================
   ADMIN - GET USER BY ID
========================= */
export const getUserByIdAdmin = async (id) => {
  const res = await request({
    method: "GET",
    url: `/admin/users/${id}`,
  });

  return res.data.data;
};

/* =========================
   ADMIN - UPDATE USER
========================= */
export const updateUserAdmin = async (id, data) => {
  const res = await request({
    method: "PATCH",
    url: `/admin/users/${id}`,
    data,
  });

  return res.data.data;
};

/* =========================
   ADMIN - DELETE USER
========================= */
export const deleteUserAdmin = async (id) => {
  const res = await request({
    method: "DELETE",
    url: `/admin/users/${id}`,
  });

  return res.data.data;
};

/* =========================
   ADMIN - GET SESSIONS
========================= */
export const getAllSessionsAdmin = async ({ page = 1, limit = 10 } = {}) => {
  const res = await request({
    method: "GET",
    url: "/admin/sessions",
    params: {
      page,
      limit,
    },
  });

  return res.data.data;
};
/* =========================
   ADMIN - DELETE SESSION
========================= */
export const deleteSessionAdmin = async (id) => {
  const res = await request({
    method: "DELETE",
    url: `/admin/sessions/${id}`,
  });

  return res.data.data;
};

/* =========================
   ADMIN - DELETE ALL SESSIONS
========================= */
export const deleteAllSessionsAdmin = async () => {
  const res = await request({
    method: "DELETE",
    url: "/admin/sessions",
  });

  return res.data.data;
};

/* =========================
   ADMIN - STATS
========================= */
export const getStatsAdmin = async () => {
  const res = await request({
    method: "GET",
    url: "/admin/stats",
  });

  return res.data.data;
};
