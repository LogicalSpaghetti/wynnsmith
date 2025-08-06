`use strict`;

// TODO: not abstract enough at all
window.addEventListener("load", function () {
    const search = window.location.search.substring(1, window.location.search.length)
        .replaceAll("%20", " ").replaceAll("_", " ").replaceAll("%27", "'").replaceAll("+", " ");
    const item = getItem(search);
    const display = document.getElementById("output");

    document.title = "WynnSearch: " + search;

    display.innerHTML = getHoverHTMLForItem(item, "Invalid Item!")

    html2canvas(display, {backgroundColor: null}).then((canvas) => {
        canvas.id = "canvas";
        canvas.style.display = "none";
        document.body.appendChild(canvas);
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "c") {
            event.preventDefault();
            copyImage();
        }
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "s") {
            event.preventDefault();
            saveImage();
        }
    });
});

function saveImage() {
    const canvas = document.getElementById("canvas");
    const dataURL = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "canvas-image.png";

    link.click();
}

function copyImage() {
    const canvas = document.getElementById("canvas");
    canvas.toBlob((blob) => {
        navigator.clipboard.write([new ClipboardItem({"image/png": blob})]);
    }, "image/png");
}
