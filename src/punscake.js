const codeDictionaryGenericSymbols = {
    "mana": "§b✺",

    "damage": "§c⚔",
    "neuteral": "§6✣",
    "earth": "§2✤",
    "thunder": "§e✦",
    "water": "§b❉",
    "fire": "§c✹",
    "air": "§f❋",

    "effect": "§e✧",
    "duration": "§d⌛",
    "AoE": "§3☀",
    "range": "§a➼",
    "cooldown": "§3⌚",
    "heal": "§d❤",
    "blindness": "§c⬣",
    "slowness": "§c⬤",
};
const codeDictionaryClassSymbols = {
    "focus": "§e➽",

    "winded": "§b≈",
    "dilation": "§3➲",

    "resistance": "§a❁",
    "corrupted": "§4☠",
    "armorbreak": "§c✃",
    "sacred": "§6✧",
    "provoke": "§4💢",
    "invincibility": "§b☗",

    "marked": "§c✜",
    "clone": "§5",

    "puppet": "§6⚘",
    "whipped": "§6⇶",
    "awakened": "§f♚",
    "bloodpool": "§4⚕",
    "bleeding": "§c",
};
const codeDictionaryCommonAbilityAttributes = {

    "manacost": ["§b✺", "\n§b✺ §7Mana Cost: §f_"],

    "damage": ["§c⚔", "\n§c⚔ §7Total Damage: §f_% §8(of your DPS)"],
    "neuteral": ["§6✣", "\n   §8(§6✣ §8Damage: _%)"],
    "earth": ["§2✤", "\n   §8(§2✤ §8Earth: _%)"],
    "thunder": ["§e✦", "\n   §8(§e✦ §8Thunder: _%)"],
    "water": ["§b❉", "\n   §8(§b❉ §8Water: _%)"],
    "fire": ["§c✹", "\n   §8(§c✹ §8Fire: _%)"],
    "air": ["§f❋", "\n   §8(§f❋ §8Air: _%)"],

    "effect": ["§e✧", "\n§e✧ §7Effect: §f_"],
    "duration": ["§d⌛", "\n§d⌛ §7Duration: §f_s"],
    "range": ["§a➼", "\n§a➼ §7Range: §f_ Blocks"],
    "AoE": ["§3☀", "\n§3☀ §7Area of Effect: §f_ Blocks §7(Circle-Shaped)"],
    "cooldown": ["§3⌚", "\n§3⌚ §7Cooldown: §f_s"],
};

const codeDictionaryColor = {
    "0": "#000000",
    "1": "#0000AA",
    "2": "#00AA00",
    "3": "#00AAAA",
    "4": "#AA0000",
    "5": "#AA00AA",
    "6": "#FFAA00",
    "7": "#AAAAAA",
    "8": "#555555",
    "9": "#5555FF",
    "a": "#55FF55",
    "b": "#55FFFF",
    "c": "#FF5555",
    "d": "#FF55FF",
    "e": "#FFFF55",
    "f": "#FFFFFF",
    "r": null,
};

const codeDictionaryRarityColor = {
    "common": "§f",
    "unique": "§e",
    "set": "§a",
    "rare": "§d",
    "legendary": "§b",
    "fabled": "§c",
    "mythic": "§5",
    "crafted": "§3",
};

const codeDictionaryItemRequirementMetIndicators = {
    "true": "§a✔",
    "false": "§c✖",
};

const codeDictionaryDecoration = {
    "m": "line-through", "n": "underline",
};
const codeDictionaryStyle = {
    "l": "fw-bold", "o": "fst-italic",
};

const minecraftDelimiters = {"§": true, "&": true};
const preferredDelimiter = "§";

