function initTooltip(containerId: string) {
    let cursorTooltip = document.getElementById(containerId);
    if (!cursorTooltip) {
        cursorTooltip = document.createElement("div");
        cursorTooltip.id = "cursorTooltip";
        cursorTooltip.classList.add("minecraftTooltip");
        cursorTooltip.hidden = true;
        document.body.appendChild(cursorTooltip);
    }

    document.addEventListener("mousemove", (e) =>
        moveTooltip(e.clientX, e.clientY, containerId, true));
    document.addEventListener("wheel", () => hideHoverTooltip());

    return cursorTooltip;
}

function getTooltip(containerId: string) {
    return document.getElementById(containerId) ?? initTooltip(containerId);
}

function moveTooltip(X: number, Y: number, containerId: string, checkHidden = false) {
    let cursorTooltip = getTooltip(containerId);

    if (checkHidden && cursorTooltip.hidden) return;

    let scale = 1;
    if (cursorTooltip.offsetWidth + 24 > window.innerWidth)
        scale = (window.innerWidth - 24) / cursorTooltip.offsetWidth;
    cursorTooltip.style.transform = `scale(${scale})`;

    let leftOffset = (X + cursorTooltip.offsetWidth + 12) > window.innerWidth ? window.innerWidth - cursorTooltip.offsetWidth - 12 : X + 5;
    leftOffset = Math.max(leftOffset, 12);

    let upOffset = Y + 2;
    if (Y > (window.innerHeight / 2)) {
        upOffset = Y - cursorTooltip.offsetHeight - 2;
        cursorTooltip.style.transformOrigin = `bottom left`;
    } else
        cursorTooltip.style.transformOrigin = `top left`;

    cursorTooltip.style.top = `${upOffset}px`;
    cursorTooltip.style.left = `${leftOffset}px`;
}

export function renderHoverTooltip(innerHTML = "", containerId = "cursorTooltip") {
    if (innerHTML === "") return;

    const container = getTooltip(containerId);

    container.hidden = false;
    container.innerHTML = innerHTML;
}

export function hideHoverTooltip(containerId = "cursorTooltip") {
    const container = getTooltip(containerId);

    container.hidden = true;
    container.innerHTML = "";
}
