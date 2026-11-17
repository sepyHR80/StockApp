# ADR 0004 · Controlled design automation on the local host

**Date** 2026-11-15\
**Status** Accepted\
**Issues** [A04](../../development/issues/A04.md), [A06](../../development/issues/A06.md), [A08](../../development/issues/A08.md), [A09](../../development/issues/A09.md)

## Context

Penpot, Gradle and an Android emulator compete for memory on the shared 16 GB host. Saved design data can arrive in bursts and needs review before it changes the main checkout.

## Options

Run the full toolchain on every save, queue snapshots for controlled local work, or reserve live verification for a host with sufficient capacity.

## Decision

Default to paused design automation. Run controlled work only when the parent agent has scheduled capacity. Use an isolated worktree, immutable snapshot, bounded queue and command budget, with manual review before transferring changes. Use separate host capacity for live integration when the local serial resource policy prevents the combined workflow.

## Consequences

Saved designs can wait for an operator-controlled run. Capture and verification have separate resource needs. Apply the [local resource policy](../../../AGENTS.md#local-resource-limits). The [design sync runbook](../../design-sync.md) documents the actual controls and verification state.
