# Dilavia Mini App

Telegram Mini App для программы лояльности Dilavia.

Стек: Vite + React + TypeScript, [Telegram WebApp API](https://core.telegram.org/bots/webapps).

## Запуск

```bash
npm install
npm run dev
```

Сборка: `npm run build` (результат в `dist/`).

## Деплой

При каждом пуше в `main` GitHub Actions ([.github/workflows/deploy.yml](.github/workflows/deploy.yml)) собирает проект и через rsync выкладывает `dist/` на сервер в `/var/www/dilavia-miniapp` (путь можно переопределить переменной репозитория `DEPLOY_PATH`). Nginx отдаёт его как SPA.

Нужен один секрет репозитория (Settings → Secrets and variables → Actions): `SSH_PRIVATE_KEY`, приватный deploy-ключ (его публичная часть должна быть в `authorized_keys` на сервере). Сервер и пользователь заданы в workflow и переопределяются переменными `SSH_HOST` и `SSH_USER`.

Разовая подготовка сервера (ставит nginx и rsync, добавляет ключ, настраивает сайт): [deploy/setup-server.sh](deploy/setup-server.sh).

Для открытия внутри Telegram нужен HTTPS-адрес (например, через ngrok или деплой), который указывается боту в @BotFather → Bot Settings → Menu Button / Configure Mini App.
