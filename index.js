const API_key = "82005d27a116c2880c8f0fcb866998a0";
const searchBtn = document.querySelector(".search-btn");
const inputField = document.querySelector(".city-input");

const cityWeatherIcon = document.getElementById("city-weather-icon");
const cityTemp = document.getElementById("city-temp");
const cityDesc=document.getElementById("city-desc")
const cityName = document.getElementById("city-name");
const countryName=document.getElementById("country-name");

if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(getCityName, failedToGetLocation);
} else {
  console.error("Geolocation is not supported by this browser.");
}

// To get current location
async function getCityName(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;
  getWeatherDataFromLocation(latitude, longitude);
}

// if navigator failed to fetch location
function failedToGetLocation() {
  console.error("Error getting user location:", error);
}

async function getWeatherDataFromLocation(latitude, longitude) {
  const response = await fetch(
    `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_key}`
  );
  if (response.status == 200) {
    const weatherDetails = await response.json();
    console.log(weatherDetails);
    const iconId = weatherDetails.weather[0].icon;
    const tempInCelcius = Math.floor(weatherDetails.main.temp - 273.15);
    const description = weatherDetails.weather[0].description;
    const city = weatherDetails.name;
    const country = weatherDetails.sys.country;
    const weatherType = weatherDetails.weather[0].main;

    return {description,tempInCelcius,city,country,weatherType,iconId};
  } else {
    return false;
  }
  // displayWeatherDetails(weatherDetails);
}

async function getWeatherFromInput(cityname) {
  const response = await fetch(
    `http://api.openweathermap.org/geo/1.0/direct?q=${cityname}&limit=5&appid=${API_key}`
  );
  const data = await response.json();
  const lat = data[0].lat;
  const lon = data[0].lon;
  const locationData= await getWeatherDataFromLocation(lat, lon);
  displayWeatherDetails(locationData);
}

searchBtn.addEventListener("click", async () => {
  const value = inputField.value;
  const result = await getWeatherFromInput(value);
});

function displayWeatherDetails(weathDetails) {
  console.log(weathDetails);
  const {
    tempInCelcius,
    description,
    city,
    country,
    iconId,
    weatherType,
  } = weathDetails;
  cityTemp.innerText = tempInCelcius;
  cityDesc.innerText = description;
  cityName.innerText = city;
  countryName.innerText = country;
  cityWeatherIcon.setAttribute("src", `./assets/${iconId}.png`);
  console.log("weather details of input field");
}
