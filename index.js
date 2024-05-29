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
  cityInput.value = ""; // Clear the search box
});

function getCoordinates(city) {
  fetch(
    `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`
  )
    .then((response) => response.json())
    .then((data) => getWeather(data.coord.lat, data.coord.lon, city));
}

function getWeather(lat, lon, city) {
  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`
  )
    .then((response) => response.json())
    .then((data) => {
      displayCurrentWeather(data);
      displayForecast(data);
      saveSearchHistory(city);
    });
}
function displayCurrentWeather(data) {
  // Clear the current weather section
  currentWeather.innerHTML = "";

  // Create HTML elements for the city name, date, weather conditions, temperature, humidity, wind speed, and weather icon
  const cityName = document.createElement("h2");
  const weatherConditions = document.createElement("p");
  const temperature = document.createElement("p");
  const windSpeed = document.createElement("p");
  const humidity = document.createElement("p");
  const weatherIcon = document.createElement("img");

  // Set the text content of the elements
  cityName.textContent = `${data.city.name} - ${new Date(
    data.list[0].dt * 1000
  ).toLocaleString("en-US", {
    dateStyle: "full",
    timeStyle: "short",
  })}`;
  weatherConditions.textContent = data.list[0].weather[0].description;
  const tempInFahrenheit = ((data.list[0].main.temp - 273.15) * 9) / 5 + 32;
  temperature.textContent = `Temperature: ${tempInFahrenheit.toFixed(2)} °F`;
  humidity.textContent = `Humidity: ${data.list[0].main.humidity} %`;
  windSpeed.textContent = `Wind Speed: ${data.list[0].wind.speed} MPH`;

  // Set the src of the weather icon
  weatherIcon.src = `http://openweathermap.org/img/wn/${data.list[0].weather[0].icon}.png`;

  // Append the weather icon to the city name
  cityName.appendChild(weatherIcon);

  // Append the elements to the current weather section
  currentWeather.appendChild(cityName);
  currentWeather.appendChild(weatherConditions);
  currentWeather.appendChild(temperature);
  currentWeather.appendChild(humidity);
  currentWeather.appendChild(windSpeed);
}

function displayForecast(data) {
  // Clear the forecast section
  forecast.innerHTML = "";

  // Check if the forecast header already exists
  let forecastHeader = document.querySelector(".center-text");

  // If it doesn't exist, create it
  if (!forecastHeader) {
    forecastHeader = document.createElement("h2");
    forecastHeader.textContent = "5-Day Forecast:";
    forecastHeader.classList.add("center-text");

    // Append the header to the parent of the forecast section
    forecast.parentElement.insertBefore(forecastHeader, forecast);
  }

  // Loop over the forecast data for the next 5 days
  for (let i = 1; i < 6; i++) {
    // Create HTML elements for the date, icon, temperature, humidity, and wind speed
    const forecastDate = document.createElement("p");
    const forecastIcon = document.createElement("img");
    const forecastTemp = document.createElement("p");
    const forecastHumidity = document.createElement("p");
    const forecastWindSpeed = document.createElement("p"); // New element for wind speed

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
    forecastWindSpeed.textContent = `Wind Speed: ${
      data.list[i * 8 - 1].wind.speed
    } MPH`; // Set the text content for wind speed

    // Create a div to hold the forecast for this day and add the elements to it
    const forecastDiv = document.createElement("div");
    forecastDiv.classList.add("forecast");
    forecastDiv.appendChild(forecastDate);
    forecastDiv.appendChild(forecastIcon);
    forecastDiv.appendChild(forecastTemp);
    forecastDiv.appendChild(forecastWindSpeed); // Append the wind speed element
    forecastDiv.appendChild(forecastHumidity);

    // Append the div to the forecast section
    forecast.appendChild(forecastDiv);
  }
}

const forecastDate = document.createElement("p");
forecastDate.classList.add("forecast-date");

function saveSearchHistory(city) {
  // Only proceed if the city name is not blank
  if (city.trim() !== "") {
    // Get the current search history from localStorage
    let searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];

    // Add the city to the search history
    searchHistory.push(city);

    // Save the updated search history to localStorage
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));

    // Load the updated search history
    loadSearchHistory();
  }
}

// Load the search history when the page is loaded
window.onload = loadSearchHistory;

function loadSearchHistory() {
  // Get the search history from localStorage
  let searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];

  // Get the search history sidebar element
  let searchHistorySidebar = document.getElementById("search-history");

  // Clear the search history sidebar
  searchHistorySidebar.innerHTML = "";

  // Create a button for each city in the search history
  for (let i = 0; i < searchHistory.length; i++) {
    let cityDiv = document.createElement("div");
    let cityButton = document.createElement("button");
    let deleteButton = document.createElement("button");

    cityButton.textContent = searchHistory[i];
    cityButton.classList.add("city-button");
    cityButton.addEventListener("click", function () {
      getCoordinates(searchHistory[i]); // Call getCoordinates instead of getWeather
    });

    deleteButton.textContent = "Delete";
    deleteButton.classList.add("delete-button");
    deleteButton.addEventListener("click", function () {
      // Remove the city from the search history
      searchHistory.splice(i, 1);
      localStorage.setItem("searchHistory", JSON.stringify(searchHistory));

      // Reload the search history after a delay
      setTimeout(loadSearchHistory, 0);
    });

    cityDiv.appendChild(cityButton);
    cityDiv.appendChild(deleteButton);
    searchHistorySidebar.appendChild(cityDiv);
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
