/**
 * Maps a climate `fan_mode` to a bar level (1-4), relative to the
 * device's own `fan_modes` list (order-based, so it works whether
 * the list uses numeric speeds like "1".."5" or named speeds like
 * "low", "low-medium", "medium", "high", "full").
 *
 * Returns `null` when the fan mode should be shown as "AUTO" text
 * instead of bars: this covers the literal "auto" mode, and any
 * value not found in the declared `fan_modes` list (some
 * integrations report sentinel values, e.g. "255", for auto/unset).
 */

export const FAN_BAR_COUNT = 5;

export function getFanLevel(fanMode, fanModes = []) {

    if (fanMode == null) {
        return null;
    }

    const key = String(fanMode)
        .trim()
        .toLowerCase();

    if (key === "auto") {
        return null;
    }

    const speeds = (fanModes || [])
        .map(mode => String(mode).trim().toLowerCase())
        .filter(mode => mode !== "auto");

    const index = speeds.indexOf(key);

    if (index === -1) {
        // Unrecognized / sentinel value (e.g. "255") -> treat as auto
        return null;
    }

    const level = index + 1;
    const max = speeds.length;

    const proportion = level / max;

    return Math.max(
        1,
        Math.min(
            FAN_BAR_COUNT,
            Math.round(proportion * FAN_BAR_COUNT)
        )
    );

}
