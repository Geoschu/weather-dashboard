const cityForm = document.getElementById("city-form");
const cityInput = document.getElementById("city-input");
const currentWeather = document.getElementById("current-weather");
const forecast = document.getElementById("forecast");
const searchHistory = document.getElementById("search-history");

const API_KEY = "8acd15531199189e0cf6a234e1d156fa";

cityForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const city = cityInput.value;
  getCoordinates(city);
});

function getCoordinates(city) {
  fetch(
    `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`
  )
    .then((response) => response.json())
    .then((data) => getWeather(data.coord.lat, data.coord.lon));
}

function getWeather(lat, lon) {
  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`
  )
    .then((response) => response.json())
    .then((data) => {
      displayCurrentWeather(data);
      displayForecast(data);
      saveSearchHistory(cityInput.value);
    });
}

function displayCurrentWeather(data) {
  // Clear the current weather section
  currentWeather.innerHTML = "";

  // Create HTML elements for the city name, date, weather conditions, temperature, humidity, wind speed, and weather icon
  const cityName = document.createElement("h2");
  const date = document.createElement("p");
  const weatherConditions = document.createElement("p");
  const temperature = document.createElement("p");
  const humidity = document.createElement("p");
  const windSpeed = document.createElement("p");
  const weatherIcon = document.createElement("img");

  // Set the text content of the elements
  cityName.textContent = data.city.name;
  date.textContent = new Date(data.list[0].dt * 1000).toLocaleString("en-US", {
    dateStyle: "full",
    timeStyle: "short",
  });
  weatherConditions.textContent = data.list[0].weather[0].description;
  const tempInFahrenheit = ((data.list[0].main.temp - 273.15) * 9) / 5 + 32;
  temperature.textContent = `Temperature: ${tempInFahrenheit.toFixed(2)} °F`;
  humidity.textContent = `Humidity: ${data.list[0].main.humidity} %`;
  windSpeed.textContent = `Wind Speed: ${data.list[0].wind.speed} MPH`;

  // Set the src of the weather icon
  weatherIcon.src = `http://openweathermap.org/img/wn/${data.list[0].weather[0].icon}.png`;

  // Append the elements to the current weather section
  currentWeather.appendChild(cityName);
  currentWeather.appendChild(date);
  currentWeather.appendChild(weatherConditions);
  currentWeather.appendChild(weatherIcon);
  currentWeather.appendChild(temperature);
  currentWeather.appendChild(humidity);
  currentWeather.appendChild(windSpeed);
}

function displayForecast(data) {
  // Clear the forecast section
  forecast.innerHTML = "";

  // Create a header for the forecast section
  const forecastHeader = document.createElement("h2");
  forecastHeader.textContent = "5-Day Forecast:";
  forecast.appendChild(forecastHeader);

  // Loop over the forecast data for the next 5 days
  for (let i = 1; i < 6; i++) {
    // Create HTML elements for the date, icon, temperature, and humidity
    const forecastDate = document.createElement("p");
    const forecastIcon = document.createElement("img");
    const forecastTemp = document.createElement("p");
    const forecastHumidity = document.createElement("p");

    // Set the text content and src of the elements
    forecastDate.textContent = new Date(
      data.list[i * 8 - 1].dt * 1000
    ).toLocaleDateString();
    forecastIcon.src = `http://openweathermap.org/img/wn/${
      data.list[i * 8 - 1].weather[0].icon
    }.png`;
    const tempInFahrenheit =
      ((data.list[i * 8 - 1].main.temp - 273.15) * 9) / 5 + 32;
    forecastTemp.textContent = `Temp: ${tempInFahrenheit.toFixed(2)} °F`;
    forecastHumidity.textContent = `Humidity: ${
      data.list[i * 8 - 1].main.humidity
    } %`;

    // Create a div to hold the forecast for this day and add the elements to it
    const forecastDiv = document.createElement("div");
    forecastDiv.classList.add("forecast");
    forecastDiv.appendChild(forecastDate);
    forecastDiv.appendChild(forecastIcon);
    forecastDiv.appendChild(forecastTemp);
    forecastDiv.appendChild(forecastHumidity);

    // Append the div to the forecast section
    forecast.appendChild(forecastDiv);
  }
}

function saveSearchHistory(city) {
  // Get the current search history from localStorage
  let searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];

  // Add the city to the search history
  searchHistory.push(city);

  // Save the updated search history to localStorage
  localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
}

function loadSearchHistory() {
  // Get the search history from localStorage
  let searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];

  // Clear the search history element
  searchHistoryElement.innerHTML = "";

  // Create a button for each city in the search history
  for (let city of searchHistory) {
    const cityButton = document.createElement("button");
    cityButton.textContent = city;
    searchHistoryElement.appendChild(cityButton);
  }
}

searchHistory.addEventListener("contextmenu", function (event) {
  event.preventDefault();

  if (event.target.tagName === "BUTTON") {
    // Get the current search history from localStorage
    let searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];

    // Remove the city from the search history
    const cityIndex = searchHistory.indexOf(event.target.textContent);
    if (cityIndex > -1) {
      searchHistory.splice(cityIndex, 1);
    }

    // Save the updated search history to localStorage
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));

    // Reload the search history
    loadSearchHistory();
  }
});
