# ADR 0001 · Native Android in one module

**Date** 2026-11-15\
**Status** Accepted\
**Issues** [A01](../../development/issues/A01.md), [A03](../../development/issues/A03.md), [B06](../../development/issues/B06.md)

## Context

The repository began at `6af7050`. Native Compose screens landed in `2d471e9` and compact glass navigation in `4efd366`. [PR #5](https://github.com/sepyHR80/StockApp/pull/5) was open when this decision was recorded. The current demo can run locally.

## Options

Keep a native single-module app and extract features when justified, split features into Gradle modules immediately, or carry a separate web UI runtime and bridge its platform behavior.

## Decision

Use Kotlin, Compose and Material 3 in one Android module. Introduce screen ViewModels, StateFlow and repository seams as backend integrations arrive. Preserve the offline synthetic flow.

## Consequences

Compose owns native navigation and accessibility. The module remains straightforward to build and debug. Revisit module boundaries when compiling, testing or maintaining the single module becomes a measured constraint. UI integration continues through [PR #5](https://github.com/sepyHR80/StockApp/pull/5).
