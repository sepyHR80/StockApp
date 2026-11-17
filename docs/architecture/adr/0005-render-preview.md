# ADR 0005 · Defer Render preview infrastructure until the backend is ready

**Date** 2026-11-15\
**Status** Accepted\
**Issues** [A10](../../development/issues/A10.md), [E01](../../development/issues/E01.md), [E03](../../development/issues/E03.md)

## Context

Render Free web services sleep when idle. Free PostgreSQL expires after 30 days, has a 1 GB limit and lacks managed backups. Starting the database early would consume its lifetime before the backend can use it. [Render Free limits](https://render.com/docs/free)

## Options

Provision preview infrastructure during architecture work, defer provisioning until migrations and readiness checks exist, or request durable paid infrastructure once persistence is needed.

## Decision

Defer provisioning until the backend and migration baseline are ready. Use Free for the first time-limited preview after a backup and expiry plan is ready. Route persistent personal use to local or separately approved durable PostgreSQL.

## Consequences

Retirement of the prior preview service and its deployment link was verified. The scoped Render workspace showed no active services, and this phase created no new database. Before provisioning, follow the [Render runbook](../../operations/render.md) and verify current plan limits.
