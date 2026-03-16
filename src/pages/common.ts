import yayIcon from '../../assets/img/icons/yay.png';
import treeSmithIcon from '../../assets/img/icons/wynntree.png';
import itemSearchIcon from '../../assets/img/icons/glass.png';
import wynnpoolIcon from '../../assets/img/icons/wynnpool.ico';
import wynnabilityIcon from '../../assets/img/icons/wynnability_clear.png';

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

// TODO: phase out
export function renderAppString(content: string): void {
    getApp().innerHTML = content;
}

export function renderApp(...elements: (Node)[]) {
    const app = getApp();

    const content = document.createElement("div");
    content.classList.add("appWithSidenav");
    content.replaceChildren(...elements);

    app.replaceChildren(appDecoration.sidenav, content);
}

export function renderUndecoratedApp(...elements: Node[]) {
    getApp().replaceChildren(...elements);
}

function getApp() {
    let app = document.getElementById('app');
    if (!app) {
        app = document.createElement('div');
        app.id = 'app';
        document.body.appendChild(app);
    }
    return app;
}

const appDecoration = {
    sidenav: getSidenav()
}

function getSidenav() {
    const sidenav = document.createElement('div');
    sidenav.classList.add('sidenav');

    sidenav.appendChild(getNavATag("/tree", treeSmithIcon, "TreeSmith"));
    sidenav.appendChild(getNavATag("/items", itemSearchIcon, "SmithAtlas"));
    sidenav.appendChild(document.createElement("hr"));
    sidenav.appendChild(getNavATag("https://www.wynnpool.com/", wynnpoolIcon, "Wynnpool"));
    sidenav.appendChild(getNavATag("https://punscake.github.io/wynnability", wynnabilityIcon, "Wynnability"));
    sidenav.appendChild(getNavATag("wynnabilityIcon", yayIcon, "yayIcon"));

    return sidenav;
}

function getNavATag(href: string, imgSrc: string, label: string, isExternal = false) {
    const a = document.createElement("a");
    a.href = href;
    if (isExternal) a.target = "_blank";
    else a.dataset.navigo = "";

    const img = document.createElement("img");
    img.src = imgSrc;
    img.alt = " ";
    a.appendChild(img);

    const b = document.createElement("b");
    b.textContent = label;
    a.appendChild(b);

    return a;
}