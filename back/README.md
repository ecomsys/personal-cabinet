# Personal Cabinet project - Backend

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
│    │    ├── auth.controller.js     
│    │    ├── user.controller.js     
│    │    └── ... 
│    │
│    ├── middleware/                  # промежуточное ПО
│    │    ├── auth.middleware.js     
│    │    ├── error.middleware.js
│    │    ├── role.middleware.js
│    │    └── ... 
│    │    
│    ├── routes/                      # роуты 
│    │    ├── admin.routes.js
│    │    ├── auth.routes.js
│    │    ├── user.routes.js
│    │    └── ... 
│    │  
│    ├── services/                     # сервисы
│    │    ├── auth.service.js
│    │    ├── user.service.js
│    │    └── ... 
│    │
│    ├── utils/                        # вспомогательные утилиты
│    │    ├── api-error.js
│    │    ├── hash.js
│    │    ├── jwt.js
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

# базовые функции сервера: 
---
JWT auth
refresh rotation
session system
validation layer
API contract
rate limiting
trust proxy
logging system
---