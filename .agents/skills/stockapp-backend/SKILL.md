---
name: stockapp-backend
description: Implement or review the planned StockApp FastAPI API, Firebase identity, daily market data, SQLAlchemy persistence and Alembic migrations.
---

Start with `docs/architecture/api-v1.yaml` and `docs/architecture/data-model.md`. The Android demo runs independently. Place new backend behavior in the smallest relevant module. Verify Firebase tokens and resolve ownership on the server, and keep demo fixtures isolated from real data. Test cross-owner denial, incomplete date coverage, exact decimal serialization, migration upgrade and idempotency when affected. Update the canonical contract with any approved interface change.

Follow the local resource limits in repository-root `AGENTS.md` before starting local heavy work.

Validation scenario. A valid allowlisted user requests a job belonging to a second user. Confirm the API returns 404. An unsigned call to the same personal route returns 401. [Firebase token verification](https://firebase.google.com/docs/auth/admin/verify-id-tokens)
