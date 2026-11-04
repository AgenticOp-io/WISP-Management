#!/usr/bin/env bash
# Apply CORS header fix on hss.wisptools.io (nginx OPTIONS + restart Node).
# Run on the GCE VM or via: gcloud compute ssh <instance> --command "bash -s" < scripts/deployment/patch-cors-on-gce.sh
set -euo pipefail

REPO_ROOT="${REPO_ROOT:-/opt/wisptools/backend-services}"
NGINX_SITE="${NGINX_SITE:-/etc/nginx/sites-available/hss.wisptools.io}"

CORS_HEADERS="Authorization, Content-Type, X-Tenant-ID, X-User-Email, X-Debug-Mode, X-Requested-Path, X-Requested-Uri, X-Original-URL, Accept, Accept-Language, Origin"

if [[ -f "$NGINX_SITE" ]]; then
  sudo sed -i "s|add_header 'Access-Control-Allow-Headers' '[^']*' always;|add_header 'Access-Control-Allow-Headers' '$CORS_HEADERS' always;|g" "$NGINX_SITE"
  sudo nginx -t && sudo systemctl reload nginx
  echo "nginx CORS headers updated"
else
  echo "WARN: $NGINX_SITE not found — copy backend-services/scripts/nginx-ssl-config.conf manually"
fi

if command -v pm2 >/dev/null 2>&1 && [[ -d "$REPO_ROOT" ]]; then
  cd "$REPO_ROOT"
  git pull --ff-only 2>/dev/null || true
  pm2 restart wisptools-api 2>/dev/null || pm2 restart all
  echo "pm2 restarted"
fi

echo "Done. Test from browser: OPTIONS https://hss.wisptools.io/api/plans with Origin https://wisptools-management.web.app"
