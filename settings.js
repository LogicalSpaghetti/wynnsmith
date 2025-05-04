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

function selvs() {
    return localStorage.getItem("selvs") === "true";
}
