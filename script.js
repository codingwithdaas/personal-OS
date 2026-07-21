// --- Clock ---
function updateTime() {
    var currentTime = new Date().toLocaleString();
    var timeText = document.querySelector("#timeElement");
    timeText.innerHTML = currentTime;
}
setInterval(updateTime, 1000);

// --- Dragging ---
function dragElement(element) {
    var initialX = 0;
    var initialY = 0;
    var currentX = 0;
    var currentY = 0;

    if (document.getElementById(element.id + "Header")) {
        document.getElementById(element.id + "Header").onmousedown = startDragging;
    } else {
        element.onmousedown = startDragging;
    }

    function startDragging(e) {
        e = e || window.event;
        e.preventDefault();
        initialX = e.clientX;
        initialY = e.clientY;
        document.onmouseup = stopDragging;
        document.onmousemove = dragElement;
    }

    function dragElement(e) {
        e = e || window.event;
        e.preventDefault();
        currentX = initialX - e.clientX;
        currentY = initialY - e.clientY;
        initialX = e.clientX;
        initialY = e.clientY;

        var newTop = element.offsetTop - currentY;
        var minTop = topBar.offsetHeight;

        if (newTop < minTop) {
            newTop = minTop;
        }

        element.style.top = newTop + "px";
        element.style.left = (element.offsetLeft - currentX) + "px";
    }

    function stopDragging() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

// --- Open / Close ---
var biggestIndex = 1;
var topBar = document.querySelector("#topbar");

function closeWindow(element) {
    element.style.display = "none";
}

function openWindow(element) {
    element.style.display = "block";
    biggestIndex++;
    element.style.zIndex = biggestIndex;
    topBar.style.zIndex = biggestIndex + 1;
}

// --- Window stacking (z-index) ---
function handleWindowTap(element) {
    biggestIndex++;
    element.style.zIndex = biggestIndex;
    topBar.style.zIndex = biggestIndex + 1;
}

function addWindowTapHandling(element) {
    element.addEventListener("mousedown", function() {
        handleWindowTap(element);
    });
}

// --- Icon selection ---
var selectedIcon = undefined;

function selectIcon(element) {
    element.classList.add("selected");
    selectedIcon = element;
}

function deselectIcon(element) {
    element.classList.remove("selected");
    selectedIcon = undefined;
}

function handleIconTap(element) {
    if (element.classList.contains("selected")) {
        deselectIcon(element);
    } else {
        selectIcon(element);
    }
}

// --- Window initialization ---
function initializeWindow(id, icon) {
    var screen = document.querySelector("#" + id);
    var closeButton = document.querySelector("#" + id + "close");

    dragElement(screen);
    addWindowTapHandling(screen);

    closeButton.addEventListener("click", function() {
        closeWindow(screen);
        if (icon) {
            deselectIcon(icon);
        }
    });

    return screen;
}

// --- Welcome window ---
var welcomeScreen = initializeWindow("welcome");

document.querySelector("#welcomeopen").addEventListener("click", function() {
    openWindow(welcomeScreen);
});

// --- Slice of Life window ---
var sliceOfLifeIcon = document.querySelector("#sliceOfLifeIcon");
var sliceOfLifeScreen = initializeWindow("sliceOfLife", sliceOfLifeIcon);

sliceOfLifeIcon.addEventListener("click", function() {
    handleIconTap(sliceOfLifeIcon);
    openWindow(sliceOfLifeScreen);
});

var sliceOfLifeContent = [
    {
        title: "Foods",
        items: ["Pizza", "Shahi Paneer", "Burritos", "Crunchwraps", "Malai Kofta"]
    },
    {
        title: "Hobbies",
        items: ["Going on walks", "Watching TV shows", "Talking to friends and family", "Pondering", "Going down rabbit holes"]
    },
    {
        title: "Entertainment",
        items: ["Harry Potter", "Minecraft", "Dragon Ball Z & Super", "Attack on Titan", "Pokémon"]
    }
];

function showCategory(index) {
    var contentArea = document.querySelector("#contentArea");
    var category = sliceOfLifeContent[index];

    var listHTML = "<ul>";
    for (let i = 0; i < category.items.length; i++) {
        listHTML += "<li>" + category.items[i] + "</li>";
    }
    listHTML += "</ul>";

    contentArea.innerHTML = "<h2>" + category.title + "</h2>" + listHTML;
}

function buildSidebar() {
    var sidebar = document.querySelector("#sidebar");

    for (let i = 0; i < sliceOfLifeContent.length; i++) {
        var button = document.createElement("div");
        button.innerHTML = sliceOfLifeContent[i].title;
        button.classList.add("sidebar-item");

        button.addEventListener("click", function() {
            showCategory(i);
        });

        sidebar.appendChild(button);
    }
}

buildSidebar();
showCategory(0);

// --- Weather-O-Meter window ---
var weatherOMeterIcon = document.querySelector("#weatherOMeterIcon");
var weatherOMeterScreen = initializeWindow("weatherOMeter", weatherOMeterIcon);

weatherOMeterIcon.addEventListener("click", function() {
    handleIconTap(weatherOMeterIcon);
    openWindow(weatherOMeterScreen);
});

// Maps Open-Meteo's numeric weather codes to plain-English descriptions
var weatherCodeMap = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    71: "Slight snow",
    73: "Moderate snow",
    75: "Heavy snow",
    80: "Rain showers",
    95: "Thunderstorm",
    99: "Thunderstorm with hail"
};

