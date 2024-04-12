const API_key = "82005d27a116c2880c8f0fcb866998a0";
const searchBtn = document.getElementById("search-btn");
const inputField = document.getElementById("city-input");
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
document.body.style.backgroundSize = "cover";

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
  toggleContainer(false,false,true);
};

if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(getCityName, failedToGetLocation);
}

const getWeatherDataFromLocation = async (latitude, longitude) => {
  const API_URL_Coordinates = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_key}`;
  const data = await fetchData(API_URL_Coordinates);
  const weatherDetails = await data.json();
  const iconId = weatherDetails.weather[0].icon;
  const tempInCelcius = Math.floor(weatherDetails.main.temp - 273.15);
  const description = weatherDetails.weather[0].description;
  const city = weatherDetails.name;
  const country = weatherDetails.sys.country;
  const weatherType = weatherDetails.weather[0].main;
  return { description, tempInCelcius, city, country, iconId, weatherType };
};

const inputCityName = async (cityname) => {
  const API_URL_CityName = `http://api.openweathermap.org/geo/1.0/direct?q=${cityname}&limit=5&appid=${API_key}`;
  toggleContainer(true,false,false);
  const data = await fetchData(API_URL_CityName);
  if (data) {
    const jsonData = await data?.json();
    if (jsonData.length>0) {
      const lat = jsonData[0]?.lat;
      const lon = jsonData[0]?.lon;
      const locationData = await getWeatherDataFromLocation(lat, lon);
      displayWeatherDetails(locationData);
    }else{
      errorMessage.innerText = "Invalid City";
      document.body.style.backgroundImage = "url(/assets/Default.jpg)";
      toggleContainer(false,false,true);
    }
  } else {
    return null;
  }
};

const fetchData = async (url) => {
  const response = await fetch(url);
    if (response.status !== 200) {
      errorMessage.innerText = "Invalid City";
      document.body.style.backgroundImage = "url(/assets/Default.jpg)";
      toggleContainer(false,false,true);
      return null;
    }
    return response;
};

inputField.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    searchBtn.click();
  } else if (inputField.value == "" && e.keyCode === 32) {
    e.preventDefault();
    return;
  }
});

searchBtn.addEventListener("click", async () => {
  if (!inputField.value == "") {
    const value = inputField.value;
    inputCityName(value.trim());
  } else {
    errorMessage.innerText = "Please Enter cityname";
    toggleContainer(false,false,true);
  }
  inputField.value="";
});

const displayWeatherDetails = async (weathDetails) => {
  toggleContainer(false,true,false);
  const { tempInCelcius, description, city, country, iconId, weatherType } =
    weathDetails;
  cityTemp.innerText = tempInCelcius + "° ";
  cityDesc.innerText = description;
  cityName.innerText = city;
  countryName.innerText = country;
  cityWeatherIcon.setAttribute("src", `./assets/${iconId}.png`);
  document.body.style.backgroundImage = `url(/assets/${weatherType}.jpg)`;
};

const toggleContainer = (showLoader, showCard, showError) => {
  loaderContainer.style.display = showLoader ? "inline-block" : "none";
  cardContainer.style.display = showCard ? "inline-block" : "none";
  errorContainer.style.display = showError ? "inline-block" : "none";
};


