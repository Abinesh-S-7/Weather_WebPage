let apiKey = "e190392c9eef801bfbadd2f79d697f4e";
let countrySelect = document.getElementById("country-select");
let stateSelect = document.getElementById("state-select");
let citySelect = document.getElementById("city-select");

// Fetch all countries from REST Countries API
async function getCountries() {
    let response = await fetch("https://restcountries.com/v3.1/all");
    let countries = await response.json();

    // Sort countries alphabetically
    countries.sort((a, b) => a.name.common.localeCompare(b.name.common));

    // Populate country dropdown
    countries.forEach((country) => {
        let option = document.createElement("option");
        option.value = country.name.common;  // Use country name instead of code
        option.textContent = country.name.common;
        countrySelect.appendChild(option);
    });
}

// Fetch states based on selected country
async function getStates(countryName) {
    let response = await fetch("https://countriesnow.space/api/v0.1/countries/states", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country: countryName }),
    });

    let data = await response.json();

    if (!data.data || data.data.states.length === 0) {
        stateSelect.innerHTML = `<option value="">No states found</option>`;
        stateSelect.disabled = true;
        citySelect.innerHTML = `<option value="">Select a city</option>`;
        citySelect.disabled = true;
        return;
    }

    // Populate state dropdown
    stateSelect.innerHTML = `<option value="">🏛️ Select a state</option>`;
    stateSelect.disabled = false;

    data.data.states.forEach((state) => {
        let option = document.createElement("option");
        option.value = state.name;
        option.textContent = state.name;
        stateSelect.appendChild(option);
    });

    // Reset city dropdown
    citySelect.innerHTML = `<option value="">Select a city</option>`;
    citySelect.disabled = true;
}

// Fetch cities based on selected state
async function getCities(countryName, stateName) {
    let response = await fetch("https://countriesnow.space/api/v0.1/countries/state/cities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country: countryName, state: stateName }),
    });

    let data = await response.json();

    if (!data.data || data.data.length === 0) {
        citySelect.innerHTML = `<option value="">No cities found</option>`;
        citySelect.disabled = true;
        return;
    }

    // Populate city dropdown
    citySelect.innerHTML = `<option value="">🏙️ Select a city</option>`;
    citySelect.disabled = false;

    data.data.forEach((city) => {
        let option = document.createElement("option");
        option.value = city;
        option.textContent = city;
        citySelect.appendChild(option);
    });
}

// Event listener for country selection
countrySelect.addEventListener("change", () => {
    let selectedCountryName = countrySelect.value;
    
    if (selectedCountryName) {
        getStates(selectedCountryName);
        stateSelect.innerHTML = `<option value="">Select a state</option>`;
        stateSelect.disabled = true;
        citySelect.innerHTML = `<option value="">Select a city</option>`;
        citySelect.disabled = true;
    }
});

// Event listener for state selection
stateSelect.addEventListener("change", () => {
    let selectedState = stateSelect.value;
    let selectedCountryName = countrySelect.value;

    if (selectedState) {
        getCities(selectedCountryName, selectedState);
    } else {
        citySelect.innerHTML = `<option value="">Select a city</option>`;
        citySelect.disabled = true;
    }
});

// Event listener for city selection to fetch weather
citySelect.addEventListener("change", () => {
    let selectedCity = citySelect.value;
    if (selectedCity) {
        search(selectedCity, "", ""); // Calls existing search function
    }
});

// Initialize countries on page load
getCountries();


let searchinput = document.querySelector(`.searchinput`);

async function search(city, state, country){
    let url = await fetch(`https://api.openweathermap.org/data/2.5/weather?units=metric&q=${city},${state},${country}&appid=${apiKey}`);

    if(url.ok){
    let data = await url.json();
    console.log(data);
    
    let box = document.querySelector(".return");
    box.style.display = "block";

    let message = document.querySelector(".message");
    message.style.display = "none";

    let errormessage = document.querySelector( ".error-message");
        errormessage.style.display = "none";

    let weatherImg = document.querySelector(".weather-img");
    document.querySelector(".city-name").innerHTML = data.name;
    document.querySelector(".weather-temp").innerHTML = Math.floor(data.main.temp) + '°';
    document.querySelector(".wind").innerHTML = Math.floor(data.wind.speed) + " m/s";
    document.querySelector(".pressure").innerHTML = Math.floor(data.main.pressure) + " hPa";
    document.querySelector('.humidity').innerHTML = Math.floor(data.main.humidity)+ "%";
    document.querySelector(".sunrise").innerHTML =  new Date(data.sys.sunrise * 1000).toLocaleTimeString([], {hour:"2-digit", minute:"2-digit"});
    document.querySelector(".sunset").innerHTML =  new Date(data.sys.sunset * 1000).toLocaleTimeString([], {hour:"2-digit", minute:"2-digit"});

    if (data.weather[0].main === "Rain") {
        weatherImg.src = "img/rain.jpeg";
      } else if (data.weather[0].main === "Clear") {
        weatherImg.src = "img/sun.jpeg";
      } else if (data.weather[0].main === "Snow") {
        weatherImg.src = "img/snow.png";
      } else if (
        data.weather[0].main === "Clouds" ||
        data.weather[0].main === "Smoke"
      ) {
        weatherImg.src = "img/cloud.jpeg";
      } else if (
        data.weather[0].main === "Mist" ||
        data.weather[0].main === "Fog"
      ) {
        weatherImg.src = "img/mist.png";
      } else if (data.weather[0].main === "Haze") {
        weatherImg.src = "img/haze.png";
      }
    }else{
        let box = document.querySelector(".return");
    box.style.display = "none";

    let message = document.querySelector(".message");
    message.style.display = "none";

    let errormessage = document.querySelector( ".error-message");
        errormessage.style.display = "block";
    }
}


searchinput.addEventListener('keydown', function(event) {
    if (event.keyCode === 13 || event.which === 13) {
        search(searchinput.value);
        console.log("worked")
      }
  });