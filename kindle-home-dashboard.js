import { OutsideComponent } from "./components/outside.js";
import { ForecastComponent } from "./components/forecast.js";
import { RainGraphComponent } from "./components/rain-graph.js";
import { RoomsComponent } from "./components/rooms.js";
import { FooterComponent } from "./components/footer.js";

import { getDashboardData } from "./adapters/home-assistant/adapter.js";
import { assetUrl } from "./utils/paths.js";

class KindleHomeDashboard extends HTMLElement {

    constructor() {

        super();

        this.attachShadow({ mode: "open" });

        this._config = null;
        this._hass = null;

        this.outside = null;
        this.rooms = null;
        this.forecast = null;
        this.rainGraph = null;
        this.footer = null;

    }

    setConfig(config) {

        this._config = config;

    }

    connectedCallback() {

        this.outside = new OutsideComponent();

        this.rooms = new RoomsComponent();

        this.forecast = new ForecastComponent();

        this.rainGraph = new RainGraphComponent();

        this.footer = new FooterComponent();

        this._render();

    }

    set hass(hass) {

        this._hass = hass;

        if (!this.outside) {
            return;
        }

        const dashboardData = getDashboardData(hass);

        this.outside.update(
            dashboardData.outside
        );

        this.rooms.update(
            dashboardData.rooms
        );

        this.forecast.update(
            dashboardData.forecast
        );

        this.rainGraph.update(
            dashboardData.rainGraph
        );

        this.footer.update(
            dashboardData.battery
        );

    }

    _render() {

        this.shadowRoot.innerHTML = `
            <link
                rel="stylesheet"
                href="${assetUrl("theme.css")}"
            >

            <div class="dashboard"></div>
        `;

        const dashboard =
            this.shadowRoot.querySelector(".dashboard");

        dashboard.append(
            this.outside.render(),
            this.rooms.render(),
            this.forecast.render(),
            this.rainGraph.render(),
            this.footer.render()
        );

    }
}

customElements.define(
    "kindle-home-dashboard",
    KindleHomeDashboard
);
