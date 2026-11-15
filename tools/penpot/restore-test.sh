#!/usr/bin/env bash
set -euo pipefail
if [[ $# -ne 1 ]]; then
  printf 'Usage: %s /absolute/backup/directory\n' "$0" >&2
  exit 2
fi
backup="$(cd "$1" && pwd)"
cd "$(dirname "$0")"
test -s "$backup/database.dump"
test -s "$backup/stack.env"
tar -tzf "$backup/assets.tar.gz" >/dev/null

project="stockapp-penpot-restore-$(date -u +%Y%m%d%H%M%S)-$$"
compose=(docker compose --env-file "$backup/stack.env" -f compose.yaml -p "$project")
trap '"${compose[@]}" down -v' EXIT
# Only the restored database is started. The project has uniquely named volumes and no published ports.
"${compose[@]}" up -d --wait postgres
"${compose[@]}" exec -T postgres pg_restore --exit-on-error -U penpot -d penpot < "$backup/database.dump"
"${compose[@]}" run --rm --no-deps -T --entrypoint tar backend -C /opt/data/assets -xzf - < "$backup/assets.tar.gz"
"${compose[@]}" run --rm --no-deps -T --entrypoint tar backend -C /opt/data/assets -dzf - < "$backup/assets.tar.gz"
"${compose[@]}" exec -T postgres psql -U penpot -d penpot -v ON_ERROR_STOP=1 -c 'SELECT name, revn FROM file WHERE deleted_at IS NULL ORDER BY name'
