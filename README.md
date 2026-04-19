# Personal Cabinet project

```bash
personal-cabinet/
├── package.json
├── install-all.js         # установи сразу все зависимости одной командой -> npm run install:all
├── ...
│
├── back/
│   ├── src/
│   ├── prisma/
│   ├── ecosystem.config.cjs
│   ├── index.js              # ← точка входа (твой сервер)
│   ├── package.json
│   ├── node_modules/
│   └── ...
│
└── front/
    ├── package.json
    ├── src/
    └── ...
```

Стартовый шаблон для личного кабинета с базовой авторизацией

## Установка

1. Клонируем репозиторий:

```
git clone https://github.com/ecomsys/personal-cabinet.git
cd <имя_папки_репозитория>
```

Устанавливаем зависимости во всех папках (корень, frontend, backend) одной командой:

```
npm run install:all
```

Скрипт автоматически установит зависимости в корне, frontend и backend. 

После установки можно запускать все сервера из корневой папки одной командой:

```
npm run dev
```

Структура корня сервера

```
/node_modules          # игнорируется
/front                 # фронтенд проекта
/back                  # бэкенд проекта
/install-all.js        # скрипт для установки всех зависимостей
/package.json          # основной package.json
```

фронт открываем по адрессу 
```
http://localhost:5173/
```
backend уже запущен автоматически