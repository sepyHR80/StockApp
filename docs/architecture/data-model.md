# Identity and market data

Android signs in via Credential Manager's Google flow, exchanges the Google credential with Firebase Auth, and sends the **Firebase ID token** in the personal-route bearer header. Use Firebase Admin verification with the configured project, checking signature, issuer, audience, expiry and revoked accounts. Require the Google sign-in provider and an active UID allowlist entry. A missing or invalid credential returns 401. A valid identity outside the allowlist returns 403. Resolve a local owner ID from the verified issuer and subject. Never accept an owner identifier in client job input. Scope job lookup to the authenticated owner and return 404 for another owner's ID. Keep demo routes and caches partitioned by data mode.

| Table | Fields and constraints |
| --- | --- |
| `app_user` | UUID primary key, `firebase_issuer`, `firebase_uid`, `enabled`, UTC `created_at`, unique issuer and UID |
| `instrument` | Immutable UUID, display symbol, exchange or venue, asset class, currency and trading calendar, unique venue and provider mapping |
| `market_snapshot` | UUID, mode, source ID, source version, captured-at UTC timestamp, manifest hash, calendar version and adjustment basis. Immutable after validation |
| `daily_bar` | Snapshot ID, instrument ID, session date, OHLC as `NUMERIC(28,12)`, split-adjusted close as nullable `NUMERIC(28,12)`, volume as nullable `NUMERIC(32,12)`, primary key over the first three fields. Positive prices and consistent OHLC bounds |
| `user_settings` | Owner ID as primary and foreign key, explanation opt-in default false, UTC update time. Personal mode only |
| `watchlist_entry` | Owner ID and instrument ID foreign keys, UTC creation time, composite primary key. Personal mode only |
| `account_deletion` | Issuer and subject as unique actor key, requested time, pending/completed state, attempt count, last safe failure code. Retain actor key only while cleanup and replay handling require it |
| `analysis_job` | UUID, owner ID or public-demo scope, request hash, idempotency key, snapshot ID, metric version, state, attempt count, lease expiry, timestamps, result and safe error code. Unique scope plus idempotency key |
| `explanation_run` | Job ID, status, model revision, prompt version, grounding schema version, runtime route, duration, token usage and safe failure code |

Use exact decimals on ingestion and serialize decimal values as JSON strings. Normalize to the declared USD currency without foreign-exchange conversion in v1. Represent dates as inclusive ISO calendar dates. US equities use exchange-local session dates and the exchange calendar. Crypto uses midnight-to-midnight UTC days. Exclude incomplete sessions. Daily bar endpoints return raw OHLC. Analysis returns price return and identifies its close series basis. For equities, use verified split-adjusted close when available. Use raw close when the provider's corporate-action coverage verifies there were no splits in the range. Reject ranges with splits and no verified adjusted series, or unclear corporate-action coverage, using `unverified_adjustment`. Dividends are excluded from price return. Crypto uses raw daily close. Keep the source and adjustment basis consistent throughout a series.

A date query selects the latest validated snapshot for mode and instrument and returns sorted rows with expected versus observed session counts and missing session dates. Weekends and exchange holidays are excluded from expected equity sessions. Missing sessions are never forward-filled. Return partial price rows with explicit coverage. A valid range with zero rows returns an empty array. Analysis requires full coverage and at least three closes. Persist the chosen snapshot before execution so corrections only change results for newly submitted jobs.

Example bar for a synthetic crypto series:

```json
{"date":"2026-01-05","open":"101.10","high":"103.20","low":"99.80","close":"102.25","volume":"125.125"}
```

Capture acquisition timestamp, source and license in the import manifest. Validate uniqueness, calendar, currency, adjustment semantics and completeness before publication. Keep real datasets and redistribution-controlled artifacts confined to authorized environments. Public charts and public analysis use synthetic source IDs.


## Account lifecycle

Export only owner-scoped state and analysis results. Return private responses with `Cache-Control: no-store`. Require a Firebase token whose `auth_time` is within five minutes for deletion, including a fresh Google credential when needed. Atomically disable the local account and persist the deletion request before returning 202. Keep a narrowly scoped retry path for the same verified owner during deletion. Complete database cleanup and Firebase deletion in resumable steps and treat an already absent record as success. Erase owner-private records and keep shared market snapshots. An account removal must not be undone by stale tokens or implicit allowlist recreation. Document backup recovery retention before enabling persistent personal accounts.
