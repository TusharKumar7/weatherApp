const API_key = "82005d27a116c2880c8f0fcb866998a0";
const searchBtn = document.querySelector(".search-btn");
const inputField = document.querySelector(".city-input");
const cityWeatherIcon = document.getElementById("city-weather-icon");
const cityTemp = document.getElementById("city-temp");
const cityDesc=document.getElementById("city-desc")
const cityName = document.getElementById("city-name");
const countryName=document.getElementById("country-name");
const cardContainer=document.getElementById("card-container");
const loaderContainer=document.getElementById("loader-container");
const errorContainer=document.getElementById("error-container");
const errorMessage=document.getElementById("error-message");

const weatherTypes = ["Clear","Clouds","Rain" ,"Snow","Thunderstorm","Drizzle","Mist","Haze","Lightrain"];
cardContainer.style.display="none";
errorContainer.style.display="none";

if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(getCityName, failedToGetLocation);
} else {
  console.error("Geolocation is not supported by this browser.");
}

// To get current location
async function getCityName(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;
  const weatherData =await getWeatherDataFromLocation(latitude, longitude);
  displayWeatherDetails(weatherData);
}

// if navigator failed to fetch location
function failedToGetLocation(error) {
  console.log("Error getting user location:", error);
  errorMessage.innerText="Current location Not Available";
  errorContainer.style.display="inline-block";
  loaderContainer.style.display="none"
}

async function getWeatherDataFromLocation(latitude, longitude) {
  const response = await fetch(
    `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_key}`
  );
  const weatherDetails = await response.json();
  if (response.status == 200) {
    const iconId = weatherDetails.weather[0].icon;
    const tempInCelcius = Math.floor(weatherDetails.main.temp - 273.15);
    const description = weatherDetails.weather[0].description;
    const city = weatherDetails.name;
    const country = weatherDetails.sys.country;
    const weatherType=weatherDetails.weather[0].main;
    return {description,tempInCelcius,city,country,iconId,weatherType};
  } else {
    return false;
  }
}

async function getWeatherFromInput(cityname) {
  loaderContainer.style.display="inline-block";
  cardContainer.style.display="none";
  const response = await fetch(
    `http://api.openweathermap.org/geo/1.0/direct?q=${cityname}&limit=5&appid=${API_key}`
  );
  const data = await response.json();
  if(data.length!==0){
    const lat = data[0].lat;
    const lon = data[0].lon;
    const locationData= await getWeatherDataFromLocation(lat, lon);
    inputField.value="";
    displayWeatherDetails(locationData);
  }
  else{
    cardContainer.style.display="none"
    loaderContainer.style.display="none"
    errorMessage.innerText="Invalid City"
    document.body.style.backgroundImage="url(/assets/Default.jpg)";
    errorContainer.style.display="inline-block";
  }
}

searchBtn.addEventListener("click", async () => {
  const value = inputField.value;
  const result = await getWeatherFromInput(value);
});

function displayWeatherDetails(weathDetails) {
  loaderContainer.style.display="none"
  cardContainer.style.display="inline-block";
  errorContainer.style.display="none";
  const { tempInCelcius, description, city, country, iconId, weatherType } = weathDetails;
  cityTemp.innerText = tempInCelcius+"° ";
  cityDesc.innerText = description;
  cityName.innerText = city;
  countryName.innerText = country;
  cityWeatherIcon.setAttribute("src", `./assets/${iconId}.png`);
  if (weatherTypes.includes(weatherType)) {
    document.body.style.backgroundImage="url(/assets/"+weatherType+".jpg)";
  } else {
    document.body.style.backgroundImage="url(/assets/Default.jpg)";
  }
}