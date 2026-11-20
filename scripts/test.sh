#!/usr/bin/env bash
# Single test entry point for the Website.
#
# Two steps, both offline:
#   1. the same TypeScript project check the build runs (`tsc -b`, no emit)
#   2. `bun test` against test/, which renders the page to a string with
#      react-dom/server — no DOM library, no new dependency
#
# Browser acceptance of the built site is a separate gate: the workspace-level
# scripts own the built-client journey.
set -euo pipefail

project_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd -P)"
cd "$project_dir"

echo "== type check"
bunx tsc -b

echo "== bun test"
exec bun test "$@"
