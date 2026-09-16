#!/usr/bin/env bash
set -euo pipefail

project_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd -P)"
cd "$project_dir"
compose_file="$project_dir/docker/compose.yml"

resolve_env_file() {
  local requested="${ENV_FILE:-.env}"
  local candidate
  if [[ "$requested" == /* ]]; then
    candidate="$requested"
  else
    candidate="$project_dir/$requested"
  fi

  if [[ ! -e "$candidate" ]]; then
    echo "Missing environment file: $requested" >&2
    echo "Create it with: cp .env.example \"$requested\"" >&2
    return 1
  fi
  [[ -f "$candidate" ]] || { echo "Environment path is not a file: $requested" >&2; return 1; }

  local resolved
  resolved="$(realpath "$candidate")"
  case "$resolved" in
    "$project_dir"/*) printf '%s\n' "$resolved" ;;
    *) echo "ENV_FILE must stay inside $project_dir: $requested" >&2; return 1 ;;
  esac
}

command -v docker >/dev/null 2>&1 || { echo "Docker is required." >&2; exit 1; }
docker compose version >/dev/null 2>&1 || { echo "Docker Compose is required." >&2; exit 1; }

env_file="$(resolve_env_file)"

git_commit="${GIT_COMMIT:-$(git rev-parse HEAD)}"
[[ "$git_commit" =~ ^[0-9a-fA-F]{40}$ ]] || { echo "GIT_COMMIT must be a full 40-character Git revision." >&2; exit 1; }

product_version="${PRODUCT_VERSION:-$(sed -n 's/^[[:space:]]*"version":[[:space:]]*"\([^"]*\)".*/\1/p' package.json | head -n 1 | tr -d '\r')}"
[[ "$product_version" =~ ^[0-9]+\.[0-9]+\.[0-9]+(-[0-9A-Za-z.-]+)?(\+[0-9A-Za-z.-]+)?$ ]] || { echo "PRODUCT_VERSION must be a semantic version." >&2; exit 1; }

GIT_COMMIT="$git_commit" PRODUCT_VERSION="$product_version" \
  docker compose --env-file "$project_dir/docker/images.env" --env-file "$env_file" -f "$compose_file" build cashlenx-website

image_ref="$(GIT_COMMIT="$git_commit" PRODUCT_VERSION="$product_version" \
  docker compose --env-file "$project_dir/docker/images.env" --env-file "$env_file" -f "$compose_file" config --images | awk 'NF { print; exit }')"
"$project_dir/scripts/verify-image.sh" "$image_ref" "$product_version" "$git_commit"
