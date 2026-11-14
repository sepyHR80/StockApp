# همگام‌سازی طراحی Penpot با Compose

Design Sync یک ابزار محلی برای طراحی Pulse است. افزونه با رویداد رسمی [`contentsave`](https://doc.plugins.penpot.app/interfaces/EventsMap) و پس از ۵ ثانیه بدون ذخیرهٔ تازه، ساختار طرح، توکن‌ها و PNG بردهای مشخص‌شده را به برنامهٔ محلی می‌فرستد. تغییرات فقط در worktree جداگانه انجام می‌شود. برای محدودکردن مصرف حافظه، listener در شروع در حالت توقف پردازش است و فقط تازه‌ترین ذخیره را در صف نگه می‌دارد.

## آماده‌سازی و شروع

1. Penpot محلی و فایل طراحی Pulse را باز کنید. شناسهٔ فایل و بردهای قابل همگام‌سازی را از خروجی افزونهٔ Seed یا ابزار Inspect بردارید. طرح ورودی را به محتوای دمو محدود کنید.
2. Node.js 22، نسخهٔ واردشدهٔ Codex CLI، JDK 21 و Android SDK را آماده کنید. برای آماده‌سازی کش آفلاین، Penpot را متوقف کنید و طبق [سیاست منابع محلی](../AGENTS.md#local-resource-limits) ابتدا `./gradlew :app:assembleDebug` و در مرحله‌ای جدا `./gradlew :app:lintDebug` را اجرا کنید. شناسهٔ شبیه‌ساز را با `adb devices` پیدا کنید. روی مک ۱۶ گیگابایتی، هنگام آماده‌کردن کش یا ویرایش در Penpot، شبیه‌ساز را باز نگه ندارید.
3. بیرون از پوشهٔ مخزن یک فایل تنظیمات محلی بسازید. UUIDهای مثال را با شناسه‌های واقعی عوض کنید. برای هر برد، فقط فایل‌های نمایش مربوط به همان برد را فهرست کنید.

```json
{
  "stateDir": "/private/tmp/pulse-design-sync-review",
  "origin": "http://localhost:9002",
  "port": 41782,
  "emulator": "emulator-5554",
  "files": {
    "00000000-0000-0000-0000-000000000001": {
      "00000000-0000-0000-0000-000000000002": [
        "app/src/main/java/com/example/androidstockapp/LandingScreen.kt",
        "app/src/main/java/com/example/androidstockapp/PulseTheme.kt"
      ]
    }
  }
}
```

مقدار `origin` باید دقیقاً با نشانی بازشده در مرورگر یکی باشد. در macOS از مسیر واقعی `/private/tmp/…` یا مسیر خصوصی دیگری برای `stateDir` استفاده کنید. ابزار این پوشه را با دسترسی خصوصی ایجاد می‌کند. فایل‌های Kotlin قابل نگاشت شامل `LandingScreen.kt`، `MainActivity.kt`، `MarketScreens.kt`، `AccountScreen.kt`، `PriceChart.kt` و `PulseTheme.kt` هستند. فایل‌های موجود `ic_*.xml`، `strings.xml` و `themes.xml` هم قابل نگاشت‌اند. چند برد در یک فایل Penpot می‌توانند فایل Kotlin مشترک داشته باشند و با هم بررسی شوند. فایل نمایش مشترک را میان چند فایل Penpot نگاشت نکنید.

```sh
node tools/design-sync/sync.mjs start /absolute/path/design-sync.json
```

نشانی `Manifest` چاپ‌شده را در Plugin Manager پنپات وارد کنید. افزونهٔ Design Sync را باز کنید، توکن همان نشست را در پنل وارد کنید و Connect را بزنید. هنگام ویرایش، پنل و listener را باز نگه دارید. تغییر هر برد را ذخیره کنید و منتظر پیام «Snapshot received» بمانید. سپس Penpot و هر شبیه‌ساز فعال را متوقف کنید و فرآیند صف را از سر بگیرید.

```sh
node tools/design-sync/sync.mjs resume /absolute/path/design-sync.json
```

Codex، assemble و lint به‌ترتیب اجرا می‌شوند. وقتی وضعیت `stage` به `awaiting-emulator` رسید، شبیه‌ساز تنظیم‌شده را دستی باز کنید. listener برای اتصال آن تا ۵ دقیقه صبر می‌کند. پیش از بازکردن دوبارهٔ Penpot، پس از پایان بررسی شبیه‌ساز را ببندید و صف را با `pause` متوقف کنید.

## وضعیت، توقف و بازبینی

```sh
node tools/design-sync/sync.mjs status /absolute/path/design-sync.json
node tools/design-sync/sync.mjs pause /absolute/path/design-sync.json
node tools/design-sync/sync.mjs stop /absolute/path/design-sync.json
node --test tools/design-sync/core.test.mjs
```

هر بار فقط یک اجرا فعال است و تازه‌ترین طرح جایگزین طرح منتظر می‌شود. دستور `pause` شروع اجرای بعدی را متوقف می‌کند و اجرای جاری را قطع نمی‌کند. طرحی که هش آن با آخرین اجرای موفق همان فایل یکی است دوباره اجرا نمی‌شود. سقف صدور فرمان Codex ده بار در ساعت است و تلاش تعمیر نیز در این سقف حساب می‌شود. این سقف میان تمام worktreeهای همین مخزن و دایرکتوری‌های جلسه مشترک است.

پس از تکمیل، `latestResult.directory` پوشهٔ `input` با `snapshot.json` و PNG بردهای لازم برای بررسی و فایل `emulator-launch.png` با تصویر لحظهٔ بازشدن برنامه را دارد. برای بازبینی، در مسیر `stateDir/worktree` دستور `git diff` را اجرا کنید. worktree متعلق به listener است و هنگام اجرای آن نباید دستی ویرایش شود. listener محدودهٔ فایل‌های مجاز را بررسی می‌کند. پیش از commit یا PR، تغییرات رفتاری را در diff بررسی کنید، مسیرهای تحت تأثیر را روی شبیه‌ساز باز کنید و از همان صفحه‌ها تصویر بگیرید.

وضعیت `halted` و فیلد `reason` علت توقف را نشان می‌دهند. پیش از شروع مجدد، diff و فایل‌های ثبت‌نشدهٔ worktree را بررسی و تغییرات موردنیاز را حفظ کنید. برای شروع از HEAD جاری، listener را متوقف کنید و یک `stateDir` خصوصی تازه انتخاب کنید. worktree قبلی با توقف یا شروع جدید پاک نمی‌شود. اگر اجرای قبلی در میانهٔ کار قطع شده باشد، راه‌اندازی بعدی همان worktree را در حالت توقف نگه می‌دارد.

اگر فرایند به‌اجبار کشته شده و قفل باقی مانده است، PID درج‌شده در `owner.json` در مسیر چاپ‌شدهٔ `Runtime lock` را بررسی کنید و فقط پس از اطمینان از پایان آن فرایند، پوشهٔ قفل را بردارید. اجرای قطع‌شده همچنان برای بازبینی در وضعیت توقف خواهد ماند.
