// call on initialization to add a Cursor Tooltip to the document
function addTooltipListener() {
    initTooltip()

    //Attaches a div to a cursor, used to display content
    document.addEventListener("mousemove", (e) => {
        moveTooltip(e.clientX, e.clientY, true);
    });

    document.addEventListener("wheel", () => hideHoverAbilityTooltip());
}

function initTooltip() {
    let cursorTooltip = document.getElementById("cursorTooltip");
    if (!cursorTooltip) {
        cursorTooltip = document.createElement("div");
        cursorTooltip.id = "cursorTooltip";
        cursorTooltip.classList.add("minecraftTooltip");
        cursorTooltip.hidden = true;
        document.body.appendChild(cursorTooltip);
    }
}

function moveTooltip(X, Y, checkHidden = false) {
    let cursorTooltip = document.getElementById("cursorTooltip");

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

function renderHoverTooltip(innerHTML = "", container_id = "cursorTooltip") {
    const container = document.getElementById(container_id);

    if (innerHTML === "") return;

    container.hidden = false;

    container.innerHTML = innerHTML;
}

function hideHoverAbilityTooltip(container_id = "cursorTooltip") {
    const container = document.getElementById(container_id);

    container.hidden = true;
    container.innerHTML = "";
}