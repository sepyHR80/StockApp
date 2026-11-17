# ADR 0002 · Modular backend and separated data modes

**Date** 2026-11-15\
**Status** Accepted\
**Issues** [A02](../../development/issues/A02.md), [B01](../../development/issues/B01.md), [B03](../../development/issues/B03.md), [C03](../../development/issues/C03.md)

## Context

StockApp needs historical sessions with known provenance, personal access tied to a verified identity and a public demo available without sign-in.

## Options

Use one modular backend with one relational database, separate identity and market services immediately, or send provider requests directly from Android. The latter two add deployment coupling or push access controls and provider integration into the client.

## Decision

Use a modular FastAPI service, SQLAlchemy and Alembic over PostgreSQL. Android uses Credential Manager and Google-only Firebase Auth. The service verifies Firebase ID tokens and authorizes enabled UIDs. Public requests use versioned synthetic fixtures. Persist source, version and adjustment basis per market snapshot. Use the relevant session calendars for daily equities and crypto.

## Consequences

Keep authorization, historical data and durable jobs within one deployment. Test identity scope and demo isolation at the service boundary. Revisit component separation after workload or availability measurements justify it. See the [backend design](../backend.md) and [Render decision](0005-render-preview.md).
