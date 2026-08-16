const BASE =
    "/local/kindle-home-dashboard/assets/icons/";

const ICONS = {

    cool:
        `${BASE}cool.svg`,

    heat:
        `${BASE}heat.svg`,

    dry:
        `${BASE}dry.svg`,

    fan_only:
        `${BASE}fan_only.svg`,

    heat_cool:
        `${BASE}heat_cool.svg`,

    // No dedicated "auto" asset is provided; heat_cool is the
    // closest semantic match (automatic heat/cool selection).
    auto:
        `${BASE}heat_cool.svg`,

    off:
        `${BASE}off.svg`

};

export function getHvacIcon(mode) {

    const icon = ICONS[mode];

    if (!icon) {

        console.warn(
            `Unknown AC mode: ${mode}`
        );

        return ICONS.off;

    }

    return icon;

}