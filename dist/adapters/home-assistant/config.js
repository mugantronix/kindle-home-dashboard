export const ENTITIES = {

    outside: {

        temperature: "sensor.open_space_a_c_open_space_outside_temperature",
        icon: "sensor.kindle_weather_forecast_icon",

        // Today's high/low reuse the same forecast sensor family as
        // the 5-day forecast, at index 0 (today).
        todayBase: "sensor.kindle_weather_forecast_day0_",

        weather: "weather.pirateweather"

    },

    rooms: [

        {
            name: "Open Space",
            climate: "climate.open_space_a_c_open_space"
        },

        {
            name: "Camera",
            climate: "climate.camera_da_letto_a_c_camera"
        },

        {
            name: "Studio",
            climate: "climate.studio_a_c_studio"
        }

    ],

    forecast: {

        days: 5,

        base:
            "sensor.kindle_weather_forecast_day{day}_"

    },

    rain: {

        hours: 24,

        base:
            "sensor.kindle_weather_rain_hour{hour}"

    },

    battery: {

        level: "input_number.kindle_battery_level",
        charging: "input_boolean.kindle_battery_charging"

    }

};
