---
name: stockapp-render-ops
description: Prepare or operate the StockApp Render preview, database migrations, exports, restore rehearsals, expiry cutover and service cleanup.
---

Read `docs/operations/render.md`, and verify current provider limits and the exact scoped resources. Public preview uses synthetic data. Follow the runbook for allowlisted personal data. Check expiry, backup provenance and restore verification before data-changing work. Keep deployed configuration private. Apply the authorized lifecycle action to the identified StockApp resources, then verify resulting service and database state.

Follow the local resource limits in repository-root `AGENTS.md` before starting local heavy work.

Validation scenario. A preview database approaches day 30. Verify the runbook routes the operator through export, restore rehearsal and retirement or migration before expiry. [Render Free limits](https://render.com/docs/free)
