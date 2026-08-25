import { getConditionIcon, getConditionLabel } from "../../utils/weather-conditions.js";

/**
 * Dashboard View Model
 *
 * {
 *   outside: {
 *     temperature: Number,
 *     icon: String,
 *     conditionLabel: String,
 *     todayHigh: Number,
 *     todayLow: Number,
 *     humidity: Number,
 *     pressure: Number,
 *     wind: { speed: Number, bearing: Number, label: String }
 *   },
 *
 *   rooms: [
 *     {
 *       name: String,
 *       temperature: Number,
 *       climate: {
 *         enabled: Boolean,
 *         mode: String,
 *         target: Number,
 *         fanMode: String,
 *         fanModes: [String]
 *       }
 *     }
 *   ],
 *
 *   forecast: [
 *     {
 *       icon: String,
 *       high: Number,
 *       low: Number
 *     }
 *   ],
 *
 *   rainGraph: {
 *     total: Number,
 *     hours: [ { hour: String, accumulation: Number } ]
 *   },
 *
 *   battery: {
 *     level: Number,
 *     charging: Boolean
 *   } | null
 * }
 *
 * `config` is the card's own YAML config (see setConfig in
 * kindle-home-dashboard.js for the expected/validated shape):
 *
 * {
 *   outside: { temperature: "sensor...", weather: "weather..." },
 *   rooms: [ { name: "...", climate: "climate..." }, ... ],
 *   battery: { level: "input_number...", charging: "input_boolean..." } | undefined
 * }
 */

const FORECAST_DAY_COUNT = 5;
const RAIN_HOUR_COUNT = 24;

export function getDashboardData(hass, forecasts, config) {

    const daily = forecasts?.daily ?? [];
    const hourly = forecasts?.hourly ?? [];

    return {

        outside:
            buildOutsideData(hass, daily, config),

        rooms:
            buildRoomsData(hass, config),

        forecast:
            buildForecastData(daily),

        rainGraph:
            buildRainGraphData(hourly),

        battery:
            buildBatteryData(hass, config),

        source:
            buildSourceLabel(hass, config)

    };

}

/**
 * Fetches daily + hourly forecasts for the outside weather entity
 * via the weather.get_forecasts action. This is a real network/WS
 * round-trip (forecasts are no longer part of the entity's state
 * as of Home Assistant 2024.4), so callers should throttle how
 * often this runs rather than calling it on every hass update.
 */
export async function fetchForecasts(hass, config) {

    const entityId = config.outside.weather;

    const [daily, hourly] = await Promise.all([

        fetchForecast(hass, entityId, "daily"),
        fetchForecast(hass, entityId, "hourly")

    ]);

    return { daily, hourly };

}

async function fetchForecast(hass, entityId, type) {

    const result = await hass.callWS({

        type: "call_service",
        domain: "weather",
        service: "get_forecasts",

        service_data: { type },

        target: { entity_id: entityId },

        return_response: true

    });

    return result?.response?.[entityId]?.forecast ?? [];

}

function buildOutsideData(hass, daily, config) {

    const weather =
        getEntity(hass, config.outside.weather);

    const windSpeed =
        toNumber(weather?.attributes.wind_speed);

    const windBearing =
        toNumber(weather?.attributes.wind_bearing);

    const condition =
        weather?.state ?? null;

    const today =
        findEntryForDayOffset(daily, 0);

    return {

        temperature:
            getNumericState(
                hass,
                config.outside.temperature
            ),

        icon:
            getConditionIcon(condition, isDaytime()),

        conditionLabel:
            getConditionLabel(condition),

        todayHigh:
            toNumber(today?.temperature),

        todayLow:
            toNumber(today?.templow),

        humidity:
            toNumber(weather?.attributes.humidity),

        pressure:
            toNumber(weather?.attributes.pressure),

        wind: {

            speed: windSpeed,
            bearing: windBearing,

            label:
                formatWind(windSpeed, windBearing)

        }

    };

}

function buildRoomsData(hass, config) {

    return config.rooms.map(room =>

        buildRoomData(hass, room)

    );

}

function buildRoomData(hass, room) {

    const climate =
        getEntity(hass, room.climate);

    const enabled =
        climate != null &&
        climate.state !== "off";

    const temperature =
        room.temperature
            ? getNumericState(hass, room.temperature)
            : toNumber(climate?.attributes.current_temperature);

    return {

        name: room.name,

        temperature,

        climate: {

            enabled,

            mode:
                climate?.state ?? "off",

            target:
                climate?.attributes.temperature ?? null,

            fanMode:
                enabled
                    ? climate?.attributes.fan_mode ?? null
                    : null,

            fanModes:
                climate?.attributes.fan_modes ?? []

        }

    };

}

