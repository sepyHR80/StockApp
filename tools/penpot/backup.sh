#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
umask 077
mkdir -p .local/backups
destination=".local/backups/$(date -u +%Y%m%dT%H%M%SZ)-$$"
temporary="$(mktemp -d .local/backups/.incomplete.XXXXXXXX)"
compose=(docker compose --env-file .env -f compose.yaml -p stockapp-penpot)

# Stop writes across both the database and asset volume while taking the snapshot.
running=()
while IFS= read -r service; do
  case "$service" in frontend|exporter|backend) running+=("$service");; esac
done < <("${compose[@]}" ps --status running --services)
if (( ${#running[@]} )); then
  trap '"${compose[@]}" start "${running[@]}"' EXIT
  "${compose[@]}" stop "${running[@]}"
fi
"${compose[@]}" exec -T postgres pg_dump -U penpot -d penpot -Fc > "$temporary/database.dump"
"${compose[@]}" run --rm --no-deps -T --entrypoint tar backend -C /opt/data/assets -czf - . > "$temporary/assets.tar.gz"
cp .env "$temporary/stack.env"
test -s "$temporary/database.dump"
tar -tzf "$temporary/assets.tar.gz" >/dev/null
mv "$temporary" "$destination"
printf '%s\n' "$PWD/$destination"
