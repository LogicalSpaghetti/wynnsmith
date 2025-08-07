`use strict`;

function copyImageById(elementId) {
    copyImageOfElement(document.getElementById(elementId));
}

function saveImageById(elementId) {
    saveImageOfElement(document.getElementById(elementId));
}

function copyImageOfElement(element) {
    html2canvas(element, {backgroundColor: null}).then((canvas) => {
        canvas.toBlob((blob) => {
            navigator.clipboard.write([new ClipboardItem({"image/png": blob})]);
        }, "image/png");
    });
}

function saveImageOfElement(element) {
    html2canvas(element, {backgroundColor: null}).then((canvas) => {
        const dataURL = canvas.toDataURL("image/png");

        const link = document.createElement("a");
        link.href = dataURL;
        link.download = "canvas-image.png";

        link.click();
    });
}
