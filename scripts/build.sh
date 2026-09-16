#!/usr/bin/env bash
set -euo pipefail

project_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd -P)"
cd "$project_dir"
compose_file="$project_dir/docker/compose.yml"
. "$project_dir/scripts/lib/container_lifecycle.sh"

env_file="$(resolve_env_file)"
container_runtime_init "$(read_config_value CONTAINER_FRONTEND auto)"
load_env_defaults "$project_dir/docker/images.env" BUN_BUILD_IMAGE BUN_VERSION NGINX_IMAGE
git_commit="${GIT_COMMIT:-$(git rev-parse HEAD)}"
[[ "$git_commit" =~ ^[0-9a-fA-F]{40}$ ]] || { echo "GIT_COMMIT must be a full 40-character Git revision." >&2; exit 1; }
product_version="${PRODUCT_VERSION:-$(sed -n 's/^[[:space:]]*"version":[[:space:]]*"\([^"]*\)".*/\1/p' package.json | sed -n '1p' | tr -d '\r')}"
[[ "$product_version" =~ ^[0-9]+\.[0-9]+\.[0-9]+(-[0-9A-Za-z.-]+)?(\+[0-9A-Za-z.-]+)?$ ]] || { echo "PRODUCT_VERSION must be a semantic version." >&2; exit 1; }
image_ref="$(resolve_image_ref WEBSITE_IMAGE_NAME cashlenx-website WEBSITE_IMAGE_TAG latest)"
export GIT_COMMIT="$git_commit" PRODUCT_VERSION="$product_version"
compose_args=(--env-file "$env_file" -f "$compose_file")
compose_preflight "${compose_args[@]}"
compose "${compose_args[@]}" build cashlenx-website
"$project_dir/scripts/verify-image.sh" "$image_ref" "$product_version" "$git_commit"
