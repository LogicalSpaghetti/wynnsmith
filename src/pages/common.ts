export function setPageName(name: string) {

    document.title = name;
}

export function setPageIcon(href: string) {
    let icon = document.querySelector("link[rel='icon']") as HTMLLinkElement;
    if (!icon) {
        icon = document.createElement("link");
        icon.rel = "icon";
        document.head.appendChild(icon);
    }
    icon.href = href;
}
