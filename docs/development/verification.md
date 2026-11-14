# Project skill verification

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