function showWeatherResult(place) {
    var resultBox = document.querySelector("#weatherResult");
    var displayName = place.name + (place.country ? ", " + place.country : "");

    resultBox.innerHTML = "<p>Loading weather for " + displayName + "...</p>";

    var weatherURL = "https://api.open-meteo.com/v1/forecast?latitude=" + place.latitude + "&longitude=" + place.longitude + "&current_weather=true";

    fetch(weatherURL)
        .then(function(response) {
            return response.json();
        })
        .then(function(weatherData) {
            var current = weatherData.current_weather;
            var description = weatherCodeMap[current.weathercode] || "Unknown conditions";

            resultBox.innerHTML =
                "<h3>" + displayName + "</h3>" +
                "<p>" + current.temperature + "°C</p>" +
                "<p>" + description + "</p>" +
                "<p>Wind: " + current.windspeed + " km/h</p>";
        })
        .catch(function(error) {
            resultBox.innerHTML = "<p>Could not load weather data.</p>";
        });
}

function showSuggestions(places) {
    var suggestionsBox = document.querySelector("#citySuggestions");
    suggestionsBox.innerHTML = "";

    for (let i = 0; i < places.length; i++) {
        var place = places[i];
        var item = document.createElement("div");
        item.classList.add("suggestion-item");
        item.innerHTML = place.name + (place.country ? ", " + place.country : "");

        item.addEventListener("click", function() {
            document.querySelector("#cityInput").value = place.name;
            suggestionsBox.innerHTML = "";
            showWeatherResult(place);
        });

        suggestionsBox.appendChild(item);
    }
}

var debounceTimer;

document.querySelector("#cityInput").addEventListener("input", function() {
    var city = this.value.trim();
    var suggestionsBox = document.querySelector("#citySuggestions");

    clearTimeout(debounceTimer);

    if (city === "") {
        suggestionsBox.innerHTML = "";
        return;
    }

    debounceTimer = setTimeout(function() {
        var geocodeURL = "https://geocoding-api.open-meteo.com/v1/search?name=" + encodeURIComponent(city) + "&count=5";

        fetch(geocodeURL)
            .then(function(response) {
                return response.json();
            })
            .then(function(geoData) {
                if (geoData.results && geoData.results.length > 0) {
                    showSuggestions(geoData.results);
                } else {
                    suggestionsBox.innerHTML = "<p>No suggestions found.</p>";
                }
            });
    }, 300);
});

document.querySelector("#searchButton").addEventListener("click", function() {
    var city = document.querySelector("#cityInput").value.trim();
    if (city === "") return;

    var geocodeURL = "https://geocoding-api.open-meteo.com/v1/search?name=" + encodeURIComponent(city) + "&count=1";

    fetch(geocodeURL)
        .then(function(response) {
            return response.json();
        })
        .then(function(geoData) {
            if (geoData.results && geoData.results.length > 0) {
                document.querySelector("#citySuggestions").innerHTML = "";
                showWeatherResult(geoData.results[0]);
            } else {
                document.querySelector("#weatherResult").innerHTML = "<p>City not found. Try another search.</p>";
            }
        });
});

document.querySelector("#cityInput").addEventListener("keydown", function(e) {
    if (e.key === "Enter") {
        document.querySelector("#searchButton").click();
    }
});