# Pulse design in Penpot

The editable baseline uses the native Compose demo screens and its Android colors, dimensions, price series and vector icons. The 393 × 852 boards include Landing, both Account modes, Dashboard, Markets, Stock detail, both Watchlists states, Portfolio, More, Alerts and Settings. The charts are vector paths. The local library includes the palette and four starter components for buttons, quote rows and chart panels.

## Start Penpot locally

Open Docker Desktop and run the commands from the repository root. Put the Docker CLI on your PATH if Docker Desktop installed it under `~/.docker/bin`.

```sh
(
  cd tools/penpot
  umask 077
  test -e .env || python3 -c 'import secrets; print("PENPOT_SECRET_KEY=" + secrets.token_urlsafe(64)); print("PENPOT_DB_PASSWORD=" + secrets.token_urlsafe(32))' > .env
  docker compose up -d
)
```

Open [local Penpot](http://localhost:9002) in Chrome. The frontend binds only to loopback. The PostgreSQL database and uploaded assets persist in named volumes under the `stockapp-penpot` project. Port 9002 avoids the other local application occupying 9001. To change it, set `PENPOT_PORT` in `tools/penpot/.env`, then recreate the stack and update the design sync origin. The stack uses pinned Penpot 2.19.1 images and the documented option to disable the Admin Console. [Official Penpot Docker guide](https://help.penpot.app/technical-guide/getting-started/docker/)

Create a local Penpot profile through **Create an account** or with the included CLI. The CLI prompts for profile details and can skip the walkthrough. [Penpot profile CLI](https://help.penpot.app/technical-guide/getting-started/docker/#using-the-cli-for-administrative-tasks)

```sh
(cd tools/penpot && docker compose exec backend ./manage.py create-profile --skip-tutorial --skip-walkthrough)
```

## Resource limits and shutdown

The local stack is opt-in and has no automatic restart. Stop it after each design session to leave memory available for Android Studio and the emulator.

```sh
(cd tools/penpot && docker compose stop)
```

The backend is capped at 1 GiB and one CPU, with a 512 MiB Java heap and 256 MiB metaspace. The frontend, exporter, PostgreSQL and Valkey are capped at 128, 384, 256 and 128 MiB respectively. The exporter handles one job at a time and starts workers on demand. Allow the backend to finish booting after startup before opening the editor. Stop the Android emulator before a resource-heavy Penpot session and stop Penpot before starting an Android build or emulator verification.

## Recreate the editable baseline

1. Run `python3 tools/penpot/serve-seed.py` from the repository root.
2. Create a blank design file called **Pulse Android** in Penpot and open it.
3. Open **Plugins**, paste `http://127.0.0.1:41783/manifest.json`, and install **Pulse initial design**.
4. Open the plugin and select **Create editable Pulse screens**. Run this once per blank file. The panel displays the IDs for the file and each board.
5. Export the design from the Penpot Dashboard when you need a portable copy. The exported file can be imported from the Dashboard on another compatible Penpot instance. [Penpot import and export](https://help.penpot.app/user-guide/export-import/)

The initial local export contains editable layers for all 12 screen states. Its font metadata selects Roboto Mono, while the captured PNG showed a serif fallback. Chart areas also need explicit editable gradient fills instead of relying on imported SVG attributes. The seed source now selects Roboto by font ID and assigns gradients directly to path layers for future seeds. The saved baseline still requires these corrections and a fresh visual check.

See [design-sync.md](design-sync.md) for wiring the board IDs to native Kotlin files, review and screenshot verification.

## Back up and verify a restore

```sh
tools/penpot/backup.sh
tools/penpot/restore-test.sh /absolute/path/printed/by/backup
```

The backup briefly stops Penpot while PostgreSQL and the asset volume are copied to the same timestamped directory. Keep the resulting directory private. It contains account data and the stack secrets. The restore test loads a fresh database and asset volume under a unique Docker project, verifies the assets against the archive, lists restored design files and removes that temporary project. It publishes no ports. Use a fresh instance for recovery.

## شروع سریع

۱. Docker Desktop را باز کنید و دستور بخش **Start Penpot locally** را اجرا کنید.\
۲. در Chrome آدرس [Penpot محلی](http://localhost:9002) را باز کنید و با حساب محلی وارد شوید.\
۳. برای بازسازی طرح، سرور افزونه را اجرا کنید. فایل خالی **Pulse Android** را بسازید و افزونه **Pulse initial design** را نصب و اجرا کنید. متن‌ها، اجزا و مسیر نمودارها در Penpot قابل ویرایش هستند.\
۴. برای همگام‌سازی تغییرات صفحه با کد، [راهنمای همگام‌سازی](design-sync.md) را دنبال کنید.\
۵. برای پشتیبان‌گیری و آزمایش بازیابی، دستورهای بخش **Back up and verify a restore** را اجرا کنید.
