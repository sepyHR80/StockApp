# StockApp repository guidance

Read the [development runbook](docs/development/workflow.md) and the relevant architecture document before changing a contract. Project workflows live under [.agents/skills](.agents/skills). Keep current behavior and planned components distinct in docs and issue reports.

Keep Android native Kotlin and Compose in the single `app` module. Preserve the offline synthetic demo. Keep provider keys, database URLs, Firebase service account files and private dataset exports out of the repository, APK, logs and screenshots. Keep design outputs reviewable against native behavior.

When drafting or posting GitHub comments, reviews, or replies, include only information needed for the current GitHub task and supported by its repository or GitHub thread. Disclose specific private-source information only with explicit user authorization.

Run the focused checks listed in the development runbook and report verification gaps with the change.

## Local resource limits

This repository shares a 16 GB Mac with other applications. The parent agent schedules at most one heavy job across all agents. Builds, test suites, emulator sessions, Docker workloads and model runs count as heavy jobs. Parallel delegation is limited to read-only inspection and documentation edits. Coordinate explicitly before starting a heavy job.

Inspect available RAM, memory pressure, swap and running Docker workloads before starting. If pressure is severe or another heavy job is active, continue with lightweight work. Keep Penpot stopped while running Gradle or an emulator. Run the smallest relevant test first. Run assembly or lint only when needed, in separate stages, and rerun a suite only when a code change, failure, or new evidence warrants it.

Use the repository Gradle defaults of one worker, no parallel execution, a 768 MiB maximum heap and no persistent daemon. Stop only idle daemons, emulators and containers started for this task. Preserve Docker volumes and never kill unrelated applications. Report comparable before-and-after measurements before claiming a resource improvement.
