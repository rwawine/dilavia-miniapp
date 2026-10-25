#!/usr/bin/env bash
# One-time server preparation for automatic deploys from GitHub Actions.
# Usage (from your machine):
#   ssh root@<server-ip> "bash -s -- '$(cat ~/.ssh/dilavia_deploy.pub)'" < deploy/setup-server.sh
set -euo pipefail

PUBKEY="${1:?Pass the deploy public key as the first argument}"
DEPLOY_PATH="/var/www/dilavia-miniapp"

export DEBIAN_FRONTEND=noninteractive
apt-get update -y
apt-get install -y nginx rsync

# Authorize the GitHub Actions deploy key
mkdir -p ~/.ssh
chmod 700 ~/.ssh
touch ~/.ssh/authorized_keys
grep -qxF "$PUBKEY" ~/.ssh/authorized_keys || echo "$PUBKEY" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys

mkdir -p "$DEPLOY_PATH"

# Static SPA site: unknown paths fall back to index.html
cat > /etc/nginx/sites-available/dilavia-miniapp <<NGINX
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name _;

    root $DEPLOY_PATH;
    index index.html;

    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location / {
        try_files \$uri \$uri/ /index.html;
        add_header Cache-Control "no-cache";
    }
}
NGINX

ln -sf /etc/nginx/sites-available/dilavia-miniapp /etc/nginx/sites-enabled/dilavia-miniapp
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl enable --now nginx
systemctl reload nginx

echo "Server is ready. Deploy path: $DEPLOY_PATH"
