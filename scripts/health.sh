#!/usr/bin/env bash
set -euo pipefail

project_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$project_dir"

command -v curl >/dev/null 2>&1 || { echo "curl is required." >&2; exit 1; }
website_port="$(sed -n 's/^WEBSITE_PORT=//p' .env 2>/dev/null | tail -n 1)"
website_port="${website_port:-11065}"
health_url="${WEBSITE_HEALTH_URL:-http://127.0.0.1:${website_port}/}"

for attempt in $(seq 1 30); do
  if curl --fail --silent --show-error "$health_url" >/dev/null; then
    echo "Product website is healthy: $health_url"
    exit 0
  fi
  sleep 2
done

echo "Product website health check failed: $health_url" >&2
docker compose ps cashlenx-website >&2
exit 1