function minecraftToHTML(text = "") {

    let result = "";

    const colorSplitArr = splitByColorFormats(text);

    colorSplitArr.forEach(colorSplit => {

        let pendingContent = "";

        let spansToClose = 0;
        let pendingTextDecorations = {};
        let pendingTextStyles = {};

        const formatSplitArr = splitByOtherFormats(colorSplit["content"]);

        formatSplitArr.forEach(formatSplit => {

            const decoration = formatSplit["decoration"];
            const style = formatSplit["style"];
            const content = formatSplit["content"];

            if (decoration != null && codeDictionaryDecoration[decoration] != null) pendingTextDecorations[decoration] = true;

            if (style != null && codeDictionaryStyle[style] != null) pendingTextStyles[style] = true;

            if (content == null || content === "") return;


            pendingContent += "<span";
            spansToClose++;
            const decorations = Object.keys(pendingTextDecorations);
            const styles = Object.keys(pendingTextStyles);
            pendingTextDecorations = {};
            pendingTextStyles = {};
            const bUseDecorations = decorations.length > 0;
            const bUseStyles = styles.length > 0;

            if (bUseDecorations) {
                pendingContent += " style=\"text-decoration:";

                for (let decoration of decorations) pendingContent += " " + codeDictionaryDecoration[decoration];

                pendingContent += "; text-decoration-thickness: 2px;\"";
            }

            if (bUseStyles) {
                pendingContent += " class=\"";
                for (let style of styles) pendingContent += " " + codeDictionaryStyle[style];
                pendingContent += "\"";
            }

            pendingContent += `>${anyToHTML(content)}`;

        });


        if (pendingContent.length === 0) return;

        const color = colorSplit["color"];

        if (color != null) if (codeDictionaryColor[color] != null) result += `<span style="color:${codeDictionaryColor[color]}">`; else result += `<span style="color:${sanitizeHTML(color)}">`; else result += "<span>";

        result += pendingContent;

        for (spansToClose; spansToClose >= 0; spansToClose--) result += "</span>";

    });
    return result;
}

function anyToHTML(text = "") {
    return sanitizeHTML(text).replace(/\r\n|\r|\n/g, "<br>").replace(/ /g, "&nbsp;").replace(/-/g, "-&#8288;");
}

function splitByColorFormats(string) {

    let result = [{
        color: null, content: "",
    }];

    if (string === "") return result;

    let i = 0;
    for (i; i < string.length; i++) {

        let char = string[i];

        if (!minecraftDelimiters[char]) {
            result[result.length - 1]["content"] += char;
            continue;
        }

        i++;
        if (i >= string.length) continue;

        let code = string[i];

        if (code in codeDictionaryColor) result.push({color: code, content: ""});

        else if (code === "#" && string.length - i >= 7) {
            const endOfColorCode = i + 6;
            for (i; i < endOfColorCode; i++) {
                code += string[i + 1];
            }
            result.push({color: code, content: ""});

        } else result[result.length - 1]["content"] += char + code;
    }

    return result;

}

function splitByOtherFormats(string = "") {

    let result = [
        {decoration: null, style: null, content: ""},
    ];

    if (string.length === 0) return result;

    let i = 0;
    for (i; i < string.length - 1; i++) {
        const char = string[i];

        if (!minecraftDelimiters[char]) {
            result[result.length - 1]["content"] += char;
            continue;
        }

        i++;
        const code = string[i];

        if (code in codeDictionaryStyle) result.push({style: code, content: ""});

        else if (code in codeDictionaryDecoration) result.push({decoration: code, content: ""});
    }
    if (i < string.length && !minecraftDelimiters[string[string.length - 1]]) result[result.length - 1]["content"] += string[string.length - 1];

    return result;
}

function sanitizeHTML(text) {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function renderHoverAbilityTooltip(innerHTML = "", containerId = "cursorTooltip") {

    const container = document.getElementById(containerId);

    if (innerHTML === "") return;

    container.hidden = false;

    container.innerHTML = innerHTML;
}

function hideHoverAbilityTooltip(containerId = "cursorTooltip") {
    const container = document.getElementById(containerId);

    container.hidden = true;
    container.innerHTML = "";
}

function insertStringBeforeSelected(insertString) {
    const activeElement = document.activeElement;
    console.log(activeElement);
    if (!activeElement || !(activeElement.type === "textarea" || activeElement.type === "text")) {
        return;
    }

    if (activeElement.maxLength != null && activeElement.maxLength > -1 && activeElement.value.length + insertString.length > activeElement.maxLength) {
        return;
    }
    console.log("all the right things are right");

    const currentValue = activeElement.value;
    const cursorPosition = activeElement.selectionStart;

    activeElement.value = currentValue.substring(0, cursorPosition) + insertString + currentValue.substring(cursorPosition, currentValue.length);

    activeElement.selectionStart = cursorPosition + insertString.length;
    activeElement.selectionEnd = activeElement.selectionStart;

    activeElement.dispatchEvent(new Event("input"));
}
