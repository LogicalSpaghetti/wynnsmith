export function resetWarnings() {
    const warningsDiv = document.getElementById('warnings');
    warningsDiv.innerHTML = "";
}

export function addWarning(text) {
    const warningDiv = document.createElement('div');
    warningDiv.textContent = `Error: ${text}`;
    document.getElementById("warnings").appendChild(warningDiv);
}
