---
name: stockapp-android
description: Implement or review native StockApp screens, navigation, repositories, ViewModel state and Android accessibility.
---

Read `docs/architecture/README.md` and `docs/development/workflow.md`. Trace the entry in MainActivity and the affected screen before editing. Preserve offline synthetic demo behavior. Keep integrations inside the app module and introduce screen-scoped StateFlow and repositories at the relevant seam.

Use PulseTheme and existing Material 3 controls. Keep glass on the floating navigation surface, where translucency explains depth, and use opaque reading surfaces. Verify contrast over background content, 48 dp targets, edge-to-edge system insets consumed once and the last scroll item clearing the bar. Apply the development runbook build and interaction checks.

Follow the local resource limits in repository-root `AGENTS.md` before starting local heavy work.

Validation scenario. A quote screen receives a stale response after sign-out. Verify that the ViewModel ignores it, a new owner sees no cached data, and the offline demo stays available. [Android architecture recommendations](https://developer.android.com/topic/architecture/recommendations)
