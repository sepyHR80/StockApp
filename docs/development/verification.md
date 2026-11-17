# Foundation verification

Recorded 2026-11-15 for [PR #42](https://github.com/sepyHR80/StockApp/pull/42). The native UI prerequisite remains [PR #5](https://github.com/sepyHR80/StockApp/pull/5). This is evidence for review, not a claim that all phase-A acceptance criteria are complete.

| Area | Observed result | Remaining acceptance |
| --- | --- | --- |
| Contracts and roadmap | OpenAPI validator, seven skill frontmatters, relative documentation links and 36 issue specifications passed validation. Published issues are #6–#41. | Review architecture decisions and merge prerequisite changes. |
| Local Penpot | 13 editable boards, 165 text nodes, 73 paths, 16 swatches and four library components persisted. Backup restored `Pulse Android`, revision 7, into an isolated database; restored asset archive comparison passed. | Saved baseline font and some vector details need visual correction; corrected seed source has not been rerun. A07 stays open. |
| Exporter budget | A real PNG export succeeded in about five seconds within 384 MiB after restricting Chromium/WASM pools and jobs to one. No out-of-memory kill was reported. | Check larger future designs before increasing limits. |
| Bridge | Eight focused tests passed. A real save containing accent color, description spacing and feature-card order changes reached the paused queue. | Keep snapshots synthetic; behavior still needs human diff review. |
| Native generation | One Codex run changed only `LandingScreen.kt` in its isolated worktree. Offline assembly and lint succeeded sequentially with one worker, 768 MiB heap and 384 MiB metaspace; lint XML contained no errors. | Generated UI is a review artifact and has not been copied to the source checkout. |
| Preview recovery | Initial install attempted before Android finished booting. Added boot-completion polling; one focused regression test passed, then the existing APK installed and launched through the corrected readiness helper. No extra Codex/build run was used. | The complete automatic sequence has not been rerun after the boot fix. A09 stays open until the next reviewed live run. |
| Narrow preview | At 375 dp width and 130% font scale, the final text and CTA remained visible; opening the account screen and Android Back succeeded. | Font fidelity is not accepted; no physical-device performance claim. |
| Teardown | Penpot and temporary restore containers, seed server, design listener and preview emulator were stopped; original Penpot volumes were retained. Emulator settings and the original demo APK were restored. | Start heavy tools only under the resource policy in AGENTS.md. |

Screenshots, exported design, backup and generated UI patch are retained in the ignored local Penpot data directory. Public issue reports must not include its credentials or account exports.

## Follow-up review, 2026-11-17

The [batch map](batches.md) groups all 36 issues into bounded assignments with prerequisite and evidence gates. GPT-6.1 Terra implementation and independent reviews identified and corrected two runner integrity gaps: corrupted PNG input validation and source changes during emulator readiness/capture. New regression cases cover both. The supported PNG subset and runtime requirement are documented in the [design guide](../design-sync.md).

Catalog pagination, completed-session coverage and owner-scoped job cancellation now agree across the planned API and issue specifications. These are contract changes, not backend features. Syntax and diff checks passed locally; the PR's Documentation check records OpenAPI, skill-frontmatter and focused runner-test results for each pushed revision. Local heavy checks were deferred by the resource gate.

The saved editable Penpot baseline has Roboto on 103 text layers; 62 layers at weights 600/700 still need the approved font correction. Its existing portable export and backup predate that partial correction. Task-owned Penpot containers were stopped with volumes preserved. A07 remains open for the remaining repair, export and visual comparison; A09 remains open for a complete automatic run after the runner fixes. Existing backup/restore evidence and the earlier native checks above are retained without an unchanged rerun.

## Project skill scenarios

The bundled skill-creator quick validator passed the seven initial project skill files. The scenarios below were walked through against repository guidance and contracts. These are documentation checks. They do not certify runtime behavior.

| Skill | Scenario reviewed | Evidence and remaining execution |
| --- | --- | --- |
| Android | Stale quote after sign-out | The Android design requires clearing the owner session and ignoring responses from an earlier identity. Backend integration is pending. [B06](issues/B06.md) |
| Backend | Access to another owner’s job | The API contract and data model distinguish bearer authorization, allowlisting and owner-scoped lookup. Exercise with two real test identities when the backend exists. [B03](issues/B03.md) |
| ML research | Five-session label crossing a temporal split | The protocol requires purging overlap, fitting transforms per training fold and evaluating the sealed holdout once. A dataset run is pending. [D04](issues/D04.md) |
| AI runtime | Grounded ID with incorrect volatility | The spec requires numerical consistency and preserves deterministic metrics if explanation fails. Validate with an adapter fixture once implemented. [D02](issues/D02.md) |
| Render operations | Free database nearing expiry | The runbook specifies day-21 and day-25 checks, restore and pre-expiry cutover. No database was provisioned for this phase. [E03](issues/E03.md) |
| Design sync | Spacing change with local automation paused | The local resource policy and ADR require controlled processing and isolated review. The complete live integration demonstration remains tracked separately. [A09](issues/A09.md) |
| Skill authoring | Duplicate research-workflow proposal | The authoring skill directs reuse of the existing research skill, linked canonical docs, structure validation and a scenario walkthrough. Project skill work is tracked by [A05](issues/A05.md). |
