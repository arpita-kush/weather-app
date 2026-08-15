const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");


const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const condition = document.getElementById("condition");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");

const weatherIcon = document.getElementById("weatherIcon");
const feelsLike = document.getElementById("feelsLike");
const loading = document.getElementById("loading");
const country = document.getElementById("country");
const localTime = document.getElementById("localTime");
const forecastContainer = document.getElementById("forecastContainer");
const themeBtn = document.getElementById("themeBtn");
const errorMessage = document.getElementById("errorMessage");
const locationBtn = document.getElementById("locationBtn");

const API_KEY = "2d7adf27395e4095b5865400260908";

function changeBackground(condition, isDay) {

    const weather = condition.toLowerCase();

    // Night
    if (!isDay) {
        document.body.style.backgroundImage =
            `linear-gradient(rgba(0,0,30,0.45), rgba(0,0,30,0.45)),
             url("https://images.unsplash.com/photo-1534791547706-9d5e6fab6933?auto=format&fit=crop&w=1920&q=80")`;
        return;
    }

    // Rain
    if (weather.includes("rain") || weather.includes("drizzle")) {

        document.body.style.backgroundImage =
            `linear-gradient(rgba(0,0,0,0.25), rgba(0,0,0,0.25)),
             url("https://images.unsplash.com/photo-1519692933481-e162a57d6721?auto=format&fit=crop&w=1920&q=80")`;

    // Thunderstorm
    } else if (weather.includes("thunder")) {

        document.body.style.backgroundImage =
            `linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.35)),
             url("https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?auto=format&fit=crop&w=1920&q=80")`;

    // Snow
    } else if (weather.includes("snow")) {

        document.body.style.backgroundImage =
            `linear-gradient(rgba(0,0,0,0.15), rgba(0,0,0,0.15)),
             url("https://images.unsplash.com/photo-1486911278844-a81c5267e227?auto=format&fit=crop&w=1920&q=80")`;

    // Cloudy / Mist / Fog
    } else if (
        weather.includes("cloud") ||
        weather.includes("overcast") ||
        weather.includes("mist") ||
        weather.includes("fog")
    ) {

        document.body.style.backgroundImage =
            `linear-gradient(rgba(0,0,0,0.20), rgba(0,0,0,0.20)),
             url("https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=1920&q=80")`;

    // Sunny / Clear
    } else {

        document.body.style.backgroundImage =
            `linear-gradient(rgba(0,0,0,0.15), rgba(0,0,0,0.15)),
             url("https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1920&q=80")`;
    }
}
searchBtn.addEventListener("click", async function () {

    const city = cityInput.value.trim();
   
   
    

    if (city === "") {
        alert("Please enter a city name.");
        return;
    }

     localStorage.setItem("lastCity",city);
      errorMessage.textContent="";

    const searchQuery = city.includes(",") ? city : `${city}, India`;

     loading.textContent = "Loading...";

    try {

    const url =
        `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${searchQuery}&aqi=no`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("City not found");
    }

    const data = await response.json();

const searchedCity = city.split(",")[0].trim().toLowerCase();
const foundCity = data.location.name.trim().toLowerCase();

if (
    !city.includes(",") &&
    !foundCity.includes(searchedCity) &&
    !searchedCity.includes(foundCity)
) {
    throw new Error("City not found");
}
    


    changeBackground(
    data.current.condition.text,
    data.current.is_day
);

loading.textContent = "";
    console.log(data.current);

    cityName.textContent = data.location.name;
    cityInput.value = data.location.name;
    country.textContent = data.location.country;
    localTime.textContent = "Local Time: "+data.location.localtime;

    temperature.textContent =
        data.current.temp_c + "°C";

    condition.textContent =
        data.current.condition.text;

    weatherIcon.src =
         data.current.condition.icon;

    feelsLike.textContent =
        data.current.feelslike_c + "°C";

    humidity.textContent =
        data.current.humidity + "%";

    wind.textContent =
        data.current.wind_kph + " km/h";

    const forecastUrl=`https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${searchQuery}&days=3&aqi=no`;
    const forecastResponse = await fetch(forecastUrl);
    if(!forecastResponse.ok){
        throw new Error("Forecast data not available");
    }
    const forecastData = await forecastResponse.json();
    forecastContainer.innerHTML="";
    forecastData.forecast.forecastday.forEach(day=>{
        const forecastCard = document.createElement("div");
        forecastCard.className="forecast-card";
        forecastCard.innerHTML=`
                <h3>${new Date(day.date).toLocaleDateString("en-IN",{
                    day: "numeric",
                    month: "short"
                })}</h3>
                <img src="https:${day.day.condition.icon}" alt="Weather">
                <p>${day.day.condition.text}</p>
                <p>🌡️ ${day.day.avgtemp_c}°C</p>
                <p>⬆️ ${day.day.maxtemp_c}°C &nbsp; ⬇️ ${day.day.mintemp_c}°C </p>
                `;
                forecastContainer.appendChild(forecastCard);
    });
} catch (error) {

    loading.textContent = "";
   
    errorMessage.textContent =
    "Something went wrong. Please check the city name or your internet connection.";
    
    

    console.log(error);
}
});

cityInput.addEventListener("keypress", function (event) {

    if (event.key === "Enter") {
        searchBtn.click();
    }

});

const lastCity = localStorage.getItem("lastCity");
if(lastCity){
    cityInput.value=lastCity;
    searchBtn.click();
}

themeBtn.addEventListener("click",function(){
    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")){
        themeBtn.textContent = "☀️ Light Mode";
    } else {
        themeBtn.textContent = "🌙 Dark Mode";
    }
});

locationBtn.addEventListener("click",function(){
    if(!navigator.geolocation){
        alert("Geolocation is not supported by your browser.");
        return;
    }
    navigator.geolocation.getCurrentPosition(
        function(position){
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            const coordinates = `${latitude},${longitude}`;
            cityInput.value = coordinates;
            searchBtn.click();

        },
        function(error){
            alert("Unable to get your location.");
            console.log(error);
        }
    );
});