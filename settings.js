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
    localStorage.setItem("selvs", localStorage.getItem("selvs") !== "true");
    refreshBuild();
});

document.getElementById("damage_detail").addEventListener("click", function () {
    localStorage.setItem("damage_detail", localStorage.getItem("damage_detail") !== "true");
    refreshBuild();
});

function selvs() {
    return localStorage.getItem("selvs") === "true";
}

function showDetailedDamage() {
    return localStorage.getItem("damage_detail") === "true";
}
