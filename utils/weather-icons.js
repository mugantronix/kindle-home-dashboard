import { assetUrl } from "./paths.js";

const BASE = assetUrl("assets/icons/");

const ICONS = {

    "clear-day": `${BASE}clear-day.svg`,
    "clear-night": `${BASE}clear-night.svg`,

    "partly-cloudy-day": `${BASE}partly-cloudy-day.svg`,
    "partly-cloudy-night": `${BASE}partly-cloudy-night.svg`,

    "cloudy": `${BASE}cloudy.svg`,

    "rain": `${BASE}rain.svg`,

    "snow": `${BASE}snow.svg`,

    "sleet": `${BASE}sleet.svg`,

    "hail": `${BASE}hail.svg`,

    "fog": `${BASE}fog.svg`,

    "wind": `${BASE}wind.svg`,

    "thunderstorm": `${BASE}thunderstorm.svg`

};

export function getWeatherIcon(name) {

    if (name == null || name === "") {

        return `${BASE}clear-day.svg`;

    }

    const icon = ICONS[name];

    if (!icon) {

        console.warn(`Unknown weather icon: ${name}`);

        return `${BASE}clear-day.svg`;

    }

    return icon;

}

const LABELS_IT = {

    "clear-day": "Sereno",
    "clear-night": "Sereno",

    "partly-cloudy-day": "Poco nuvoloso",
    "partly-cloudy-night": "Poco nuvoloso",

    "cloudy": "Nuvoloso",

    "rain": "Pioggia",

    "snow": "Neve",

    "sleet": "Nevischio",

    "hail": "Grandine",

    "fog": "Nebbia",

    "wind": "Ventoso",

    "thunderstorm": "Temporale"

};

export function getWeatherLabel(name) {

    return LABELS_IT[name] ?? "--";

}