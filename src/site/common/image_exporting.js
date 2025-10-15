export function copyImageById(elementId) {
    copyImageOfElement(document.getElementById(elementId));
}

export function saveImageById(elementId) {
    saveImageOfElement(document.getElementById(elementId));
}

// TODO: doesn't work since switching to modules
function copyImageOfElement(element) {
    window.html2canvas(element, {backgroundColor: null}).then((canvas) => {
        canvas.toBlob((blob) => {
            navigator.clipboard.write([new ClipboardItem({"image/png": blob})]);
        }, "image/png");
    });
}

function saveImageOfElement(element) {
    window.html2canvas(element, {backgroundColor: null}).then((canvas) => {
        const dataURL = canvas.toDataURL("image/png");

        const link = document.createElement("a");
        link.href = dataURL;
        link.download = "canvas-image.png";

        link.click();
    });
}
