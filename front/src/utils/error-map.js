export const mapAuthError = (code) => {
  const errors = {
    AUTH_USER_NOT_FOUND: "Пользователь не найден",
    AUTH_INVALID_PASSWORD: "Неверный пароль",
    AUTH_USER_EXISTS: "Пользователь уже существует",   

    AUTH_NO_TOKEN: "Нет токена",
    AUTH_INVALID_TOKEN: "Неверный токен",
    AUTH_INVALID_REFRESH_TOKEN: "Неверный токен обновления",
    AUTH_NO_REFRESH_TOKEN: "Нет токена обновления",

    AUTH_REGISTER_FAILED: "Ошибка регистрации",
    AUTH_LOGIN_FAILED: "Ошибка входа",
    AUTH_LOGOUT_FAILED: "Ошибка при выходе",

    AUTH_FORBIDDEN: "Доступ запрещен",
    AUTH_UNAUTHORIZED: "Не авторизован",
    INTERNAL_ERROR: "Внутренняя ошибка сервера",
    UNKNOWN_ERROR: "Неизвестная ошибка"
  }

  return errors[code] || "Ошибка авторизации"
}