`use strict`;

function resetWarnings() {
    const warningsDiv = document.getElementById('warnings');
    warningsDiv.innerHTML = "";
}

function addWarning(text) {
    const warningDiv = document.createElement('div');
    warningDiv.textContent = `Error: ${text}`;
    console.log(warningDiv);
    document.getElementById("warnings").appendChild(warningDiv);
}
