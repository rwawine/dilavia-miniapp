# Dilavia Mini App

Telegram Mini App программы лояльности Dilavia Club.

Стек: Vite + React + TypeScript, [Telegram WebApp API](https://core.telegram.org/bots/webapps).

## Запуск

```bash
npm install
npm run dev
```

Сборка: `npm run build` (результат в `dist/`).

## Как устроено

- Внутри Telegram приложение работает с настоящими данными из админки Strapi
  (`/api/loyalty/me`, `/api/loyalty/register`, `/api/loyalty/redeem`).
  Каждый запрос подписан Telegram (`Authorization: tma <initData>`), сервер проверяет
  подпись ключом бота (`TELEGRAM_BOT_TOKEN` в `.env` бэкенда).
- Вступление — по номеру телефона через `WebApp.requestContact()`: номер подтверждает Telegram.
- В обычном браузере открывается демо-режим на тестовых данных (для проверки дизайна).
- Адрес API задаётся `VITE_API_URL` (см. `.env.example`), по умолчанию `https://admin.dilavia.by/api`.

## Деплой

При каждом пуше в `main` GitHub Actions ([.github/workflows/deploy.yml](.github/workflows/deploy.yml)) собирает проект и через rsync выкладывает `dist/` на сервер в `/var/www/dilavia-miniapp` (путь можно переопределить переменной репозитория `DEPLOY_PATH`). Nginx отдаёт его как SPA.

Нужен один секрет репозитория (Settings → Secrets and variables → Actions): `SSH_PRIVATE_KEY`, приватный deploy-ключ (его публичная часть должна быть в `authorized_keys` на сервере). Сервер и пользователь заданы в workflow и переопределяются переменными `SSH_HOST` и `SSH_USER`.

Разовая подготовка сервера (ставит nginx и rsync, добавляет ключ, настраивает сайт): [deploy/setup-server.sh](deploy/setup-server.sh).

Для открытия внутри Telegram нужен HTTPS-адрес, который указывается боту в
@BotFather → Bot Settings → Menu Button / Configure Mini App. Домен мини-аппа нужно
добавить в `CORS_ORIGINS` бэкенда.
