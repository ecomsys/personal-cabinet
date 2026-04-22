import { request } from "./request";

/* =========================
   GET PROFILE
========================= */
export const getProfileUser = async () => {
  const res = await request({
    method: "GET",
    url: "/user/me",
  });

  return res.data.data;
};

/* =========================
   UPDATE PROFILE (name/status/avatar)
========================= */
export const updateProfileUser = async (data) => {
  const res = await request({
    method: "PATCH",
    url: "/user/profile",
    data,
  });

  return res.data.data;
};

/* =========================
   UPDATE PASSWORD
========================= */
export const updatePasswordUser = async (data) => {
  const res = await request({
    method: "PATCH",
    url: "/user/password",
    data,
  });

  return res.data.data;
};

/* =========================
   UPDATE EMAIL
========================= */
export const updateEmailUser = async (data) => {
  const res = await request({
    method: "PATCH",
    url: "/user/email",
    data,
  });

  return res.data.data;
};


/* =========================
   UPLOAD AVATAR
========================= */
export const uploadAvatarUser = async (file) => {
  const formData = new FormData();
  formData.append("avatar", file);

  const res = await request({
    method: "PATCH",
    url: "/user/avatar",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data.data;
};

/* =========================
   GET SESSIONS
========================= */
export const getSessionsUser = async () => {
  const res = await request({
    method: "GET",
    url: "/user/sessions",
  });

  return res.data.data;
};

/* =========================
   DELETE SESSION
========================= */
export const deleteSessionUser = async (sessionId) => {
  const res = await request({
    method: "DELETE",
    url: `/user/sessions/${sessionId}`,
  });

  return res.data.data;
};

/* =========================
   DELETE OTHER SESSIONS
========================= */
export const deleteOtherSessionsUser = async () => {
  const res = await request({
    method: "DELETE",
    url: "/user/sessions",
  });

  return res.data.data;
};