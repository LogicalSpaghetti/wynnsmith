import Navigo from 'navigo';
import {showWynnSmith} from "./pages/wynnsmith.ts";
import {showItem} from "./pages/item.ts";
import {showTreeSmith} from "./pages/treesmith.ts";
import {renderAppString} from "./pages/common.ts";

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

// 404 fallback
const showNotFound = () => {
    renderAppString(`
    <h1>404 - Not Found</h1>
    <p>Sorry, that page doesn't exist.</p>
    <a href="/" data-navigo>Go to Builder</a>
  `);
};

router
    .on('/', showWynnSmith)
    .on("/tree", showTreeSmith)
    .on('/item', items)
    .on('/item/:name', showItem)
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