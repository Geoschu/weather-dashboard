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

  // Create HTML elements for the city name, date, weather conditions, temperature, humidity, and wind speed
  const cityName = document.createElement("h2");
  const date = document.createElement("p");
  const weatherConditions = document.createElement("p");
  const temperature = document.createElement("p");
  const humidity = document.createElement("p");
  const windSpeed = document.createElement("p");

  // Set the text content of the elements
  cityName.textContent = data.city.name;
  date.textContent = new Date(data.list[0].dt * 1000).toLocaleDateString();
  weatherConditions.textContent = data.list[0].weather[0].description;
  temperature.textContent = `Temperature: ${data.list[0].main.temp} °F`;
  humidity.textContent = `Humidity: ${data.list[0].main.humidity} %`;
  windSpeed.textContent = `Wind Speed: ${data.list[0].wind.speed} MPH`;

  // Append the elements to the current weather section
  currentWeather.appendChild(cityName);
  currentWeather.appendChild(date);
  currentWeather.appendChild(weatherConditions);
  currentWeather.appendChild(temperature);
  currentWeather.appendChild(humidity);
  currentWeather.appendChild(windSpeed);
}

function displayForecast(data) {
  // Display the 5-day forecast
}

function saveSearchHistory(city) {
  // Save the city to localStorage
}

function loadSearchHistory() {
  // Load the search history from localStorage and display it
}

searchHistory.addEventListener("click", function (event) {
  if (event.target.tagName === "BUTTON") {
    getCoordinates(event.target.textContent);
  }
});

loadSearchHistory();
