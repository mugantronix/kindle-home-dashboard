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

    if (value >= 67) {
        return `${BASE}battery-full.svg`;
    }

    if (value >= 34) {
        return `${BASE}battery-medium.svg`;
    }

    if (value >= 11) {
        return `${BASE}battery-low.svg`;
    }

    return `${BASE}battery-empty.svg`;

}