function buildForecastData(daily) {

    const result = [];

    for (
        let offset = 1;
        offset <= FORECAST_DAY_COUNT;
        offset++
    ) {

        const entry =
            findEntryForDayOffset(daily, offset);

        result.push({

            icon:
                entry
                    ? getConditionIcon(entry.condition, true)
                    : null,

            high:
                toNumber(entry?.temperature),

            low:
                toNumber(entry?.templow)

        });

    }

    return result;

}

function buildRainGraphData(hourly) {

    const relevantHours =
        hourly.slice(0, RAIN_HOUR_COUNT);

    const hasPrecipitation =
        relevantHours.some(
            entry => entry?.precipitation != null
        );

    const mode =
        hasPrecipitation ? "mm" : "probability";

    const hours = [];

    let sum = 0;
    let knownCount = 0;

    for (
        let i = 0;
        i < RAIN_HOUR_COUNT;
        i++
    ) {

        const entry = hourly[i];

        const accumulation =
            hasPrecipitation
                ? toNumber(entry?.precipitation) ?? 0
                : toNumber(entry?.precipitation_probability) ?? 0;

        if (entry) {
            sum += accumulation;
            knownCount++;
        }

        hours.push({

            hour:
                entry
                    ? String(new Date(entry.datetime).getHours())
                        .padStart(2, "0")
                    : "--",

            accumulation

        });

    }

    const total =
        mode === "mm"
            ? sum
            : knownCount > 0
                ? sum / knownCount
                : 0;

    return {

        mode,

        total,

        hours

    };

}

function buildSourceLabel(hass, config) {

    const weather =
        getEntity(hass, config.outside.weather);

    return weather?.attributes.friendly_name ?? null;

}

function buildBatteryData(hass, config) {

    if (!config.battery) {

        return null;

    }

    return {

        level:
            getNumericState(
                hass,
                config.battery.level
            ),

        charging:
            getStateValue(
                hass,
                config.battery.charging
            ) === "on"

    };

}

//
// Forecast matching helpers
//

// Finds the daily-forecast entry `offset` calendar days from today
// (offset 0 = today, 1 = tomorrow, ...), matched by local calendar
// date rather than a raw array index — forecast APIs don't always
// start their array exactly at "today", so this is more robust
// than assuming a fixed index.
function findEntryForDayOffset(daily, offset) {

    const today = new Date();

    return daily.find(entry => {

        const entryDate = new Date(entry.datetime);

        return daysBetween(today, entryDate) === offset;

    });

}

function daysBetween(a, b) {

    const startOfA =
        new Date(a.getFullYear(), a.getMonth(), a.getDate());

    const startOfB =
        new Date(b.getFullYear(), b.getMonth(), b.getDate());

    return Math.round(
        (startOfB - startOfA) / 86400000
    );

}

// Simple local-time heuristic, used only to pick between the day
// and night icon for conditions that don't already encode it
// (currently just "partlycloudy").
function isDaytime() {

    const hour = new Date().getHours();

    return hour >= 7 && hour < 20;

}

//
// Formatting helpers
//

const COMPASS_POINTS = [
    "N", "NE", "E", "SE",
    "S", "SW", "W", "NW"
];

function formatWind(speed, bearing) {

    if (!Number.isFinite(speed)) {
        return "--";
    }

    const speedLabel =
        `${speed.toFixed(1)} km/h`;

    if (!Number.isFinite(bearing)) {
        return speedLabel;
    }

    const index =
        Math.round(bearing / 45) % 8;

    const direction =
        COMPASS_POINTS[(index + 8) % 8];

    return `${speedLabel} (${direction})`;

}

//
// Home Assistant helpers
//

function getStateValue(
    hass,
    entityId
) {

    return hass.states[entityId]?.state;

}

function getNumericState(
    hass,
    entityId
) {

    return toNumber(
        getStateValue(
            hass,
            entityId
        )
    );

}

function getEntity(hass, entityId) {

    return hass.states[entityId] ?? null;

}

function toNumber(value) {

    const number = Number(value);

    return Number.isFinite(number)
        ? number
        : undefined;

}
