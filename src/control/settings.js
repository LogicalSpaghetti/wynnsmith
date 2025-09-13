export function toggleSettingsHide() {
    document.getElementById("content").classList.toggle("hide_section");
    document.getElementById("settings").classList.toggle("hide_section");
}

export function hideSettings() {
    if (!document.getElementById("settings").classList.contains("hide_section")) {
        toggleSettingsHide();
    }
}

export function loadBoolean(id) {
    return localStorage.getItem(id) === "true";
}

export function toggleBoolean(id) {
    localStorage.setItem(id, String(localStorage.getItem(id) !== "true"));
}

export function saveString(location, string) {
    localStorage.setItem(location, string);
}

export function loadString(location) {
    return localStorage.getItem(location);
}