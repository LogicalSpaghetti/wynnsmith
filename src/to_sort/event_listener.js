// TODO: this is over-abstraction, remove.

export function add(id, type, lambda) {
    document.getElementById(id).addEventListener(type, lambda);
}

export function addElem(element, type, lambda) {
    element.addEventListener(type, lambda);
}

export function addAll(className, type, lambda) {
    document.querySelectorAll(`.${className}`)
        .forEach(el => el.addEventListener(type, lambda));
}

export function addAllElem(elements, type, lambda) {
    elements.forEach(el => el.addEventListener(type, lambda));
}

export function dispatch(id, eventName) {
    document.getElementById(id).dispatchEvent(new Event(eventName));
}
