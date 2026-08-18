# Kindle Home Dashboard

A monochrome, high-contrast Lovelace dashboard built for e-ink displays. Designed to be captured by [Lovelace Kindle Screensaver](https://github.com/joelspurr/lovelace_kindle_screensaver) and pushed to a jailbroken Kindle running OnlineScreensaver, but the card itself works on any Lovelace view.

Shows: outdoor conditions (temperature, min/max, wind, humidity, pressure), three AC/climate rooms, a 5-day forecast, a 24h rain chart, and a footer with Kindle battery status and the current date/time.

## Requirements

This README assumes the Kindle-side setup is already done and working:

- A jailbroken Kindle (7th gen or similar) with the Screensaver hack and [OnlineScreensaver](https://www.mobileread.com/forums/showthread.php?t=274681) installed
- [Lovelace Kindle Screensaver](https://github.com/joelspurr/lovelace_kindle_screensaver) configured on the Home Assistant side and successfully capturing screenshots

If any of that isn't in place yet, get it working with a stock dashboard first — this card assumes the capture pipeline is already reliable.

### Required entities

This card does **not** discover or create entities — every entity ID is hardcoded in `dist/adapters/home-assistant/config.js` and must be adapted to your own Home Assistant instance before use.

| Config key | Type | Purpose |
|---|---|---|
| `outside.temperature` | sensor | Outdoor temperature (numeric state) |
| `outside.weather` | `weather.*` entity | Must support both `daily` and `hourly` forecasts (checked via `weather.get_forecasts`). Also reads `humidity`, `pressure`, `wind_speed`, `wind_bearing` attributes from its current state |
| `rooms[].climate` | `climate.*` entity | One per room card (3 by default). Reads `current_temperature`, `temperature`, `fan_mode`, `fan_modes` attributes — any standard HA climate entity works |
| `battery.level` | `input_number` | Kindle battery percentage (0-100). Something on your side needs to push this value — Lovelace Kindle Screensaver doesn't report it natively |
| `battery.charging` | `input_boolean` | Whether the Kindle is currently charging |

The 5-day forecast and 24h rain chart are built directly from `outside.weather`'s forecasts (`weather.get_forecasts`, called every ~15 minutes and cached — this entity's own upstream refresh interval, so there's no point polling more often). No separate per-day or per-hour sensors are needed for this.

The three room cards are a hardcoded count in the current version — not configurable without editing the source.

## Installation (HACS)

1. HACS → the three dots (top right) → **Custom repositories**
2. Add this repository's URL, category **Lovelace**
3. Find "Kindle Home Dashboard" in HACS and install it
4. HACS registers the Lovelace resource automatically — no manual resource entry needed

### ⚠️ A note on customization

Since entity IDs live in `dist/adapters/home-assistant/config.js` rather than the card's YAML config, editing that file directly works, but **HACS will overwrite your edits on the next update**. Until this project supports YAML-based configuration (not yet implemented), your options are:

- Fork the repository and point HACS at your fork instead, or
- Re-apply your `config.js` edits after every update (check the diff HACS shows you before updating)

## Setting up the dashboard view

HACS only installs the card — it doesn't create a dashboard. Add a new view yourself:

**Settings → Dashboards → Add Dashboard**, or add a view via YAML:

```yaml
title: Kindle
path: kindle
panel: true
cards:
  - type: custom:kindle-home-dashboard
```

`panel: true` is important — it makes the card fill the whole view edge-to-edge, matching the fixed 600×800 canvas the card renders internally.

Point Lovelace Kindle Screensaver at this view's URL (`.../kindle`).

## Versioning & updates

Releases follow [Semantic Versioning](https://semver.org/) (`MAJOR.MINOR.PATCH`) and are published as [GitHub Releases](../../releases) — that page is the changelog; there's no separate `CHANGELOG.md` to keep in sync. HACS reads those releases directly and will notify you in Home Assistant when a new one is available.

## Troubleshooting

If the card shows "Custom element doesn't exist: kindle-home-dashboard", open the dashboard in a browser, open dev tools (F12) → Console, and reload. A 404 there tells you exactly which file failed to load — that's almost always the actual problem, not the YAML config.
