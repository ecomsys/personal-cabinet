// src/utils/response.js

export const success = (res, data, meta = null) => {
  return res.json({
    success: true,
    data,
    meta
  })
}