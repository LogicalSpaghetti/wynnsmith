function displayFinalValues(build) {
    displayStats(build);
}

function displayStats(build) {
    output.textContent = JSON.stringify(build)
        .replaceAll(",", ",\n")
        .replaceAll("{", "{\n")
        .replaceAll("}", "\n}")
        .replaceAll("[", "[\n")
        .replaceAll("]", "\n]");
}

function displayDamageValues(build) {}
