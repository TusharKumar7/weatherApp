const API_key = "82005d27a116c2880c8f0fcb866998a0";
const searchBtn = document.querySelector(".search-btn");
const inputField = document.querySelector(".city-input");
const cityWeatherIcon = document.getElementById("city-weather-icon");
const cityTemp = document.getElementById("city-temp");
const cityDesc = document.getElementById("city-desc");
const cityName = document.getElementById("city-name");
const countryName = document.getElementById("country-name");
const cardContainer = document.getElementById("card-container");
const loaderContainer = document.getElementById("loader-container");
const errorContainer = document.getElementById("error-container");
const errorMessage = document.getElementById("error-message");

cardContainer.style.display = "none";
errorContainer.style.display = "none";

// To get current location
const getCityName = async (position) => {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;
  const weatherData = await getWeatherDataFromLocation(latitude, longitude);
  displayWeatherDetails(weatherData);
};

// if navigator failed to fetch location
const failedToGetLocation = async (error) => {
  console.log("Error getting user location:", error);
  errorMessage.innerText = "Permission Blocked";
  errorContainer.style.display = "inline-block";
  loaderContainer.style.display = "none";
};

if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(getCityName, failedToGetLocation);
}

const getWeatherDataFromLocation = async (latitude, longitude) => {
  const API_URL_Coordinates = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_key}`;
  const weatherDetails = await fetchData(API_URL_Coordinates);
  const iconId = weatherDetails.weather[0].icon;
  const tempInCelcius = Math.floor(weatherDetails.main.temp - 273.15);
  const description = weatherDetails.weather[0].description;
  const city = weatherDetails.name;
  const country = weatherDetails.sys.country;
  const weatherType = weatherDetails.weather[0].main;
  return { description, tempInCelcius, city, country, iconId, weatherType };
};

const getWeatherFromInput = async (cityname) => {
  const API_URL_CityName = `http://api.openweathermap.org/geo/1.0/direct?q=${cityname}&limit=5&appid=${API_key}`;
  loaderContainer.style.display = "inline-block";
  cardContainer.style.display = "none";
  const jsonData = await fetchData(API_URL_CityName);
  if (jsonData.length !== 0) {
    const lat = jsonData[0].lat;
    const lon = jsonData[0].lon;
    const locationData = await getWeatherDataFromLocation(lat, lon);
    inputField.value = "";
    displayWeatherDetails(locationData);
  } else {
    cardContainer.style.display = "none";
    loaderContainer.style.display = "none";
    errorMessage.innerText = "Invalid City";
    document.body.style.backgroundImage = "url(/assets/Default.jpg)";
    errorContainer.style.display = "inline-block";
  }
};

const fetchData = async (url) => {
  const response = await fetch(url);
  const data = await response.json();
  return data;
};

searchBtn.addEventListener("click", async () => {
  const value = inputField.value;
  const result = await getWeatherFromInput(value);
});

const displayWeatherDetails = async (weathDetails) => {
  loaderContainer.style.display = "none";
  cardContainer.style.display = "inline-block";
  errorContainer.style.display = "none";
  const { tempInCelcius, description, city, country, iconId, weatherType } =
    weathDetails;
  cityTemp.innerText = tempInCelcius + "° ";
  cityDesc.innerText = description;
  cityName.innerText = city;
  countryName.innerText = country;
  cityWeatherIcon.setAttribute("src", `./assets/${iconId}.png`);
  document.body.style.backgroundImage = `url(/assets/${weatherType}.jpg)`;
};
