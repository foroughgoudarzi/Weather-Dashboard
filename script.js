$("document").ready(function () {
    var apiKey = "ffe2c4b50bca7de701389fcca1ad8a3a";
    var today = dayjs().format('DD/MM/YYYY');
    var now = dayjs().hour();
    var city;
    var cities = [6];
    var latitude;
    var longtitude;
    var weatherURL;
    var iconSource = "https://openweathermap.org/img/wn/01n@2x.png";

    // ************ HTML elements *********************
    // Today info section
    var todayHeader = $("<h2>");
    $("#today").append(todayHeader);
    $("#today").append("<p id='temp'></p>");
    $("#today").append("<p id='wind'></p>");
    $("#today").append("<p id='humidity'></p>");

    // Forcast section
    $("#forecast").append("<h3 id='fivedayheader'></h3>");
    $("#forecast").append("<div class='d-flex justify-content-between flex-wrap fivedays'></div>");
    for (let i = 0; i < 5; i++) {

        $(".fivedays").append("<div class='col-2 dayforecast p-2'></div>");
        $(".dayforecast:last").append("<h4 class='date'></h4>");
        $(".dayforecast:last").append("<p class='temp'></p>");
        $(".dayforecast:last").append("<p class='wind'></p>");
        $(".dayforecast:last").append("<p class='humidity'></p>");

    }

    // History section
    for (let i = 0; i < 6; i++) {

        $("#history").append("<button class='d-none logBtn text-dark rounded-1'></button>");
    }

    // Loads History
    let weatherLog = JSON.parse(localStorage.getItem("cities"));
    if(weatherLog != null){
        for(let i=0; i<weatherLog.length; i++){
            $(".logBtn").eq(i).removeClass('d-none').addClass("bg-dark-subtle border border-0 mb-4 p-2").text(weatherLog[i].name);
        }
    }


    $("#search-button").on("click", function (event) {

        event.preventDefault();
        city = $("#search-input").val().trim();;
        // Fetches latitude and longtitude
        fetchCoordinates(city);
        
      
           
    })

    // Gets city name and fetches coordinates of the city
    function fetchCoordinates(city){

    let latURL = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=5&appid=" + apiKey;

    fetch(latURL)
        .then(function (response) {
            return response.json();
        }).then(function (data) {
            console.log(data);
            longtitude = data[0].lon;
            latitude = data[0].lat;
            city = data[0].name;  // to make sure the displayed data is the data of the intended city
            fetchCurrentWeather(latitude, longtitude);
            fetchFiveDaysForecast(latitude, longtitude);
        });
    }
    // ***********************

    // Gets cordinates and fetches current weather and calls another function to update the screen data
    function fetchCurrentWeather(latitude, longtitude){
    
    currentURL = "https://api.openweathermap.org/data/2.5/weather?lat=" + latitude.toFixed(2) + "&lon=" + longtitude.toFixed(2) + "&appid=" + apiKey + "&units=metric";
    // Fetch weather
    fetch(currentURL)
        .then(function (response) {
            return response.json();
        }).then(function (dataCW) {

            updateToday(dataCW)
        });
    }
    // ****************************

    // Gets coordinates and Fetches five-day forecast and the calls a function to update screen
    function fetchFiveDaysForecast(latitude, longtitude){

    weatherURL = "http://api.openweathermap.org/data/2.5/forecast?lat=" + latitude.toFixed(2) + "&lon=" + longtitude.toFixed(2) + "&appid=" + apiKey + "&units=metric";

    fetch(weatherURL)
        .then(function (response) {
            return response.json();
        }).then(function (dataF) {

            updateForcast(dataF);
        });
    }


    // Updates today weather section after each query
    function updateToday(data) {
        todayHeader.text(city + " (" + today + ")");
        $("#today").addClass("border border-dark p-2");
        $("#wind").text("Wind: " + ((data.wind.speed) * 3.6).toFixed(2) + " KPH")
        $("#humidity").text("Humidity: " + data.main.humidity + "%");
        $("#temp").text("Temp: " + data.main.temp + "\xB0 C");
        let iconCode = data.weather[0].icon;
        let icon = iconSource.replace("01n", iconCode);
        todayHeader.append("<img class='d-inline' style='width: 70px;' src=" + icon + " alt='weather'>")

        manageSearchLog();

    }
    // *******************


    // Updates forecast section after each query
    function updateForcast(data) {
        console.log(data);
        // We want to find the weather at noon for next 5 days
        if (24 - now <= 3) var index = 5;
        else var index = 7;

        // var numberOfTodayRecords = Math.ceil((24-now)/3)-1;
        $("h3").text("Five-Day Forecast:");
        $(".dayforecast").css({ "background-color": "#006994", "color": "white" });

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

    // Manages history section after each new query
    function manageSearchLog() {
        let newCity = { name: city, longtitude: longtitude, latitude: latitude };
        let weatherLog = JSON.parse(localStorage.getItem("cities"));
        if (weatherLog == null) {
            cities[0] = newCity;
        } else {
            cities = weatherLog;
            let index = cities.findIndex(element => element.name == city);
            if (index < 0) {
                for (let i = cities.length - 1; i >= 0; i--) {
                    if (i < 5) cities[i + 1] = cities[i];
                }
                cities[0] = newCity;
            }

        }

        localStorage.setItem("cities", JSON.stringify(cities));

        for (let i = 0; i < cities.length; i++) {
            $(".logBtn").eq(i).removeClass('d-none').addClass("bg-dark-subtle border border-0 mb-4 p-2").text(cities[i].name);
        }

    }
    // ************************* 

    // Defines the functionality of buttons with city name
    $(".logBtn").click(function(){
        let cityName = $(this).text();
        let weatherLog = JSON.parse(localStorage.getItem("cities"));
        if (weatherLog != null) {
            let index = weatherLog.findIndex(element => element.name == cityName);
            if(index>-1){
              let lon = weatherLog[index].longtitude;
              let lat = weatherLog[index].latitude;
              city =cityName;
              // call todays weather
              fetchCurrentWeather(lat, lon);
              // call forecast weather
              fetchFiveDaysForecast(lat, lon);
            }
        }
    })
    // **********************

});
