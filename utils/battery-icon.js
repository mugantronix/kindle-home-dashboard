import { assetUrl } from "./paths.js";

const BASE = assetUrl("assets/icons/");

export function getBatteryIcon(level, charging) {

    if (charging) {
        return `${BASE}battery-charging.svg`;
    }

    const value = Number(level);

    if (!Number.isFinite(value)) {
        return `${BASE}battery-empty.svg`;
    }

    if (value >= 75) {
        return `${BASE}battery-full.svg`;
    }

    if (value >= 50) {
        return `${BASE}battery-medium.svg`;
    }

    if (value >= 25) {
        return `${BASE}battery-low.svg`;
    }

    return `${BASE}battery-empty.svg`;

}
