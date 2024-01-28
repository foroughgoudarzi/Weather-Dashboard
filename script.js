$("document").ready(function () {
    var apiKey = "ffe2c4b50bca7de701389fcca1ad8a3a";
    var city;          // The name of current queried city
    var cities = [6];  //The name and coordinates of the last six cities
    var latitude;      // The latitude of current queried city
    var longtitude;    // The longtitude of current queried city
    var iconSource = "https://openweathermap.org/img/wn/01n@2x.png";

    // ************ HTML elements *********************
    // **** Today info section
    var todayHeader = $("<h2>");
    $("#today").append(todayHeader);
    $("#today").append("<p id='temp'></p>");
    $("#today").append("<p id='wind'></p>");
    $("#today").append("<p id='humidity'></p>");

    // **** Forcast section
    $("#forecast").append("<h3 id='fivedayheader'></h3>");
    $("#forecast").append("<div class='d-flex flx-row justify-content-between flex-wrap fivedays'></div>");
    
    // Adds elements for five days forcast
    for (let i = 0; i < 5; i++) {
        $(".fivedays").append("<div class='dayforecast p-2 mb-2'></div>");
        $(".dayforecast:last").append("<h4 class='date'></h4>");
        $(".dayforecast:last").append("<p class='temp'></p>");
        $(".dayforecast:last").append("<p class='wind'></p>");
        $(".dayforecast:last").append("<p class='humidity'></p>");
    }

    // **** History section
    // Adds six buttons
    for (let i = 0; i < 6; i++) {
        $("#history").append("<button class='d-none logBtn text-dark rounded-1'></button>");
    }
    // ****************************************************

    // Loads History
    let weatherLog = JSON.parse(localStorage.getItem("cities"));
    if (weatherLog != null) {
        for (let i = 0; i < weatherLog.length; i++) {
            $(".logBtn").eq(i).removeClass('d-none').addClass("bg-dark-subtle border border-0 mb-4 p-2").text(weatherLog[i].name);
        }
    }

    // Adds event listener and functionality to search button 
    $("#search-button").on("click", function (event) {
        event.preventDefault();
        city = $("#search-input").val().trim();;
       
        // Fetches latitude and longtitude
        fetchCoordinates(city);
    })

    // Gets city name and fetches coordinates of the city
    function fetchCoordinates(town) {

        let latURL = "https://api.openweathermap.org/geo/1.0/direct?q=" + town + "&limit=5&appid=" + apiKey;

        fetch(latURL)
            .then(function (response) {
                return response.json();
            }).then(function (data) {
                longtitude = data[0].lon;
                latitude = data[0].lat;
                city = data[0].name;  // to make sure the displayed data is the data of the intended city
                fetchCurrentWeather(latitude, longtitude);
                fetchFiveDaysForecast(latitude, longtitude);
            });
    }
    // ***********************

    // Gets cordinates and fetches current weather and calls a function to update the displayed data
    function fetchCurrentWeather(lat, lon) {

        let currentURL = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat.toFixed(2) + "&lon=" + lon.toFixed(2) + "&appid=" + apiKey + "&units=metric";
        
        // Fetch current weather
        fetch(currentURL)
            .then(function (response) {
                return response.json();
            }).then(function (dataCW) {
               
                // Updates displayed current weather
                updateToday(dataCW)
            });
    }
    // ****************************

    // Gets coordinates and Fetches five-day forecast and calls a function to update displayed data
    function fetchFiveDaysForecast(lat, lon) {

        let weatherURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat.toFixed(2) + "&lon=" + lon.toFixed(2) + "&appid=" + apiKey + "&units=metric";

        fetch(weatherURL)
            .then(function (response) {
                return response.json();
            }).then(function (dataF) {
                
                // Updates displayed forecast
                updateForcast(dataF);
            });
    }
    // ****************************

    // Updates displayed current weather section after each query and calls a function to update search history
    function updateToday(data) {
        todayHeader.text(city + " (" + dayjs().format('DD/MM/YYYY') + ")");
        $("#today").addClass("border border-dark p-2");
        $("#wind").text("Wind: " + ((data.wind.speed) * 3.6).toFixed(2) + " KPH")
        $("#humidity").text("Humidity: " + data.main.humidity + "%");
        $("#temp").text("Temp: " + data.main.temp + "\xB0 C");
        let iconCode = data.weather[0].icon;
        let icon = iconSource.replace("01n", iconCode);
        todayHeader.append("<img class='d-inline' style='width: 70px;' src=" + icon + " alt='weather'>")
        
        updateSearchLog();
    }
    // *******************

    // Updates displayed forecast section after each query
    function updateForcast(data) {

        // If it is after 9 PM it selects around 12 noon of the next five days for displying forecast
        // otherwise it selects 24 hour from now for forecasts, whatever the time is
        if (24 - dayjs().hour() <= 3) var index = 5;
        else var index = 7;

        $("h3").text("Five-Day Forecast:");
        $(".dayforecast").css({ "background-color": "#006994", "color": "white" });

        // Fills the info in the five days forcast sections
        for (let i = 0; index < data.list.length && i < 5; index += 8, i++) {

            //Adds forecast date
            let date = (data.list[index].dt_txt).split(" ");
            let date0 = dayjs(date[0]).format('DD/MM/YYYY');
            $(".dayforecast").eq(i).children().eq(0).text(date0);

            // Adds forecast image
            let iconCode = data.list[index].weather[0].icon;
            let icon = iconSource.replace("01n", iconCode);
            $(".dayforecast").eq(i).children().eq(0).append("<img style='width: 50px;' src=" + icon + " alt='weather'>");

            // Adds forcast temperature
            let temp = data.list[index].main.temp;
            $(".dayforecast").eq(i).children().eq(1).text("Temp: " + temp + "\xB0 C");

            // Adds forcast wind speed
            let speed = data.list[index].wind.speed;
            $(".dayforecast").eq(i).children().eq(2).text("Wind: " + (speed * 3.6).toFixed(2) + " KPH");

            // Adds forcast humidity
            let humidity = data.list[index].main.humidity;
            $(".dayforecast").eq(i).children().eq(3).text("Humidity: " + humidity + "%");
        }
    }
    // ****************************************

    // Updates history section after each new query
    function updateSearchLog() {
        let newCity = { name: city, longtitude: longtitude, latitude: latitude };
        let weatherLog = JSON.parse(localStorage.getItem("cities"));
        if (weatherLog == null) {
            cities[0] = newCity;
        } else {
            cities = weatherLog;
            let index = cities.findIndex(element => (element.name).toUpperCase() == city.toUpperCase());
            if (index < 0) {
                for (let i = cities.length - 1; i >= 0; i--) {
                    if (i < 5) cities[i + 1] = cities[i];
                }
                cities[0] = newCity;
            }
        }

        localStorage.setItem("cities", JSON.stringify(cities));
        
        // Updates the text on buttons in history section 
        for (let i = 0; i < cities.length; i++) {
            $(".logBtn").eq(i).removeClass('d-none').addClass("bg-dark-subtle border border-0 mb-4 p-2").text(cities[i].name);
        }
    }
    // ************************* 

    // Add event listener and functionality to buttons in history section
    $(".logBtn").click(function () {
        let cityName = $(this).text();
        let weatherLog = JSON.parse(localStorage.getItem("cities"));
        if (weatherLog != null) {
            // Reads the stored coordinates from the local storage so it does not need to query them
            let index = weatherLog.findIndex(element => element.name == cityName);
            if (index > -1) {
                longtitude = weatherLog[index].longtitude;
                latitude = weatherLog[index].latitude;
                city = cityName;
                // Fetches current weather
                fetchCurrentWeather(latitude, longtitude);
                // Fetches five days weather forcast
                fetchFiveDaysForecast(latitude, longtitude);
            }
        }
    })
    // **********************

});
