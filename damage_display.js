const attackSection = document.querySelector("#attacks");

function addDamageDisplays(build) {
    const sigma = document.createElement("pre");
    sigma.textContent = JSON.stringify(build.attacks)
        .replaceAll(',"', ',\n"')
        .replaceAll("{", "{\n")
        .replaceAll("}", "\n}")
        .replaceAll("[", "[\n")
        .replaceAll("]", "\n]")
        .replaceAll("{\n\n}", "{}")
        .replaceAll("[\n\n]", "[]");
    attackSection.appendChild(sigma);
}
