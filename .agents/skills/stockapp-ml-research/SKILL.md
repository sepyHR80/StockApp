---
name: stockapp-ml-research
description: Design or run bounded StockApp historical-market experiments, temporal evaluation and model promotion checks.
---

Read the research protocol in `docs/architecture/ai-ml.md`. Pin dataset rights and available-as-of timestamps, define splits and baselines before evaluating, then run a local smoke check. Record asset coverage, point-in-time inputs, purge windows, seed, code and data revisions, metrics and costs. Preserve the untouched future holdout. Escalate budget only with authorization. Keep experiments separate from the deployed runtime and record evidence before requesting promotion.

Follow the local resource limits in repository-root `AGENTS.md` before starting local heavy work.

Validation scenario. A 5-session label crosses a chronological fold boundary. Verify that the crossing row is purged, transforms fit inside the fold, and the future holdout receives only one final evaluation. [TimeSeriesSplit reference](https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.TimeSeriesSplit.html)
