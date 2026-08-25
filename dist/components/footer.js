import { getBatteryIcon } from "../utils/battery-icon.js";

export class FooterComponent {

    constructor() {

        this.element = document.createElement("div");
        this.element.className = "footer";

        this.batteryStatusElement = document.createElement("span");
        this.batteryStatusElement.className = "footer-battery-status";

        this.batteryIcon = document.createElement("img");
        this.batteryIcon.className = "footer-battery-icon";

        this.batteryGroup = document.createElement("div");
        this.batteryGroup.className = "footer-battery-group";

        this.batteryGroup.append(
            this.batteryStatusElement,
            this.batteryIcon
        );

        this.sourceElement = document.createElement("span");
        this.sourceElement.className = "footer-source";

        this.dateTimeElement = document.createElement("div");
        this.dateTimeElement.className = "footer-datetime";

        this.dateElement = document.createElement("span");
        this.dateElement.className = "footer-date";

        this.timeElement = document.createElement("span");
        this.timeElement.className = "footer-time";

        this.dateTimeElement.append(
            this.dateElement,
            this.timeElement
        );

        this.element.append(
            this.batteryGroup,
            this.sourceElement,
            this.dateTimeElement
        );

        this.update();

    }

    render() {

        return this.element;

    }

    update(battery, source) {

        if (!battery) {

            this.batteryGroup.classList.add("hidden");

        } else {

            this.batteryGroup.classList.remove("hidden");

            this.batteryIcon.src =
                getBatteryIcon(
                    battery.level,
                    battery.charging
                );

            const level = Number(battery.level);

            this.batteryStatusElement.textContent =
                battery.charging && Number.isFinite(level) && level >= 100
                    ? "Batteria Carica"
                    : Number.isFinite(level)
                        ? `${Math.round(level)}%`
                        : "";

        }

        this.sourceElement.textContent =
            source
                ? `Fonte: ${source}`
                : "";

        const now = new Date();

        this.dateElement.textContent =
            now.toLocaleDateString(
                "it-IT",
                {
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                }
            );

        this.timeElement.textContent =
            now.toLocaleTimeString(
                "it-IT",
                {
                    hour: "2-digit",
                    minute: "2-digit"
                }
            );

    }

}
