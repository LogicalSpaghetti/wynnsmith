import Navigo, {type Match} from 'navigo';
import {showWynnSmith} from "./pages/wynnsmith.ts";
import {showItem} from "./pages/item.ts";

let base = '/';

// try using Vite's
if (import.meta.env.BASE_URL && import.meta.env.BASE_URL !== './') {
    base = import.meta.env.BASE_URL;
} else {
    // Fallback
    const pathname = window.location.pathname;

    if (pathname.startsWith('/gabriel/wynnsmith/')) {
        base = '/gabriel/wynnsmith/';
    } else if (pathname.startsWith('/wynnsmith/')) {
        base = '/wynnsmith/';
    }
}

const router = new Navigo(base, {hash: false});

console.log('Navigo base detected as:', base);

// TODO: should be phased out
function renderAppString(content: string): void {
    getApp().innerHTML = content;
}

// TODO: consider exporting this or getApp() instead of passing it into everything
function replaceAppChildren(...elements: Node[]): void {
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

const items = () => {
    renderAppString(`
    <h1>Item Page</h1>
    <p>Standard item view.</p>
    <a href="/" data-navigo>Back to Builder</a> •
    <a href="/item/advanced" data-navigo>Go Advanced</a>
  `);
};

const showItemAdvanced = () => {
    renderAppString(`
    <h1>Advanced Item Settings</h1>
    <p>Extra controls and options here.</p>
    <a href="/item" data-navigo>Back to Item</a> •
    <a href="/" data-navigo>Home</a>
  `);
};

const item = (match: Match | undefined) => {

    // Safely access the captured :name parameter
    const itemName = match?.data?.name || '';
    showItem(itemName, replaceAppChildren);
};

// 404 fallback
const showNotFound = () => {
    renderAppString(`
    <h1>404 - Not Found</h1>
    <p>Sorry, that page doesn't exist.</p>
    <a href="/" data-navigo>Go to Builder</a>
  `);
};

const wynnSmith = () => showWynnSmith(renderAppString);

router
    .on('/', wynnSmith)
    .on('/item', items)
    .on('/item/:name', item)
    .on('/item/advanced', showItemAdvanced)
    .notFound(showNotFound);

// Start the router (must call resolve() after defining routes)
router.resolve();

export function navigateTo(loc: string) {
    router.navigate(loc);
}

// Optional: If you dynamically add/remove links or change DOM heavily,
// call this afterward:
// router.updatePageLinks();

// If you want programmatic navigation from other files:
// import router from './router';
// router.navigate('/item');