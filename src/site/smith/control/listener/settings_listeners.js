import * as settings from "../../logic/settings.js";
import {refreshBuild} from "../script.js";
import {loadBoolean, toggleBoolean} from "../../logic/settings.js";
import {add, dispatch} from "../../../../common/event_listener.js";

export function addSettingsListeners() {
    initCheckbox("selvs");
    initCheckbox("detailed_damage");

    const miku = document.getElementById("miku");
    miku.src = settings.loadString("miku");
    add("gif_input", "change", (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const src = reader.result;
            miku.src = src;
            settings.saveString("miku", src);
        };
    });

    add("opacity_slider", "input", (event) => {
        document.getElementById("miku").style.opacity = event.target.value + "%";
    });
    dispatch("opacity_slider", "input");
}

function initCheckbox(elementId, boolId = elementId, extraCode = () => refreshBuild()) {
    const checkbox = document.getElementById(elementId);
    checkbox.addEventListener("click", () => {
        toggleBoolean(boolId);
        extraCode();
    });
    checkbox.checked = loadBoolean(boolId);
}
