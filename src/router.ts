import Navigo, {type Match} from 'navigo';


// Create the router instance
// root = '/' → clean URLs (uses History API)
// If you later deploy to a subfolder (e.g. /app/), change to new Navigo('/app/')
const router = new Navigo('/wynnsmith/', { hash: false });

function render(content: string): void {
    const app = document.getElementById('app');
    if (app) app.innerHTML = content;
    else console.error('No #app element found');
}

const showBuilder = () => {
    render(`
    <h1>Builder Page</h1>
    <p>This is the main builder interface.</p>
    <a href="/item" data-navigo>Go to Item</a> •
    <a href="/item/advanced" data-navigo>Advanced Item</a>
  `);
};

const showItem = () => {
    render(`
    <h1>Item Page</h1>
    <p>Standard item view.</p>
    <a href="/" data-navigo>Back to Builder</a> •
    <a href="/item/advanced" data-navigo>Go Advanced</a>
  `);
};

const showItemAdvanced = () => {
    render(`
    <h1>Advanced Item Settings</h1>
    <p>Extra controls and options here.</p>
    <a href="/item" data-navigo>Back to Item</a> •
    <a href="/" data-navigo>Home</a>
  `);
};

const showDynamicItem = (match: Match | undefined) => {
    // Safely access the captured :name parameter
    const itemName = match?.data?.name || 'Unknown';

    // Optional: clean/normalize the name (kebab-case → title case)
    const displayName = itemName
        .split(/[-_]/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');

    render(`
    <h1>Item: ${displayName}</h1>
    <p>This is the dynamic page for <strong>${itemName}</strong>.</p>
    <p>URL slug: ${itemName}</p>
    <a href="/item/advanced" data-navigo>Advanced settings</a><br>
    <a href="/" data-navigo>Back to Builder</a>
  `);
};

// 404 fallback
const showNotFound = () => {
    render(`
    <h1>404 - Not Found</h1>
    <p>Sorry, that page doesn't exist.</p>
    <a href="/" data-navigo>Go to Builder</a>
  `);
};

router
    .on('/', showBuilder)
    .on('/item', showItem)
    .on('/item/:name', showDynamicItem)
    .on('/item/advanced', showItemAdvanced)
    .notFound(showNotFound);

// Start the router (must call resolve() after defining routes)
router.resolve();

// Optional: If you dynamically add/remove links or change DOM heavily,
// call this afterward:
// router.updatePageLinks();

// If you want programmatic navigation from other files:
// import router from './router';
// router.navigate('/item');