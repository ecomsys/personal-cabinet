export const errorMiddleware = (err, req, res, next) => {
  const status = err.status || 500

  return res.status(status).json({
    success: false,
    error: {
      message: err.message || "Внутренняя ошибка сервера",
      code: err.code || "Внутренняя ошибка сервера"
    }
  })
}