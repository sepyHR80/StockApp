# Development roadmap

Updated 2026-11-17. Phase A is the current architecture/tooling delivery. B–F are future implementation, not completed features. Native UI prerequisite: [PR #5](https://github.com/sepyHR80/StockApp/pull/5).

Each work item has acceptance criteria, exclusions, dependency links and verification evidence in its specification. Assign the implementing agent in the GitHub issue before starting. Issues remain open until their required evidence is accepted.

Use the [supervised work batches](batches.md) to assign two to four related issues at a time; retain each issue's own acceptance gate.

| ID | Deliverable / issue | Depends on | Status | Specification |
| --- | --- | --- | --- | --- |
| A01 | [Record the current system and target architecture](https://github.com/sepyHR80/StockApp/issues/6) | Baseline | In review | [A01](issues/A01.md) |
| A02 | [Specify API and persistence contracts](https://github.com/sepyHR80/StockApp/issues/7) | A01 | In review | [A02](issues/A02.md) |
| A03 | [Create architecture decision and change history](https://github.com/sepyHR80/StockApp/issues/8) | A01 | In review | [A03](issues/A03.md) |
| A04 | [Define agent development and PR workflow](https://github.com/sepyHR80/StockApp/issues/9) | A01, A03 | In review | [A04](issues/A04.md) |
| A05 | [Create and validate seven project skills](https://github.com/sepyHR80/StockApp/issues/10) | A01, A02, A04 | In review | [A05](issues/A05.md) |
| A06 | [Run persistent local Penpot](https://github.com/sepyHR80/StockApp/issues/11) | A04 | In review | [A06](issues/A06.md) |
| A07 | [Recreate current UI as editable Penpot components](https://github.com/sepyHR80/StockApp/issues/12) | A06 | Visual corrections pending | [A07](issues/A07.md) |
| A08 | [Bridge saved designs to validated local snapshots](https://github.com/sepyHR80/StockApp/issues/13) | A06, A07 | In review | [A08](issues/A08.md) |
| A09 | [Apply design changes with isolated Codex runs](https://github.com/sepyHR80/StockApp/issues/14) | A08 | Live rerun pending | [A09](issues/A09.md) |
| A10 | [Document Render operations and retire legacy capacity](https://github.com/sepyHR80/StockApp/issues/15) | A03, A04 | In review | [A10](issues/A10.md) |
| B01 | [Bootstrap the modular API with health checks and CI](https://github.com/sepyHR80/StockApp/issues/16) | A02, A04 | Backlog | [B01](issues/B01.md) |
| B02 | [Create PostgreSQL schema and migration baseline](https://github.com/sepyHR80/StockApp/issues/17) | B01 | Backlog | [B02](issues/B02.md) |
| B03 | [Verify Firebase identity and enforce API ownership](https://github.com/sepyHR80/StockApp/issues/18) | B01, B02 | Backlog | [B03](issues/B03.md) |
| B04 | [Enable native Google sign-in and session lifecycle](https://github.com/sepyHR80/StockApp/issues/19) | B03, B06 | Backlog | [B04](issues/B04.md) |
| B05 | [Implement account export and deletion](https://github.com/sepyHR80/StockApp/issues/20) | B03, B04 | Backlog | [B05](issues/B05.md) |
| B06 | [Introduce screen state holders and repositories](https://github.com/sepyHR80/StockApp/issues/21) | A07, A02 | Backlog | [B06](issues/B06.md) |
| C01 | [Qualify market-data provider and usage rights](https://github.com/sepyHR80/StockApp/issues/22) | A02 | Backlog | [C01](issues/C01.md) |
| C02 | [Implement stable asset catalog and search](https://github.com/sepyHR80/StockApp/issues/23) | C01, B02, B03 | Backlog | [C02](issues/C02.md) |
| C03 | [Ingest and normalize daily market candles](https://github.com/sepyHR80/StockApp/issues/24) | C02 | Backlog | [C03](issues/C03.md) |
| C04 | [Cache market data within provider quotas](https://github.com/sepyHR80/StockApp/issues/25) | C03 | Backlog | [C04](issues/C04.md) |
| C05 | [Display real daily charts and custom date ranges](https://github.com/sepyHR80/StockApp/issues/26) | B06, C04 | Backlog | [C05](issues/C05.md) |
| C06 | [Persist account watchlists](https://github.com/sepyHR80/StockApp/issues/27) | B04, C02 | Backlog | [C06](issues/C06.md) |
| D01 | [Calculate deterministic historical analysis](https://github.com/sepyHR80/StockApp/issues/28) | C03 | Backlog | [D01](issues/D01.md) |
| D02 | [Explain verified metrics through an LLM adapter](https://github.com/sepyHR80/StockApp/issues/29) | D01, B03 | Backlog | [D02](issues/D02.md) |
| D03 | [Implement durable analysis execution lifecycle](https://github.com/sepyHR80/StockApp/issues/30) | D01, B02 | Backlog | [D03](issues/D03.md) |
| D04 | [Create reproducible time-series research workflow](https://github.com/sepyHR80/StockApp/issues/31) | C01, C03, D01 | Backlog | [D04](issues/D04.md) |
| D05 | [Gate model promotion with independent evaluation](https://github.com/sepyHR80/StockApp/issues/32) | D04 | Backlog | [D05](issues/D05.md) |
| D06 | [Evaluate device and cloud inference for one model](https://github.com/sepyHR80/StockApp/issues/33) | D05 | Backlog | [D06](issues/D06.md) |
| E01 | [Deploy the first free Render API and PostgreSQL demo](https://github.com/sepyHR80/StockApp/issues/34) | B01, B02, B03, A10 | Backlog | [E01](issues/E01.md) |
| E02 | [Gate deployment and Android releases on CI](https://github.com/sepyHR80/StockApp/issues/35) | E01, A04 | Backlog | [E02](issues/E02.md) |
| E03 | [Prove backup restore and handle free database expiry](https://github.com/sepyHR80/StockApp/issues/36) | E01 | Backlog | [E03](issues/E03.md) |
| E04 | [Rehearse compatible migrations and application rollback](https://github.com/sepyHR80/StockApp/issues/37) | E02, E03 | Backlog | [E04](issues/E04.md) |
| E05 | [Measure service health, capacity and provider consumption](https://github.com/sepyHR80/StockApp/issues/38) | E01, C04, D03 | Backlog | [E05](issues/E05.md) |
| F01 | [Track manual portfolio positions](https://github.com/sepyHR80/StockApp/issues/39) | B04, C02, C05 | Backlog | [F01](issues/F01.md) |
| F02 | [Deliver reliable end-of-day price alerts](https://github.com/sepyHR80/StockApp/issues/40) | C04, E05 | Backlog | [F02](issues/F02.md) |
| F03 | [Complete settings, accessibility and release readiness](https://github.com/sepyHR80/StockApp/issues/41) | B05, C05, C06, E02 | Backlog | [F03](issues/F03.md) |

## Definition of done

A merged PR links its issue, demonstrates each acceptance criterion, updates affected docs/ADRs and records commands plus outputs. A tool that has only unit tests is not live-integration verified. No automatic merge or deploy from design saves.

Evidence and explicit gaps: [foundation verification](verification.md), delivered for review in [PR #42](https://github.com/sepyHR80/StockApp/pull/42).
