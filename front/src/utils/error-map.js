export const mapAuthError = (code) => {
  const errors = {
    AUTH_USER_NOT_FOUND: "Пользователь не найден",
    AUTH_INVALID_PASSWORD: "Неверный пароль",
    AUTH_USER_EXISTS: "Пользователь уже существует",

    AUTH_FORBIDDEN: "Доступ запрещён",
    AUTH_UNAUTHORIZED: "Не авторизован",
    AUTH_SESSION_EXPIRED: "Увы, сессия истекла...",

    LOGIN_RATE_LIMIT: "Слишком много попыток входа",
    REGISTER_RATE_LIMIT: "Слишком много регистраций",

    VALIDATION_ERROR: "Проверьте введённые данные",
  };

  return errors[code] || "Что-то пошло не так";
};