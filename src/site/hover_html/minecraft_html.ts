import * as codeDictionary from "../../js_data/code_dictionary.ts";

export function minecraftAsElement(text: string, minecraftFont = false) {
    const htmlText = minecraftToHTML(text);
    const span = document.createElement("span");
    span.innerHTML = htmlText;
    if (minecraftFont) span.classList.add("font-minecraft");
    return span;
}

export function minecraftToHTML(text = "") {

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

            if (decoration != null && codeDictionary.decoration[decoration] != null) pendingTextDecorations[decoration] = true;

            if (style != null && codeDictionary.style[style] != null) pendingTextStyles[style] = true;

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

                for (let decoration of decorations) pendingContent += " " + codeDictionary.decoration[decoration];

                pendingContent += "; text-decoration-thickness: 2px;\"";
            }

            if (bUseStyles) {
                pendingContent += " class=\"";
                for (let style of styles) pendingContent += " " + codeDictionary.style[style];
                pendingContent += "\"";
            }

            pendingContent += `>${anyToHTML(content)}`;

        });


        if (pendingContent.length === 0) return;

        const color = colorSplit["color"];

        if (color != null) if (codeDictionary.color[color] != null) result += `<span style="color:${codeDictionary.color[color]}">`; else result += `<span style="color:${sanitizeHTML(color)}">`; else result += "<span>";

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

        if (!codeDictionary.minecraftDelimiters[char]) {
            result[result.length - 1]["content"] += char;
            continue;
        }

        i++;
        if (i >= string.length) continue;

        let code = string[i];

        if (code in codeDictionary.color) result.push({color: code, content: ""});

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

        if (!codeDictionary.minecraftDelimiters[char]) {
            result[result.length - 1]["content"] += char;
            continue;
        }

        i++;
        const code = string[i];

        if (code in codeDictionary.style) result.push({style: code, content: ""});

        else if (code in codeDictionary.decoration) result.push({decoration: code, content: ""});
    }
    if (i < string.length && !codeDictionary.minecraftDelimiters[string[string.length - 1]]) result[result.length - 1]["content"] += string[string.length - 1];

    return result;
}

function sanitizeHTML(text) {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export function insertStringBeforeSelected(insertString) {
    const activeElement = document.activeElement;
    if (!activeElement || !(activeElement.type === "textarea" || activeElement.type === "text")) {
        return;
    }

    if (activeElement.maxLength != null && activeElement.maxLength > -1 && activeElement.value.length + insertString.length > activeElement.maxLength) {
        return;
    }

    const currentValue = activeElement.value;
    const cursorPosition = activeElement.selectionStart;

    activeElement.value = currentValue.substring(0, cursorPosition) + insertString + currentValue.substring(cursorPosition, currentValue.length);

    activeElement.selectionStart = cursorPosition + insertString.length;
    activeElement.selectionEnd = activeElement.selectionStart;

    activeElement.dispatchEvent(new Event("input"));
}

export class SectionedText {
    private sections: TextSection[] = [];

    constructor(section?: string) {
        if (section !== undefined) this.addSection(section);
    }

    static of(...lines: string[]) {
        return new SectionedText().addSections(...lines);
    }

    addSection(arg: string | TextSection): this {
        if (typeof arg === "string" && arg.length === 0) return this;

        const section = typeof arg === "string"
            ? new TextSection(arg) : arg;

        if (!section.isEmpty()) this.sections.push(section);
        return this;
    }

    addSections(...sections: (string | TextSection)[]): this {
        for (const section of sections) this.addSection(section);
        return this;
    }

    addIf(condition: unknown, builder: () => string | TextSection): this {
        if (!condition) return this;
        return this.addSection(builder());
    }

    addManyIf(condition: unknown, builder: () => (string | TextSection)[]): this {
        if (!condition) return this;
        return this.addSections(...builder());
    }

    appendToLast(...lines: string[]): this {
        if (this.sections.length !== 0)
            this.sections[this.sections.length - 1].addLines(...lines);
        return this;
    }

    appendToLastIf(condition: unknown, ...lines: string[]) {
        if (!condition) return this;
        return this.appendToLast(...lines);
    }

    toString() {
        return this.sections.join("\n\n");
    }

    toMinecraftHTML() {
        return minecraftToHTML(this.toString());
    }
}

export class TextSection {
    private lines: string[] = [];

    constructor(string?: string) {
        if (string !== undefined) this.addLine(string);
    }

    static of(...lines: string[]) {
        return new TextSection().addLines(...lines);
    }

    addLine(line: string): this {
        if (line.length > 0) this.lines.push(line);
        return this;
    }

    addLines(...lines: string[]): this {
        for (const line of lines) this.addLine(line);
        return this;
    }

    addIf(condition: unknown, builder: () => string): this {
        if (!condition) return this;
        return this.addLine(builder());
    }

    addManyIf(condition: unknown, builder: () => string[]): this {
        if (!condition) return this;
        return this.addLines(...builder());
    }

    toString() {
        return this.lines.join("\n");
    }

    isEmpty() {
        return this.lines.length === 0;
    }
}

export function stripMinecraftFormatting(text = "") {
    let result = "";

    const colorSplitArr = splitByColorFormats(text);

    colorSplitArr.forEach(colorSplit => {
        const formatSplitArr = splitByOtherFormats(colorSplit["content"]);

        formatSplitArr.forEach(formatSplit => {
            result += formatSplit["content"];
        });
    });

    return result;
}