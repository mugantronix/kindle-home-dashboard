# Kindle Home Dashboard

A monochrome, high-contrast Lovelace dashboard built for e-ink displays. Designed to be captured by [Lovelace Kindle Screensaver](https://github.com/joelspurr/lovelace_kindle_screensaver) and pushed to a jailbroken Kindle running OnlineScreensaver, but the card itself works on any Lovelace view.

Shows: outdoor conditions (temperature, min/max, wind, humidity, pressure), a configurable set of AC/climate rooms, a 5-day forecast, a 24h rain chart (falls back to rain probability % if the weather integration doesn't report expected mm), and a footer with Kindle battery status, the weather source, and the current date/time.

<img width="631" height="722" alt="khd-photo" align="center" src="https://github.com/user-attachments/assets/e7add70f-7d9a-474b-8d1a-59c74608b5e6" />


## Requirements

This README assumes the Kindle-side setup is already done and working:

- A jailbroken Kindle (7th gen or similar) with the Screensaver hack and [OnlineScreensaver](https://www.mobileread.com/forums/showthread.php?t=274681) installed
- [Lovelace Kindle Screensaver](https://github.com/joelspurr/lovelace_kindle_screensaver) configured on the Home Assistant side and successfully capturing screenshots

If any of that isn't in place yet, get it working with a stock dashboard first — this card assumes the capture pipeline is already reliable.

### Configuration

Unlike earlier versions of this project, entity IDs are **not** hardcoded — they live entirely in the card's own YAML config, so installing via HACS and configuring it are two separate, non-conflicting steps.

```yaml
type: custom:kindle-home-dashboard
outside:
  temperature: sensor.your_outdoor_temperature   # required
  weather: weather.your_weather_entity           # required — see note below
rooms:                                           # required, at least one
  - name: Open Space
    climate: climate.open_space
  - name: Bedroom
    climate: climate.bedroom
    temperature: sensor.bedroom_dedicated_temperature   # optional — overrides the climate's own current_temperature
  - name: Studio
    climate: climate.studio
battery:                                         # optional — omit to hide it entirely
  level: input_number.kindle_battery_level
  charging: input_boolean.kindle_battery_charging
```

| Key | Required | Notes |
|---|---|---|
| `outside.temperature` | yes | Any sensor with a numeric state |
| `outside.weather` | yes | Must be a `weather.*` entity supporting both `daily` and `hourly` forecasts (checked via the `weather.get_forecasts` action). Its current-state attributes (`humidity`, `pressure`, `wind_speed`, `wind_bearing`) are also read directly |
| `outside.sourceLabel` | no | Custom text shown in the footer as "Fonte: ...". If omitted, the entity's own `friendly_name` is used instead |
| `rooms` | yes | One card per entry. Each `climate` needs `current_temperature`, `temperature`, `fan_mode`, `fan_modes` attributes — any standard HA climate entity works. Optionally, add a `temperature` sensor per room (a separate entity ID, e.g. a dedicated room sensor) to override the climate's own `current_temperature` — useful if you'd rather trust a standalone sensor than the AC unit's reading. The layout is visually tuned for 3 rooms (equal-width columns); other counts will render but may look uneven |
| `battery` | no | Omit this whole block to hide the battery indicator. `level` is an `input_number` (0-100) and `charging` an `input_boolean` — something on your side needs to keep these updated, Lovelace Kindle Screensaver doesn't report Kindle battery status natively |

The 5-day forecast and 24h rain chart come from `outside.weather`'s forecasts (`weather.get_forecasts`, fetched every ~15 minutes and cached — matching typical weather-integration refresh intervals, so there's no point polling more often). No separate per-day or per-hour sensors are needed.

If the config is invalid (missing a required field), the card shows a standard Lovelace "Configuration error" with a message telling you which key is missing — check that before assuming something's broken.

## Installation (HACS)

1. HACS → the three dots (top right) → **Custom repositories**
2. Add this repository's URL, category **Lovelace**
3. Find "Kindle Home Dashboard" in HACS and install it
4. HACS registers the Lovelace resource automatically — no manual resource entry needed
5. Add the card to a view with the config above (see next section)

## Setting up the dashboard view

HACS only installs the card — it doesn't create a dashboard. Add a new view yourself:

**Settings → Dashboards → Add Dashboard**, or add a view via YAML:

```yaml
title: Kindle
path: kindle
panel: true
cards:
  - type: custom:kindle-home-dashboard
    outside:
      temperature: sensor.your_outdoor_temperature
      weather: weather.your_weather_entity
    rooms:
      - name: Open Space
        climate: climate.open_space
      - name: Bedroom
        climate: climate.bedroom
      - name: Studio
        climate: climate.studio
    battery:
      level: input_number.kindle_battery_level
      charging: input_boolean.kindle_battery_charging
```

`panel: true` is important — it makes the card fill the whole view edge-to-edge, matching the fixed 600×800 canvas the card renders internally.

Point Lovelace Kindle Screensaver at this view's URL (`.../kindle`).

## Versioning & updates

Releases follow [Semantic Versioning](https://semver.org/) (`MAJOR.MINOR.PATCH`) and are published as [GitHub Releases](../../releases) — that page is the changelog; there's no separate `CHANGELOG.md` to keep in sync. HACS reads those releases directly and will notify you in Home Assistant when a new one is available.

## Troubleshooting

If the card shows "Custom element doesn't exist: kindle-home-dashboard", open the dashboard in a browser, open dev tools (F12) → Console, and reload. A 404 there tells you exactly which file failed to load — that's almost always the actual problem, not the YAML config.
