# Weather-Dashboard

## Description

This project presents an interactive weather dashboard designed to run in web browsers, leveraging dynamically updated HTML and CSS. Utilizing the [OpenWeather APIs](https://openweathermap.org/), this application fetches and displays current weather conditions and a five-day forecast for cities.

The sequence of operations to retrieve data is as follows:

1. **Geocoding API Query:** The application gets a city name from the input form, initiating a query to the [Geocoding API Query](https://openweathermap.org/api/geocoding-api). This step retrieves the coordinates of the specified city.

2. **Current Weather Data Retrieval:** With the obtained coordinates, the application queries the [Current weather data API](https://openweathermap.org/current) to fetch real-time weather information for the city. This includes temperature, humidity, wind speed, and an associated [Weather icons](https://openweathermap.org/weather-conditions#Weather-Condition-Codes-2) sourced from Weather icons.

3. **Five-Day Weather Forecast Query:** The application queries the [5 day weather forecast API](https://openweathermap.org/forecast5), using the city coordinates to gather a five-day weather forecast. It assigns appropriate weather icons to each day as well.

In an effort to expedite information retrieval, the application stores the coordinates and names of the last six queried cities. This caching mechanism ensures that subsequent queries for these cities bypass the initial coordinate retrieval step, optimizing data display speed.

### How It Works?

Users can simply input a city name via the provided form and, upon clicking the search button, access the current and upcoming five days' weather data for the specified location. The displayed information encompasses the city name, date, weather icon, temperature, humidity, and wind speed.

Additionally, the application maintains a search history section, showcasing the last six queried cities. By selecting a city from this history, users can swiftly access the associated weather information without re-entering the city name, improving the overall user experience.

## Installation

N/A

## Credits

The following resources were used.

* [OpenWeather](https://openweathermap.org/)
* [Weather icons](https://openweathermap.org/weather-conditions#Weather-Condition-Codes-2)
* https://getbootstrap.com/
* https://day.js.org/
* https://api.jquery.com/
* https://www.w3schools.com/
* https://stackoverflow.com/

## License

Please see the [License](./LICENSE).