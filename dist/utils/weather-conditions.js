import { assetUrl } from "./paths.js";

const BASE = assetUrl("assets/icons/");

// Icon filenames, keyed by Home Assistant's standard weather
// condition strings (see https://www.home-assistant.io/integrations/weather/#condition-mapping).
// "partlycloudy" is the only one needing a day/night split of its
// own — sunny/clear-night already encode day/night in the state
// itself.
const ICONS = {

    sunny: "clear-day.svg",
    "clear-night": "clear-night.svg",

    partlycloudy_day: "partly-cloudy-day.svg",
    partlycloudy_night: "partly-cloudy-night.svg",

    cloudy: "cloudy.svg",

    fog: "fog.svg",

    windy: "wind.svg",
    "windy-variant": "wind.svg",

    rainy: "rain.svg",
    pouring: "rain.svg",

    snowy: "snow.svg",
    "snowy-rainy": "sleet.svg",

    hail: "hail.svg",

    lightning: "thunderstorm.svg",
    "lightning-rainy": "thunderstorm.svg"

};

const LABELS_IT = {

    sunny: "Sereno",
    "clear-night": "Sereno",

    partlycloudy: "Poco nuvoloso",

    cloudy: "Nuvoloso",

    fog: "Nebbia",

    windy: "Ventoso",
    "windy-variant": "Ventoso",

    rainy: "Pioggia",
    pouring: "Pioggia intensa",

    snowy: "Neve",
    "snowy-rainy": "Neve e pioggia",

    hail: "Grandine",

    lightning: "Temporale",
    "lightning-rainy": "Temporale",

    exceptional: "Condizioni eccezionali"

};

export function getConditionIcon(condition, isDay = true) {

    if (condition === "partlycloudy") {

        return `${BASE}${isDay ? ICONS.partlycloudy_day : ICONS.partlycloudy_night}`;

    }

    const filename = ICONS[condition];

    if (!filename) {

        console.warn(`Unknown weather condition: ${condition}`);

        return `${BASE}cloudy.svg`;

    }

    return `${BASE}${filename}`;

}

export function getConditionLabel(condition) {

    return LABELS_IT[condition] ?? "--";

}
