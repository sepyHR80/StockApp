# Render preview operations

Use this runbook when the backend and migrations exist. Use one Free web service and a Free PostgreSQL database in the same region for preview. Public routes serve synthetic data. Enable personal real data only with Firebase UID allowlisting, authorized provider usage and a tested backup plan. The Free web service sleeps after 15 idle minutes and can take about a minute to resume. Its filesystem is ephemeral. Free Postgres has 1 GB, expires 30 days after creation, and has no managed backups. An expired database is inaccessible on Free even during its deletion grace period. The Free web service has no pre-deploy command. [Render Free limits](https://render.com/docs/free) · [Deployment commands](https://render.com/docs/deploys)

## Configure and release

Record the DB creation and expiry dates. Schedule an export check for day 21 and a restore rehearsal for day 25. Choose local or durable PostgreSQL when personal records need to outlast the preview. Budget for a durable database before promising persistence or availability.

When the FastAPI package lands, set the Render start command to `uvicorn stockapp.main:app --host 0.0.0.0 --port "$PORT"` or the actual package entry point if it has changed. Store the PostgreSQL internal URL and provider credentials as private environment values. Set Render health checks to `/readyz`. Use the public endpoint only for necessary TLS-protected operator connections, with access restricted where possible.

Run Alembic from the reviewed release checkout against the selected database after a reviewed backup. Verify the target first and use the compatible migration runner from the checkout. Run `alembic upgrade head` once through that runner, check `alembic current` against `alembic heads`, then deploy. Avoid migrations in builds or each web worker's startup. For a schema-incompatible release, pause traffic during migration and verify readiness before restoring traffic.

```sh
curl --fail --silent --show-error --max-time 90 "${STOCKAPP_BASE_URL:?set service URL}/readyz"
```

Smoke test one synthetic catalog query and one synthetic date range after readiness. Test denied personal access with the demo host. Check request IDs, status codes and latency in logs without printing tokens or user data. Treat a cold start as bounded retryable downtime.

## Export and verify before expiry

Use PostgreSQL client tools compatible with the source server version. Inject `STOCKAPP_SOURCE_DATABASE_URL` securely and set TLS requirements in the connection configuration. Run from a trusted shell without tracing. Store the archive in approved encrypted storage. Use an existing empty disposable target with credentials in `STOCKAPP_RESTORE_DATABASE_URL`. Confirm source and target before running restore.

```sh
(
  set -eu
  umask 077
  : "${STOCKAPP_SOURCE_DATABASE_URL:?set source URL}"
  : "${STOCKAPP_RESTORE_DATABASE_URL:?set empty disposable restore target}"
  test "$STOCKAPP_SOURCE_DATABASE_URL" != "$STOCKAPP_RESTORE_DATABASE_URL"
  archive="$(mktemp "${TMPDIR:-/tmp}/stockapp.XXXXXXXX")"
  pg_dump --format=custom --no-owner --no-privileges \
    --file="$archive" --dbname="$STOCKAPP_SOURCE_DATABASE_URL"
  pg_restore --list "$archive"
  pg_restore --single-transaction --no-owner --no-privileges \
    --dbname="$STOCKAPP_RESTORE_DATABASE_URL" "$archive"
  psql "$STOCKAPP_RESTORE_DATABASE_URL" -X -v ON_ERROR_STOP=1 -c '\dt'
  printf 'Verified archive path: %s\n' "$archive"
)
```

Compare application table row counts and latest snapshot IDs between source and restore. Once migrations exist, compare `alembic_version`, start the same release against the restored image and repeat the synthetic smoke test. Record verification time and archive checksum, then move the verified archive to encrypted storage outside Render.

Before day 30, either retire the preview or migrate to verified local or durable PostgreSQL. Obtain explicit approval before choosing a paid database. Recreate synthetic demo data from versioned fixtures when that is sufficient. During cutover pause writes, create a fresh export, restore, rerun verification, update the private database URL, and redeploy. Keep the previous data source available until cutover succeeds when still within the expiry window. A code rollback requires a schema-compatible release or a database recovery plan. For cleanup, identify the exact app-owned services and their dependencies from current state and verify the archive when retention is needed before deleting authorized resources.
