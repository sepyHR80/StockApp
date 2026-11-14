# Backend

The implementation is planned. Create one Python package and use FastAPI routers for health, instruments, market data and analysis. Use dependency injection for authentication and SQLAlchemy sessions. Pin dependencies and separate process liveness at `/healthz` from DB and schema readiness at `/readyz`. A prediction or model provider outage leaves deterministic endpoints ready. Return redacted structured errors and log request IDs, status, duration and bounded job counters.

Keep public synthetic handlers independent of personal data access, including caching and job persistence. Require Firebase ID tokens and UID allowlisting for personal endpoints. Use the [OpenAPI contract](api-v1.yaml), [identity and data rules](data-model.md), and [job and model design](ai-ml.md) as implementation inputs.

Use Alembic as the schema authority. Test migrations against disposable PostgreSQL seeded from synthetic fixtures and test owner scoping across two allowlisted identities. Keep runtime credentials and migration credentials separate where possible. Provision and rehearse backups using the [Render runbook](../operations/render.md).
