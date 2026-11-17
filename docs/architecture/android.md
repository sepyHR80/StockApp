# Android

The app currently has one Gradle module. `MainActivity.kt` hosts the edge-to-edge shell, tab routing and saveable demo state. `PulseTheme.kt` defines Material 3 colors and shapes. Account navigation and synthetic market data work offline. Keep the offline entry available when real sign-in lands.

When connecting live data, keep a screen ViewModel for each stateful route and collect its immutable StateFlow with lifecycle awareness. Use repositories for synthetic and remote data. Map transport DTOs at that boundary, preserve exact decimal strings until domain conversion, and carry data-mode, provenance and freshness through to the UI. Reserve rememberSaveable for local presentation state and route arguments. Store private cache keys by owner and clear the current owner's data on sign-out. Ignore cancelled responses that belong to an earlier identity or mode.

Use the native Credential Manager Google flow followed by Firebase Auth. Keep public demo reachable when sign-in or the network is unavailable. Let users distinguish synthetic, partial, stale, loading and retryable states visually and through accessibility labels.

Keep the compact floating-navigation treatment localized to its Material surface. Check system insets, minimum touch size, text scaling and list-end clearance on an emulator and affected physical devices. See the [development workflow](../development/workflow.md) and [design sync guide](../design-sync.md).
