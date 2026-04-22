
# Personal Cabinet Backend API by EcomSys

```bash
back /
├── .npm/
│    ├── create-admin.js        # создать админа
│    ├── reset-all.js           # очистить всех и создать только админа
│    └── ... 
│
├── node_modules/            # пакеты зависимостей   
├── prisma/
│    ├── migrations/         # миграции
│    └── schema.prisma       # провайдеры и модели  
│    
├── src/
│    ├── config/
│    │    ├── prisma.js      # создаем клиент
│    │    └── ... 
│    │
│    ├── controllers/                # контроллеры
│    │    ├── admin/
│    │    │     ├── users.controller.js
│    │    │     ├── sessions.controller.js
│    │    │     └── stats.controller.js
│    │    │
│    │    ├── auth.controller.js     
│    │    ├── user.controller.js     
│    │    └── ... 
│    │
│    ├── jobs/                       
│    │    ├── session.cleanup.js     
│    │    └── ... 
│    │
│    ├── middleware/                  # промежуточное ПО
│    │    ├── auth.middleware.js     
│    │    ├── error.middleware.js
│    │    ├── role.middleware.js
│    │    ├── validate.middleware.js
│    │    ├── requestId.middleware.js
│    │    ├── session.middleware.js
│    │    ├── logger.middleware.js
│    │    └── ... 
│    │    
│    ├── routes/                      # роуты 
│    │    ├── admin.routes.js
│    │    ├── auth.routes.js
│    │    ├── user.routes.js
│    │    └── ... 
│    │  
│    ├── services/                    # сервисы
│    │    ├── admin/
│    │    │     ├── users.service.js
│    │    │     ├── sessions.service.js
│    │    │     └── stats.service.js
│    │    │
│    │    ├── auth.service.js
│    │    ├── user.service.js
│    │    └── ... 
│    │ 
│    ├── validators/                   # валидация
│    │    └── auth.validator.js
│    │
│    ├── utils/                        # вспомогательные утилиты
│    │    ├── api-error.js
│    │    ├── hash.js
│    │    ├── jwt.js
│    │    ├── limits.js
│    │    ├── crypto.js
│    │    ├── detectActivity.js
│    │    ├── sessionLimit.js
│    │    ├── logger.js
│    │    ├── response.js
│    │    └── ... 
│    │
│    └── app.js                        # основной сервер
│
├── .env                     # переменные окружения           
├── .gitignore                 
├── dev.db                   # база данных sqlite
├── ecosystem.config.cjs     # файл для прода (настройки билда)  
├── index.js                 # точка входа     
├── package.json             # зависимрсти  
├── prisma.config.js         # конфиг для генерации клиента 
└── README.md                
```


## Overview

Backend для системы личного кабинета с полноценной auth-системой, управлением сессиями и базовой ролью доступа.

Проект построен на:
- Node.js + Express
- Prisma ORM (SQLite)
- JWT authentication (access + refresh)
- Cookie-based refresh token storage

---

## Features

### Authentication system
- Регистрация пользователя
- Логин с выдачей access + refresh токенов
- Logout с инвалидированием сессии
- Refresh token rotation (обновление токенов без повторного логина)
- Хэширование refresh токенов в базе

---

### Session management
- Хранение сессий в базе данных
- Привязка сессии к:
  - IP адресу
  - User-Agent
  - Device ID
- Ограничение количества активных сессий на пользователя
- Возможность:
  - получить все активные сессии
  - удалить конкретную сессию
  - удалить все остальные сессии

---

### Security layer
- Защита JWT (access token middleware)
- Проверка валидности сессии на каждый запрос
- Device mismatch detection
- Suspicious activity logging (IP / device changes)
- Rate limiting:
  - login protection
  - register protection
  - refresh protection
  - global request limiter

---

### Middleware system
- Auth middleware (JWT validation)
- Session middleware (DB session validation)
- Role middleware (RBAC system)
- Request ID middleware (traceability)
- Request logger middleware (structured logs)
- Global error handler

---

### Role system
- Базовая RBAC модель
- Защита admin routes
- Поддержка ролей через middleware

---

### Logging & monitoring
- Winston logger
- Structured logs (JSON format)
- Logging for:
  - HTTP requests
  - Errors
  - Security events
  - Cron jobs

---

### Background jobs
- Cron-задача очистки сессий:
  - деактивация устаревших сессий
  - удаление старого мусора (TTL-based cleanup)

---

### Database (Prisma)
- User model
- Session model
- Relations:
  - User → Sessions (1:N)
- Soft session invalidation (isValid flag)

---

## API Structure

### Auth
- POST `/api/auth/register`
- POST `/api/auth/login`
- POST `/api/auth/logout`
- POST `/api/auth/refresh`

### User
- GET `/api/user/me`
- GET `/api/user/sessions`
- DELETE `/api/user/sessions/:sessionId`
- DELETE `/api/user/sessions`

### Admin
- GET `/api/admin/panel`

---

## Security Notes

- Refresh tokens хранятся в БД в хэшированном виде
- Access token живёт короткое время (15 min)
- Refresh rotation предотвращает reuse атак
- Session binding к device/IP снижает риск кражи токена

---

## Status

Stable MVP / Production-ready for small-medium projects  
Ready for real-world integration  
Not intended for high-load distributed systems (SQLite limitation)

---

## Tech Stack

- Node.js
- Express
- Prisma
- SQLite
- JWT
- bcrypt
- winston
- express-rate-limit
