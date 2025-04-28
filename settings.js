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
    document.querySelector("#content").classList.toggle("hide_section");
    document.querySelector("#settings").classList.toggle("hide_section");
}

function hideSettings() {
    if (!document.querySelector("#settings").classList.contains("hide_section")) {
        toggleSettingsHide();
    }
}

document.querySelector("#selv").addEventListener("click", function () {
    selvs = !selvs;
    refreshBuild();
});
