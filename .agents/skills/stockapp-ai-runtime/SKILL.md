---
name: stockapp-ai-runtime
description: Implement or evaluate StockApp deterministic analysis explanations, inference adapters, evidence validation and model rollback.
---

Read `docs/architecture/ai-ml.md` and the analysis job contract. Keep deterministic metrics independently usable. Verify provider failures, invalid citations, numeric disagreement, token and timeout limits, and explicit routing before enabling explanations. Keep evidence inputs minimal and avoid transferring personal inputs across runtime routes implicitly. Evaluate LiteRT on named real devices before promotion.

Follow the local resource limits in repository-root `AGENTS.md` before starting local heavy work.

Validation scenario. An adapter returns the wrong volatility and cites a valid evidence ID. Confirm that validation drops the explanation and leaves the deterministic result available. [LiteRT documentation](https://ai.google.dev/edge/litert)
