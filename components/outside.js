import { getWeatherIcon, getWeatherLabel } from "../utils/weather-icons.js";

const ICON_BASE =
    "/local/kindle-home-dashboard/assets/icons/";

export class OutsideComponent {

    constructor() {

        this.element = document.createElement("div");
        this.element.className = "outside";

        //
        // Left: weather icon (35% of the panel width)
        //

        this.iconWrapper = document.createElement("div");
        this.iconWrapper.className = "outside-icon-wrapper";

        this.iconElement = document.createElement("img");
        this.iconElement.className = "outside-icon";

        this.iconWrapper.append(this.iconElement);

        //
        // Center: condition label, current temperature, today's min/max
        //

        this.centerElement = document.createElement("div");
        this.centerElement.className = "outside-center";

        this.titleElement = document.createElement("div");
        this.titleElement.className = "outside-title";

        this.temperatureElement = document.createElement("span");
        this.temperatureElement.className = "outside-temperature";

        this.minMaxElement = document.createElement("div");
        this.minMaxElement.className = "outside-minmax";

        this.centerElement.append(
            this.titleElement,
            this.temperatureElement,
            this.minMaxElement
        );

        //
        // Right: wind, humidity, pressure
        //

        this.detailsElement = document.createElement("div");
        this.detailsElement.className = "outside-details";

        this.windDetail = this.createDetail(
            "outside-wind",
            `${ICON_BASE}weather-windy.svg`
        );

        this.humidityDetail = this.createDetail(
            "outside-humidity",
            `${ICON_BASE}water-percent.svg`
        );

        this.pressureDetail = this.createDetail(
            "outside-pressure",
            `${ICON_BASE}gauge.svg`
        );

        this.detailsElement.append(
            this.windDetail.element,
            this.humidityDetail.element,
            this.pressureDetail.element
        );

        this.element.append(
            this.iconWrapper,
            this.centerElement,
            this.detailsElement
        );

        this.update();

    }

    createDetail(className, iconSrc) {

        const element = document.createElement("div");
        element.className = `outside-detail ${className}`;

        const icon = document.createElement("img");
        icon.className = "outside-detail-icon";
        icon.src = iconSrc;

        const value = document.createElement("span");
        value.className = "outside-detail-value";

        element.append(icon, value);

        return { element, value };

    }

    render() {

        return this.element;

    }

    update(data = {}) {

        const temperature =
            Number(data.temperature);

        this.temperatureElement.textContent =
            Number.isFinite(temperature)
                ? `${temperature.toFixed(1)}°`
                : "--.-°";

        if (data.icon != null) {

            this.iconElement.src =
                getWeatherIcon(data.icon);

            this.titleElement.textContent =
                getWeatherLabel(data.icon);

        }

        this.minMaxElement.textContent =
            this.formatMinMax(
                data.todayHigh,
                data.todayLow
            );

        this.windDetail.value.textContent =
            data.wind?.label ?? "--";

        this.humidityDetail.value.textContent =
            Number.isFinite(data.humidity)
                ? `${Math.round(data.humidity)}%`
                : "--";

        this.pressureDetail.value.textContent =
            Number.isFinite(data.pressure)
                ? `${Math.round(data.pressure)} hPa`
                : "--";

    }

    formatMinMax(high, low) {

        const highLabel =
            Number.isFinite(high)
                ? `${high.toFixed(0)}°`
                : "--°";

        const lowLabel =
            Number.isFinite(low)
                ? `${low.toFixed(0)}°`
                : "--°";

        return `${highLabel} / ${lowLabel}`;

    }

}
