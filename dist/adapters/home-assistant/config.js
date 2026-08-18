export const ENTITIES = {

    outside: {

        temperature: "sensor.open_space_a_c_open_space_outside_temperature",

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

    battery: {

        level: "input_number.kindle_battery_level",
        charging: "input_boolean.kindle_battery_charging"

    }

};
