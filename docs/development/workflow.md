# Local development

The current project requires JDK 17 or later for Gradle. JDK 21 is the project verification baseline. Install Android SDK Platform 37 and accept licenses in Android Studio's SDK Manager. Set `ANDROID_HOME` or create an untracked `local.properties` with `sdk.dir` set to your SDK location. The wrapper pins Gradle and verifies its download checksum.

Follow the [local resource limits](../../AGENTS.md#local-resource-limits). Inspect host capacity and workload status before assigning the next heavy job:

```sh
memory_pressure
sysctl vm.swapusage
docker ps
docker stats --no-stream
```

If Docker is stopped, leave it stopped for Android work. Stop Penpot's own containers before Gradle or emulator work, preserving its volumes with `docker compose stop` from its Compose project. Use one stage at a time:

1. Edit and inspect the change.
2. Run the smallest affected test when one exists. For example, use `./gradlew :app:testDebugUnitTest --tests '*AffectedTest'` with the actual class name. The current repository unit-test task reports `NO-SOURCE`.
3. If needed, run `./gradlew :app:assembleDebug` or `./gradlew :app:lintDebug` in separate stages. The repository already configures one worker, no parallel execution, a 768 MiB heap and no persistent daemon. The APK is at `app/build/outputs/apk/debug/app-debug.apk`, and lint reports are under `app/build/reports/`.
4. If interaction or rendering needs verification after assembly, open the selected emulator or connect an API 23+ device. Install the existing APK with `adb -s <device-id> install -r app/build/outputs/apk/debug/app-debug.apk` and close the task-owned emulator when done.


For UI changes, open Pulse, enter demo mode, navigate across the tabs, inspect a chart, toggle a watchlist item and use Back. Capture the affected screens on a narrow viewport and check font scaling, touch targets, navigation insets and list-end reachability. Gradle assembly and lint cover different checks from this interactive pass.

For contract or docs changes, use the affected YAML validator and `git diff --check`. The documentation workflow validates the canonical OpenAPI file and project skill frontmatter. Review local links when moving documents.

Backend tasks become runnable as their packages and migrations land. A local Postgres deployment should be isolated from any hosted database and populated with synthetic seeds by default. Keep real-provider credentials and personal datasets in their own environment.

## Issue to release

1. Pick a published [roadmap item](roadmap.md), assign its implementer on GitHub, and check the linked prerequisites, acceptance criteria and verification steps. Record blockers on the issue. Confirm the target base before editing.
2. Branch from current `main` as `codex/<issue-number>-<short-name>`. When the work needs the native UI changes in [PR #5](https://github.com/sepyHR80/StockApp/pull/5), wait for that dependency or coordinate a temporary stacked branch on its head. Review the final diff and target `main` after the prerequisite lands.
3. Implement the bounded scope. Update contracts and add an ADR if the work changes an accepted decision. Apply the serial checks above and map each criterion to commands, evidence, or an explicitly pending check.
4. Open a PR to `main` using the repository template. Link its issue and prerequisites. Include the tested commit, checks, synthetic screenshots when relevant, and migration or rollback implications. If prior work used a stacked branch, retarget and compare against `main` once the prerequisite lands. Keep unresolved criteria open through review.
5. Merge after human review and required checks. Release from the reviewed commit through the applicable CI and deployment workflow once available. Verify the built artifact, readiness and synthetic smoke flow as applicable, and record the GitHub PR, release revision and verification result on the issue. The design listener leaves a reviewable local diff for manual handoff.

Tracked by [A04](issues/A04.md). Future release controls are tracked by [E02](issues/E02.md) and [E04](issues/E04.md).

See [project skill verification](verification.md) for the seven documentation walkthroughs and their remaining runtime checks.
