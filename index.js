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
  // Display the current weather conditions
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
