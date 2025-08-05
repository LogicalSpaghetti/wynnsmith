document.querySelectorAll(".settings_toggle").forEach((t) =>
    t.addEventListener("click", function () {
        toggleSettingsHide();
    })
);

document.addEventListener("keyup", (e) => {
    if (e.key === "Escape") {
        hideSettings();
    }
});

function toggleSettingsHide() {
    document.getElementById("content").classList.toggle("hide_section");
    document.getElementById("settings").classList.toggle("hide_section");
}

function hideSettings() {
    if (!document.getElementById("settings").classList.contains("hide_section")) {
        toggleSettingsHide();
    }
}

document.getElementById("selv").addEventListener("click", function () {
    toggleBoolean("selvs");
    refreshBuild();
});

document.getElementById("detailed_damage").addEventListener("click", function () {
    toggleBoolean("detailed_damage");
    refreshBuild();
});

function getBoolean(id) {
    return localStorage.getItem(id) === "true";
}

function toggleBoolean(id) {
    localStorage.setItem(id, localStorage.getItem(id) !== "true");
}

function writeString(location, string) {
    localStorage.setItem(location, string);
}

function readString(location) {
    return localStorage.getItem(location);
}