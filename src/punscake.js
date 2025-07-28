`use strict`;

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

function renderHoverTooltip(innerHTML = "", containerId = "cursorTooltip") {
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
