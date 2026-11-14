# ADR 0003 · Deterministic analysis and evaluated explanations

**Date** 2026-11-15\
**Status** Accepted\
**Issues** [D01](../../development/issues/D01.md), [D02](../../development/issues/D02.md), [D04](../../development/issues/D04.md), [D05](../../development/issues/D05.md), [D06](../../development/issues/D06.md)

## Context

A historical metric should be reproducible and remain available when optional explanation is slow or unavailable.

## Options

Compute metrics and provide only a deterministic summary, ask a language model to calculate and explain, or compute deterministic metrics and validate model explanations against evidence.

## Decision

Compute return, volatility and drawdown from a frozen snapshot. Add an optional validated explanation. Select inference routes through explicit configuration and keep training and evaluation out of the deployed runtime.

## Consequences

Metrics remain usable through inference failure. Promotion requires grounding, privacy, performance and budget evidence. Keep the prior route and deterministic summary available for rollback. LiteRT remains an option pending real-device measurements. See the [analysis and research design](../ai-ml.md).
