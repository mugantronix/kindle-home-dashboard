import { OutsideComponent } from "./components/outside.js";
import { ForecastComponent } from "./components/forecast.js";
import { RainGraphComponent } from "./components/rain-graph.js";
import { RoomsComponent } from "./components/rooms.js";
import { FooterComponent } from "./components/footer.js";

import { getDashboardData, fetchForecasts } from "./adapters/home-assistant/adapter.js";
import { assetUrl } from "./utils/paths.js";

// PirateWeather itself only refreshes every 900s server-side, so
// there's no point re-fetching forecasts (a real WS round-trip)
// more often than that.
const FORECAST_REFRESH_MS = 15 * 60 * 1000;

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

        this._forecasts = { daily: [], hourly: [] };
        this._forecastsFetchedAt = 0;
        this._fetchingForecasts = false;

    }

    setConfig(config) {

        if (!config || !Array.isArray(config.rooms) || config.rooms.length === 0) {

            throw new Error(
                "kindle-home-dashboard: 'rooms' is required in the card config (a list of at least one { name, climate })."
            );

        }

        for (const room of config.rooms) {

            if (!room.name || !room.climate) {

                throw new Error(
                    "kindle-home-dashboard: every entry in 'rooms' needs both 'name' and 'climate'."
                );

            }

        }

        if (!config.outside?.weather) {

            throw new Error(
                "kindle-home-dashboard: 'outside.weather' is required in the card config (a weather.* entity)."
            );

        }

        if (!config.outside?.temperature) {

            throw new Error(
                "kindle-home-dashboard: 'outside.temperature' is required in the card config."
            );

        }

        if (
            config.battery &&
            (!config.battery.level || !config.battery.charging)
        ) {

            throw new Error(
                "kindle-home-dashboard: 'battery', if present, needs both 'level' and 'charging'. Omit 'battery' entirely to hide it."
            );

        }

        this._config = config;

    }

    connectedCallback() {

        this.outside = new OutsideComponent();

        this.rooms = new RoomsComponent(this._config.rooms.length);

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

        this._updateComponents(hass);

        this._maybeRefreshForecasts(hass);

    }

    _updateComponents(hass) {

        const dashboardData =
            getDashboardData(hass, this._forecasts, this._config);

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
            dashboardData.battery,
            dashboardData.source
        );

    }

    async _maybeRefreshForecasts(hass) {

        const now = Date.now();

        const isStale =
            now - this._forecastsFetchedAt > FORECAST_REFRESH_MS;

        if (this._fetchingForecasts || !isStale) {
            return;
        }

        this._fetchingForecasts = true;

        try {

            this._forecasts = await fetchForecasts(hass, this._config);
            this._forecastsFetchedAt = Date.now();

            this._updateComponents(this._hass);

        } catch (error) {

            // Fail soft: keep showing whatever forecast data we
            // already had (possibly none, on first load) rather
            // than breaking the whole dashboard over a weather
            // API hiccup.
            console.warn(
                "kindle-home-dashboard: forecast fetch failed",
                error
            );

        } finally {

            this._fetchingForecasts = false;

        }

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
