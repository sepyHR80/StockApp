# StockApp

StockApp is a native Android daily-market research app. The current Pulse build uses bundled synthetic market data and a demo account flow. The foundation specifies a future authenticated backend, historical US equity and cryptocurrency data, and evidence-grounded analysis.

## Run the Android demo

Open this repository in Android Studio with Android SDK Platform 37 installed, then run the `app` configuration on an emulator or device. The command-line setup and checks are in the [development runbook](docs/development/workflow.md).

## راه‌اندازی سریع

۱. پروژه را در Android Studio باز کنید و Android SDK Platform 37 را نصب کنید.\
۲. یک شبیه‌ساز یا دستگاه با Android API 23 یا بالاتر انتخاب کنید و پیکربندی `app` را اجرا کنید.\
۳. برای ساخت و بررسی از خط فرمان، `./gradlew :app:assembleDebug` را اجرا کنید و بررسی‌های لازم را جداگانه طبق [راهنمای توسعه](docs/development/workflow.md) انجام دهید. داده‌های نسخهٔ نمایشی ساختگی‌اند و برای اجرای آن نیازی به حساب گوگل یا سرور ندارید.

## Project references

- [Architecture and roadmap](docs/architecture/README.md)
- [API contract](docs/architecture/api-v1.yaml) and [data model](docs/architecture/data-model.md)
- [Analysis, inference and research](docs/architecture/ai-ml.md)
- [Render operations](docs/operations/render.md)
- [Design handoff](docs/design-sync.md)
- [Project skills](.agents/skills)
