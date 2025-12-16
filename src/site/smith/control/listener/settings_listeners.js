import * as settings from "../settings.js";
import {refreshBuild} from "../../script.js";
import {loadBoolean, toggleBoolean} from "../settings.js";
import {add, dispatch} from "../../../common/event_listener.js";
import runTests from "../../../../test/test.js";

export function addSettingsListeners() {
    initCheckbox("selvs");
    initCheckbox("detailed_damage");

    const miku = document.getElementById("miku");
    miku.src = settings.loadString("miku");
    add("gif_input", "change", (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const src = reader.result;
            miku.src = src;
            settings.saveString("miku", src);
        };
    });

    add("opacity_slider", "input", (e) =>
        document.getElementById("miku").style.opacity = e.target.value + "%");
    dispatch("opacity_slider", "input");

    add("run_tests", "click", runTests);
}

function initCheckbox(elementId, boolId = elementId, extraCode = () => refreshBuild()) {
    const checkbox = document.getElementById(elementId);
    checkbox.addEventListener("click", () => {
        toggleBoolean(boolId);
        extraCode();
    });
    checkbox.checked = loadBoolean(boolId);
}
