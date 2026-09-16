#!/bin/sh
set -eu

project_dir="$(cd "$(dirname "$0")/.." && pwd -P)"
audit_dir="$(mktemp -d)"
trap 'rm -rf "$audit_dir"' EXIT HUP INT TERM

cp "$project_dir/package.json" "$project_dir/bun.lock" "$audit_dir/"
cd "$audit_dir"

bun --no-env-file audit --audit-level=high
report="$(bun --no-env-file audit --json || true)"
AUDIT_REPORT="$report" bun --no-env-file -e '
  const report = JSON.parse(process.env.AUDIT_REPORT ?? "{}");
  const blocked = new Set(["high", "critical"]);
  const findings = Object.values(report).flat().filter((item) => blocked.has(item.severity));
  if (findings.length > 0) {
    console.error(`Dependency audit rejected ${findings.length} high-or-critical finding(s).`);
    process.exit(1);
  }
  console.log("dependency_audit=passed");
'
