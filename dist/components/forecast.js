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

            const tempsElement = document.createElement("div");
            tempsElement.className = "forecast-day-temps";

            const highElement = document.createElement("span");
            highElement.className = "forecast-day-high";

            const sepElement = document.createElement("span");
            sepElement.className = "forecast-day-sep";
            sepElement.textContent = "/";

            const lowElement = document.createElement("span");
            lowElement.className = "forecast-day-low";

            tempsElement.append(
                highElement,
                sepElement,
                lowElement
            );

            day.append(
                labelElement,
                dateElement,
                iconElement,
                tempsElement
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

            elements.highElement.textContent =
                Number.isFinite(high)
                    ? `${high.toFixed(0)}°`
                    : "--°";

            elements.lowElement.textContent =
                Number.isFinite(low)
                    ? `${low.toFixed(0)}°`
                    : "--°";

        }

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
