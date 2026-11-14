# StockApp native UI migration

## Specification

Recreate the stock prototype in the existing Android app. Preserve the Pulse branding, dark mint palette, screen hierarchy, mock market data, search, and chart controls. Use rounded stock rows, cards, form fields, chart controls, buttons, and navigation surfaces. Keep the existing application ID and `minSdk 23`. Use one Kotlin app module with Jetpack Compose, Material 3, Android resources, and an Android back stack. Compile against stable Android SDK 37. Start with `targetSdk 36` to preserve the app’s runtime behavior while validating the migration on Android 16.

The prototype has a landing page, sign-in and account-creation screens, dashboard, markets, stock detail, and four “Coming soon” routes for watchlists, portfolio, alerts, and settings. The account UI preserves its fields and modes and offers explicit demo access. The watch control updates a single watchlist for the current app session. Alerts and Settings are under More so the bottom bar has five destinations. Live prices, remote sign-in, cloud data, and notifications require separate integrations. Prices and historical series in this migration are simulated.

## Development table

| Order | Deliverable | Files | Acceptance |
| --- | --- | --- | --- |
| [1](https://github.com/sepyHR80/StockApp/issues/1) | Update the Android build and document the migration | `app/build.gradle.kts`, `gradle/wrapper/`, this plan | Gradle builds with SDK 37, a stable Compose BOM and Material 3. The app installs on Android 16. |
| [2](https://github.com/sepyHR80/StockApp/issues/2) | Migrate Pulse landing, account UI, and native navigation | `MainActivity.kt`, `PulseTheme.kt`, `LandingScreen.kt`, `AccountScreen.kt`, `strings.xml` | The landing displays a Nasdaq card and demo notice. Get started opens the account screen. Switching account modes, entering demo mode, and Android Back work. |
| [3](https://github.com/sepyHR80/StockApp/issues/3) | Migrate market and stock screens | `DemoMarket.kt`, `MarketScreens.kt`, `PriceChart.kt`, `MainActivity.kt`, `strings.xml` | Dashboard lists sample quotes. Markets filters by name or symbol. Stock detail supports time range and chart style. The demo watchlist can add and remove symbols. The other three routes show their placeholder state. |
| [4](https://github.com/sepyHR80/StockApp/issues/4) | Verify parity, remove the temporary web export, and open the PR | This plan and the Android sources above | Debug build and Lint pass. Exercise landing, account, search, stock, tabs, and Back on the emulator. After verification, remove the temporary local web files. Open a PR from `codex/native-ui` into `main` and link the stage issues. |

## Execution and verification

- [x] Verify the wrapper checksum and install SDK 37. Build with `./gradlew :app:assembleDebug :app:lintDebug` before the merge review.
- [x] Keep navigation state restorable. Handle Back from stock detail by restoring its parent tab, and from the dashboard by returning through the account screen to landing.
- [x] Keep sample quote prices and the chart input deterministic. Read through the same quote model in the dashboard, markets, and detail. Draw the line, area, and candles in Compose and cache drawing geometry by size and selected series.
- [x] Install `app/build/outputs/apk/debug/app-debug.apk` on the Pixel 8 emulator. Check screen text and controls through Android accessibility. Inspect the chart and layout visually. Exercise a 375 dp viewport and 130% font scale.
- [x] Confirm the app uses Kotlin and Android resources for its UI. Review `git diff --check` and ensure the temporary export is absent from the repository before pushing.
