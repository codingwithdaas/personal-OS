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
    for (var i = 0; i < category.items.length; i++) {
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
showCategory(0); // Show the first category by default