import { getHvacIcon } from "../utils/hvac-icons.js";
import { getFanLevel, FAN_BAR_COUNT } from "../utils/fan-level.js";

export class RoomsComponent {

    constructor(roomCount = 3) {

        this.element = document.createElement("div");
        this.element.className = "rooms";

        this.roomElements = [];

        for (let i = 0; i < roomCount; i++) {

            const roomElement = document.createElement("div");
            roomElement.className = "room";

            const nameElement = document.createElement("div");
            nameElement.className = "room-name";

            const badgeElement = document.createElement("span");
            badgeElement.className = "room-badge hidden";
            badgeElement.textContent = "ON";

            const temperatureElement = document.createElement("div");
            temperatureElement.className = "room-temperature";

            const footerElement = document.createElement("div");
            footerElement.className = "room-footer";

            const iconElement = document.createElement("img");
            iconElement.className = "room-footer-icon";

            const middleElement = document.createElement("div");
            middleElement.className = "room-footer-middle";

            const barsElement = document.createElement("div");
            barsElement.className = "room-bars";

            const barElements = [];

            for (let b = 0; b < FAN_BAR_COUNT; b++) {

                const bar = document.createElement("span");
                bar.className = "room-bar";
                barsElement.appendChild(bar);
                barElements.push(bar);

            }

            const fanTextElement = document.createElement("span");
            fanTextElement.className = "room-fan-text";

            middleElement.append(
                barsElement,
                fanTextElement
            );

            const targetElement = document.createElement("span");
            targetElement.className = "room-target";

            footerElement.append(
                iconElement,
                middleElement,
                targetElement
            );

            roomElement.append(
                nameElement,
                badgeElement,
                temperatureElement,
                footerElement
            );

            this.element.appendChild(roomElement);

            this.roomElements.push({

                roomElement,

                nameElement,
                badgeElement,
                temperatureElement,

                iconElement,
                barsElement,
                barElements,
                fanTextElement,
                targetElement

            });

        }

        this.update();

    }

    render() {

        return this.element;

    }

    update(data = []) {

        for (let i = 0; i < this.roomElements.length; i++) {

            const room = data[i] ?? {};

            const {

                roomElement,

                nameElement,
                badgeElement,
                temperatureElement,

                iconElement,
                barsElement,
                barElements,
                fanTextElement,
                targetElement

            } = this.roomElements[i];

            nameElement.textContent =
                room.name ?? "";

            const temperature =
                Number(room.temperature);

            temperatureElement.textContent =
                Number.isFinite(temperature)
                    ? `${temperature.toFixed(1)}°`
                    : "--.-°";

            const climate =
                room.climate ?? {};

            const enabled =
                climate.enabled === true;

            roomElement.classList.toggle("on", enabled);
            roomElement.classList.toggle("off", !enabled);

            badgeElement.classList.toggle("hidden", !enabled);

            if (enabled) {

                iconElement.src =
                    getHvacIcon(climate.mode);

                const level =
                    getFanLevel(
                        climate.fanMode,
                        climate.fanModes
                    );

                if (level != null) {

                    barsElement.classList.remove("hidden");
                    fanTextElement.classList.add("hidden");

                    barElements.forEach((bar, index) => {

                        bar.classList.toggle(
                            "filled",
                            index < level
                        );

                    });

                } else {

                    barsElement.classList.add("hidden");
                    fanTextElement.classList.remove("hidden");

                    fanTextElement.textContent = "AUTO";

                }

                targetElement.textContent =
                    climate.target != null
                        ? `${climate.target}°`
                        : "";

            } else {

                iconElement.src =
                    getHvacIcon("off");

                barsElement.classList.add("hidden");
                fanTextElement.classList.add("hidden");
                fanTextElement.textContent = "";

                targetElement.textContent = "";

            }

        }

    }

}
