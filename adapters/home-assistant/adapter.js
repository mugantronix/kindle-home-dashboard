import { ENTITIES } from "./config.js";

/**
 * Dashboard View Model
 *
 * {
 *   outside: {
 *     temperature: Number,
 *     icon: String,
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
 *   }
 * }
 */

export function getDashboardData(hass) {

    return {

        outside:
            buildOutsideData(hass),

        rooms:
            buildRoomsData(hass),

        forecast:
            buildForecastData(hass),

        rainGraph:
            buildRainGraphData(hass),

        battery:
            buildBatteryData(hass)

    };

}

function buildOutsideData(hass) {

    const weather =
        getEntity(hass, ENTITIES.outside.weather);

    const windSpeed =
        toNumber(weather?.attributes.wind_speed);

    const windBearing =
        toNumber(weather?.attributes.wind_bearing);

    return {

        temperature:
            getNumericState(
                hass,
                ENTITIES.outside.temperature
            ),

        icon:
            getStateValue(
                hass,
                ENTITIES.outside.icon
            ) ?? "",

        todayHigh:
            getNumericState(
                hass,
                `${ENTITIES.outside.todayBase}high`
            ),

        todayLow:
            getNumericState(
                hass,
                `${ENTITIES.outside.todayBase}low`
            ),

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

function buildRoomsData(hass) {

    return ENTITIES.rooms.map(room =>

        buildRoomData(hass, room)

    );

}

function buildRoomData(hass, room) {

    const climate =
        getEntity(hass, room.climate);

    const enabled =
        climate != null &&
        climate.state !== "off";

    return {

        name: room.name,

        temperature:
            toNumber(climate?.attributes.current_temperature),

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

function buildForecastData(hass) {

    const result = [];

    for (
        let day = 1;
        day <= ENTITIES.forecast.days;
        day++
    ) {

        const base =
            ENTITIES.forecast.base.replace(
                "{day}",
                day
            );

        result.push({

            icon:
                getStateValue(
                    hass,
                    `${base}icon`
                ) ?? "",

            high:
                getNumericState(
                    hass,
                    `${base}high`
                ),

            low:
                getNumericState(
                    hass,
                    `${base}low`
                )

        });

    }

    return result;

}

function buildRainGraphData(hass) {

    const hours = [];

    let total = 0;

    const currentHour =
        new Date().getHours();

    for (
        let offset = 0;
        offset < ENTITIES.rain.hours;
        offset++
    ) {

        const entityId =
            ENTITIES.rain.base.replace(
                "{hour}",
                String(offset + 1).padStart(2, "0")
            );

        const accumulation =
            getNumericState(
                hass,
                entityId
            ) ?? 0;

        total += accumulation;

        hours.push({

            hour:
                String(
                    (currentHour + offset + 1) % 24
                ).padStart(2, "0"),

            accumulation

        });

    }

    return {

        total,

        hours

    };

}

function buildBatteryData(hass) {

    return {

        level:
            getNumericState(
                hass,
                ENTITIES.battery.level
            ),

        charging:
            getStateValue(
                hass,
                ENTITIES.battery.charging
            ) === "on"

    };

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

function getState(
    hass,
    entityId
) {

    return hass.states[entityId];

}

function getStateValue(
    hass,
    entityId
) {

    return getState(
        hass,
        entityId
    )?.state;

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
