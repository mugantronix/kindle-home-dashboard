import { assetUrl } from "../utils/paths.js";

const HOURS = 24;
const Y_AXIS_STEPS = 4;
const LABEL_EVERY = 2;

const MODE_MM = "mm";
const MODE_PROBABILITY = "probability";

export class RainGraphComponent {

    constructor() {

        this.root = document.createElement("section");
        this.root.className = "rain-graph";

        //
        // Header
        //

        this.header = document.createElement("div");
        this.header.className = "rain-graph-header";

        this.titleElement = document.createElement("div");
        this.titleElement.className = "rain-graph-title";

        this.header.append(this.titleElement);

        //
        // Body: chart (left) + side panel (right)
        //

        this.body = document.createElement("div");
        this.body.className = "rain-graph-body";

        //
        // Y axis (5 fixed positions; the values shown depend on
        // the mode — mm or probability %)
        //

        this.yAxis = document.createElement("div");
        this.yAxis.className = "rain-graph-y-axis";

        this.yAxisLabels = [];

        for (let i = 0; i <= Y_AXIS_STEPS; i++) {

            const label = document.createElement("div");
            label.className = "rain-graph-y-label";

            this.yAxis.appendChild(label);
            this.yAxisLabels.push(label);

        }

        //
        // Chart (grid lines + bars + x labels)
        //

        this.chartWrapper = document.createElement("div");
        this.chartWrapper.className = "rain-graph-chart-wrapper";

        this.gridLines = document.createElement("div");
        this.gridLines.className = "rain-graph-grid";

        for (let i = 0; i <= Y_AXIS_STEPS; i++) {

            const line = document.createElement("div");
            line.className = "rain-graph-grid-line";
            this.gridLines.appendChild(line);

        }

        this.chartElement = document.createElement("div");
        this.chartElement.className = "rain-graph-chart";

        this.barElements = [];
        this.labelElements = [];
        this.lastLabels = [];

        for (let i = 0; i < HOURS; i++) {

            const column = document.createElement("div");
            column.className = "rain-graph-column";

            const barContainer = document.createElement("div");
            barContainer.className = "rain-graph-bar-container";

            const bar = document.createElement("div");
            bar.className = "rain-graph-bar";

            barContainer.append(bar);

            const label = document.createElement("div");
            label.className = "rain-graph-label";

            if (i % LABEL_EVERY !== 0) {
                label.classList.add("hidden");
            }

            column.append(
                barContainer,
                label
            );

            this.chartElement.append(column);

            this.barElements.push(bar);
            this.labelElements.push(label);

        }

        this.chartWrapper.append(
            this.gridLines,
            this.chartElement
        );

        //
        // Side panel
        //

        this.side = document.createElement("div");
        this.side.className = "rain-graph-side";

        this.sideIcon = document.createElement("img");
        this.sideIcon.className = "rain-graph-side-icon";
        this.sideIcon.src = assetUrl("assets/icons/rain.svg");

        this.sideLabel = document.createElement("div");
        this.sideLabel.className = "rain-graph-side-label";

        this.totalElement = document.createElement("div");
        this.totalElement.className = "rain-graph-total";

        this.side.append(
            this.sideIcon,
            this.sideLabel,
            this.totalElement
        );

        this.body.append(
            this.yAxis,
            this.chartWrapper,
            this.side
        );

        this.root.append(
            this.header,
            this.body
        );

    }

    render() {

        return this.root;

    }

    update(data) {

        const mode =
            data.mode === MODE_PROBABILITY
                ? MODE_PROBABILITY
                : MODE_MM;

        this.updateHeader(mode);

        this.updateYAxis(mode);

        this.updateTotal(
            data.total,
            mode
        );

        this.updateBars(
            data.hours,
            mode
        );

        this.updateLabels(
            data.hours
        );

    }

    updateHeader(mode) {

        this.titleElement.textContent =
            mode === MODE_PROBABILITY
                ? "Probabilità pioggia prossime 24 ore"
                : "Pioggia prossime 24 ore";

        this.sideLabel.textContent =
            mode === MODE_PROBABILITY
                ? "Probabilità 24h"
                : "Totale 24h";

    }

    updateYAxis(mode) {

        const max =
            mode === MODE_PROBABILITY
                ? 100
                : 4;

        this.yAxisLabels.forEach((label, index) => {

            const value =
                max - (max / Y_AXIS_STEPS) * index;

            label.textContent = String(Math.round(value));

        });

    }

    updateTotal(total, mode) {

        this.totalElement.textContent =
            mode === MODE_PROBABILITY
                ? this.formatPercentage(total)
                : this.formatMm(total);

    }

    updateBars(hours, mode) {

        const max =
            mode === MODE_PROBABILITY
                ? 100
                : Math.max(
                    ...hours.map(h => h.accumulation),
                    4
                );

        hours.forEach((hour, index) => {

            const percentage =
                max === 0
                    ? 0
                    : (hour.accumulation / max) * 100;

            this.barElements[index].style.height =
                `${percentage.toFixed(1)}%`;
        });

    }

    updateLabels(hours) {

        hours.forEach((hour, index) => {

            if (this.lastLabels[index] !== hour.hour) {

                this.labelElements[index].textContent =
                    hour.hour;

                this.lastLabels[index] =
                    hour.hour;

            }

        });

    }

    formatMm(value) {

        return `${value.toFixed(1)} mm`;

    }

    formatPercentage(value) {

        return `${Math.round(value)}%`;

    }

}
