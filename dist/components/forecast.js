import { assetUrl } from "../utils/paths.js";

const FORECAST_DAY_COUNT = 5;

export class ForecastComponent {

    constructor() {

        this.dayElements = [];

        this.element = document.createElement("div");
        this.element.className = "forecast";

        for (let i = 0; i < FORECAST_DAY_COUNT; i++) {

            const day = document.createElement("div");
            day.className = "forecast-day";

            const labelElement = document.createElement("div");
            labelElement.className = "forecast-day-label";

            const dateElement = document.createElement("div");
            dateElement.className = "forecast-day-date";

            const iconElement = document.createElement("img");
            iconElement.className = "forecast-day-icon";

            const highElement = document.createElement("div");
            highElement.className = "forecast-day-high";

            const dividerElement = document.createElement("div");
            dividerElement.className = "forecast-day-divider";

            const lowElement = document.createElement("div");
            lowElement.className = "forecast-day-low";

            day.append(
                labelElement,
                dateElement,
                iconElement,
                highElement,
                dividerElement,
                lowElement
            );

            this.element.append(day);

            this.dayElements.push({

                labelElement,
                dateElement,
                iconElement,
                highElement,
                lowElement

            });

        }

        this.update();

    }

    render() {

        return this.element;

    }

    update(data = []) {

        for (let i = 0; i < FORECAST_DAY_COUNT; i++) {

            const forecast =
                data[i] ?? {};

            const elements =
                this.dayElements[i];

            const date = new Date();
            date.setDate(date.getDate() + i + 1);

            elements.labelElement.textContent =
                this.getDayLabel(date);

            elements.dateElement.textContent =
                this.getDateLabel(date);

            elements.iconElement.src =
                forecast.icon ?? assetUrl("assets/icons/cloudy.svg");

            const high =
                Number(forecast.high);

            const low =
                Number(forecast.low);

            elements.highElement.innerHTML = "";
            elements.highElement.append(
                this.buildTemperatureNode(high)
            );

            elements.lowElement.innerHTML = "";
            elements.lowElement.append(
                this.buildTemperatureNode(low)
            );

        }

    }

    buildTemperatureNode(value) {

        const wrapper = document.createElement("span");

        const spacer = document.createElement("span");
        spacer.className = "degree-spacer";
        spacer.setAttribute("aria-hidden", "true");
        spacer.textContent = "°";

        const digits = document.createElement("span");
        digits.textContent =
            Number.isFinite(value)
                ? value.toFixed(0)
                : "--";

        const degree = document.createElement("span");
        degree.textContent = "°";

        wrapper.append(spacer, digits, degree);

        return wrapper;

    }

    getDayLabel(date) {

        const label = date.toLocaleDateString(
            "it-IT",
            {
                weekday: "short"
            }
        );

        return label
            .replace(".", "")
            .replace(/^./, c => c.toUpperCase());

    }

    getDateLabel(date) {

        const day =
            String(date.getDate()).padStart(2, "0");

        const month = date.toLocaleDateString(
            "it-IT",
            {
                month: "short"
            }
        ).replace(".", "");

        return `${day} ${month}`;

    }

}
