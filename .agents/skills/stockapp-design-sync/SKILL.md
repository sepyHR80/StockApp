---
name: stockapp-design-sync
description: Review or hand off StockApp Android visuals using design tokens, emulator screenshots and supported Figma or Penpot workflows.
---

Start with `docs/design-sync.md` and the current Compose files. Keep Figma and Penpot work scoped to the requested tool and use synthetic screenshots. Check actual rendering, navigation placement, color contrast, font scale and end-of-list reachability. Distinguish editable imported layers from screenshot references in handoff notes. Bring implementation changes through Kotlin and Compose.

Follow the local resource limits in repository-root `AGENTS.md` before starting local heavy work.

Validation scenario. Change spacing in a mapped board while automation is paused. Verify the runbook gives the operator a controlled snapshot review and a separately scheduled Gradle check. [Penpot plugin events](https://doc.plugins.penpot.app/interfaces/EventsMap)
