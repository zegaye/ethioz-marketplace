<script>

    import { language, translations } from  '$lib/i18n.js';

    /** @type {'en' | 'am'} */

let currentLanguage = $state('en');

    let menuOpen = $state(false);

    /** @type {HTMLButtonElement | undefined} */

    let menuButton = $state();

    function closeMenu() {

        menuOpen = false;

    }

    /** @param {KeyboardEvent} event */

    function handleMenuKey(event) {

        if (event.key === 'Escape' && menuOpen) {

            closeMenu();

            menuButton?.focus();

        }

    }

/** @param {'en' | 'am'} lang */

function setLanguage(lang) {

    currentLanguage = lang;

    language.set(lang);

}

let t = $derived(translations[currentLanguage]);

    let search = $state('');

    let selectedCategory = $state('All');

    const searchCategories = [

    'All',

    'Real Estate',

    'Cars',

    'Mobile Phones',

    'Laptops',

    'TV & Electronics',

    'Home & Furniture',

    'Other Items'

];

    const categories = [

    {

        name: 'Real Estate',

        image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=900&q=80',

        description: 'Houses, apartments, land & property',

        href: '/products?category=Real%20Estate'

    },

    {

        name: 'Cars',

        image: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=900&q=80',

        description: 'New & used cars',

        href: '/products?category=Cars'

    },

        {

            name: 'Mobile Phones',

            image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80',

            description: 'Phones & accessories',

            href: '/products?category=Mobile%20Phones'

        },

        {

            name: 'Laptops',

            image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80',

            description: 'Laptops & computers',

            href: '/products?category=Laptops'

        },

        {

            name: 'TV & Electronics',

            image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=900&q=80',

            description: 'TVs & electronics',

            href: '/products?category=TV%20%26%20Electronics'

        },

        {

            name: 'Home & Furniture',

            image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80',

            description: 'Furniture & home items',

            href: '/products?category=Home%20%26%20Furniture'

        },

        {

            name: 'Other Items',

            image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=900&q=80',

            description: 'Explore everything else',

            href: '/products?category=Other'

        }

    ];

    const featuredProducts = [

        {

            id: 1,

            title: 'Toyota Corolla',

            price: '1,850,000 ETB',

            condition: 'Used',

            location: 'Addis Ababa',

            image: 'https://images.unsplash.com/photo-1623869675781-80aa31012a5a?auto=format&fit=crop&w=900&q=80'

        },

        {

            id: 2,

            title: 'iPhone 14 Pro',

            price: '78,000 ETB',

            condition: 'Used',

            location: 'Addis Ababa',

            image: 'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?auto=format&fit=crop&w=900&q=80'

        },

        {

            id: 3,

            title: 'HP EliteBook Laptop',

            price: '52,000 ETB',

            condition: 'Used',

            location: 'Addis Ababa',

            image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80'

        },

        {

            id: 4,

            title: 'Samsung Smart TV',

            price: '46,500 ETB',

            condition: 'New',

            location: 'Addis Ababa',

            image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=900&q=80'

        }

    ];

    function searchMarketplace() {

        const params = new URLSearchParams();

        if (search.trim()) {

            params.set('search', search.trim());

        }

        if (selectedCategory !== 'All') {

            params.set('category', selectedCategory);

        }

        const query = params.toString();

        window.location.href = query

            ? `/products?${query}`

            : '/products';

    }

</script>

<svelte:head>

    <title>4KAZ Marketplace | Buy & Sell in Ethiopia</title>

    <meta

        name="description"

        content="Buy and sell new and used cars, phones, laptops, electronics and more on 4KAZ Marketplace."

    />

</svelte:head>

<svelte:window onkeydown={handleMenuKey} />

<header class="navbar">

    <a class="brand" href="/">

        <img

            src="/images/ethioz logo.jpg"

            alt="4KAZ Marketplace"

        />

        <div>

            <strong>4KAZ</strong>

            <span>Marketplace</span>

        </div>

    </a>

    <button

        class="menu-toggle"

        type="button"

        bind:this={menuButton}

        aria-label={menuOpen ? (currentLanguage === 'am' ? 'ምናሌውን ዝጋ' : 'Close menu') : (currentLanguage === 'am' ? 'ምናሌውን ክፈት' : 'Open menu')}

        aria-expanded={menuOpen}

        aria-controls="main-navigation"

        onclick={() => menuOpen = !menuOpen}

    >

        <span aria-hidden="true">{menuOpen ? '✕' : '☰'}</span>

    </button>

    <nav id="main-navigation" class:open={menuOpen} aria-label="Main navigation">

        <a href="/" onclick={closeMenu}>{t.home}</a>

        <a href="/products" onclick={closeMenu}>{t.products}</a>

        <a href="/products?category=Real%20Estate" onclick={closeMenu}>{t.realEstate}</a>

        <a href="/products?category=Cars" onclick={closeMenu}>{t.cars}</a>

        <a href="/products?category=Mobile%20Phones" onclick={closeMenu}>{t.mobilePhones}</a>

        <a href="/products?category=TV%20%26%20Electronics" onclick={closeMenu}>{t.electronics}</a>

        <a class="mobile-sell" href="/sell" onclick={closeMenu}>+ {t.sell}</a>

    </nav>

    <div class="language-switcher">

    <button

        type="button"

        class:active={currentLanguage === 'en'}

        onclick={() => setLanguage('en')}

    >

        EN

    </button>

    <span>|</span>

    <button

        type="button"

        class:active={currentLanguage === 'am'}

        onclick={() => setLanguage('am')}

    >

        አማ

    </button>

</div>

    <a class="sell-button" href="/sell">

    + {t.sell}

</a>

</header>

<main>

    <section class="hero colorful-hero">

        <div class="hero-decoration decoration-one" aria-hidden="true">🛍️</div>
        <div class="hero-decoration decoration-two" aria-hidden="true">🚗</div>
        <div class="hero-decoration decoration-three" aria-hidden="true">📱</div>
        <div class="hero-decoration decoration-four" aria-hidden="true">🏠</div>
        <div class="hero-content">

            <p class="eyebrow hero-pill">✨ WELCOME TO 4KAZ MARKETPLACE</p>

            <h1>

    {t.buy.toUpperCase()}<br />

    {t.sell.toUpperCase()} <span>{t.find.toUpperCase()}</span>

</h1>

            <p class="hero-description">

                Discover something amazing from sellers across Ethiopia.

                Cars, phones, laptops, homes and much more.

            </p>

            <form

                class="search-box"

                onsubmit={(event) => {

                    event.preventDefault();

                    searchMarketplace();

                }}

            >

                <select

                    bind:value={selectedCategory}

                    aria-label="Select category"

                >

                    {#each searchCategories as category}

                        <option value={category}>

                            {category === 'All'

                                ? 'All Categories'

                                : category}

                        </option>

                    {/each}

                </select>

                <div class="search-input">

                    <span>⌕</span>

                    <input

                        bind:value={search}

                        type="search"

                        placeholder="Search Real Estate',cars, phones, laptops, TVs..."

                    />

                </div>

                <button type="submit">

                    Search

                </button>

            </form>

            <div class="popular">

                <span>Popular:</span>

                <a href="/products?category=Real%20Estate">

    Real Estate

</a>

                <a href="/products?category=Cars">

                    Cars

                </a>

                <a href="/products?category=Mobile%20Phones">

                    Phones

                </a>

                <a href="/products?category=Laptops">

                    Laptops

                </a>

                <a href="/products?category=TV%20%26%20Electronics">

                    Electronics

                </a>

            </div>

        </div>

    </section>

    <section class="categories-section">

        <div class="section-heading">

            <div>

                <p class="eyebrow">EXPLORE</p>

                <h2>Shop by category</h2>

            </div>

            <a href="/products">View all →</a>

        </div>

        <div class="category-grid">

            {#each categories as category}

                <a

                    class="category-card"

                    href={category.href}

                >

                    <div class="category-image-wrap">

                        <img class="category-image" src={category.image} alt={category.name} loading="lazy" />

                    </div>

                    <div>

                        <h3>{category.name}</h3>

                        <p>{category.description}</p>

                    </div>

                    <span class="arrow">→</span>

                </a>

            {/each}

        </div>

    </section>

    <section class="featured-section">

        <div class="section-heading">

            <div>

                <p class="eyebrow">EXPLORE IDEAS</p>

                <h2>Marketplace inspiration</h2>

            </div>

            <a href="/products">

                Browse marketplace →

            </a>

        </div>

        <div class="product-grid">

            {#each featuredProducts as product}

                <a

                    class="product-card"

                    href="/products"

                >

                    <div class="product-image">

                        <img

                            src={product.image}

                            alt={product.title}

                            loading="lazy"

                        />

                        <div class="condition">

                            {product.condition}

                        </div>

                    </div>

                    <div class="product-info">

                        <p class="location">

                            📍 {product.location}

                        </p>

                        <h3>{product.title}</h3>

                        <strong>{product.price}</strong>

                    </div>

                </a>

            {/each}

        </div>

    </section>

    <section class="sell-section">

        <div>

            <p class="eyebrow light">START SELLING</p>

            <h2>

                GOT SOMETHING<br />

                TO SELL?

            </h2>

            <p>

                Create a listing and reach buyers looking for

                new and used products.

            </p>

        </div>

        <a href="/sell">

            Sell an Item →

        </a>

    </section>

</main>

<footer>

    <div class="footer-brand">

        <img

            src="/images/ethioz logo.jpg"

            alt="4KAZ Marketplace"

        />

        <div>

            <strong>4KAZ</strong>

            <p>Marketplace</p>

        </div>

    </div>

    <p>

        Cars · Phones · Laptops · Electronics · More

    </p>

    <p>© 2026 4KAZ Marketplace</p>

    <a class="admin-link" href="/admin/login">Admin login</a>

</footer>

<style>

    :global(*) {

        box-sizing: border-box;

    }

    :global(html) {

        scroll-behavior: smooth;

    }

    :global(body) {

        margin: 0;

        font-family: Arial, Helvetica, sans-serif;

        background: #f5f5f3;

        color: #171717;

    }

    button,

    input,

    select {

        font-family: inherit;

    }

    button {

        cursor: pointer;

    }

    .navbar {

        height: 82px;

        display: flex;

        align-items: center;

        justify-content: space-between;

        gap: 30px;

        padding: 0 5%;

        background: rgba(255, 255, 255, 0.97);

        border-bottom: 1px solid #dedede;

        position: sticky;

        top: 0;

        z-index: 100;

    }

    .brand {

        display: flex;

        align-items: center;

        gap: 11px;

        color: #111;

        text-decoration: none;

    }

    .brand img {

        width: 46px;

        height: 46px;

        object-fit: contain;

    }

    .brand div {

        display: flex;

        flex-direction: column;

    }

    .brand strong {

        font-size: 22px;

        line-height: 1;

    }

    .brand span {

        margin-top: 3px;

        font-size: 11px;

        color: #777;

        text-transform: uppercase;

        letter-spacing: 1.5px;

    }

    nav {

        display: flex;

        align-items: center;

        gap: 26px;

    }

    nav a {

        color: #222;

        text-decoration: none;

        font-size: 14px;

        font-weight: 600;

    }

    nav a:hover {

        opacity: 0.55;

    }

    .sell-button {

        background: #191919;

        color: white;

        padding: 13px 20px;

        border-radius: 8px;

        text-decoration: none;

        font-size: 14px;

        font-weight: 700;

    }

    .hero {

        min-height: 650px;

        display: flex;

        align-items: center;

        justify-content: center;

        text-align: center;

        padding: 80px 20px;

        background:

            radial-gradient(

                circle at 50% 0%,

                #ffffff 0%,

                #f5f5f3 55%

            );

    }

    .hero-content {

        width: 100%;

        max-width: 1100px;

    }

    .eyebrow {

        margin: 0 0 22px;

        font-size: 11px;

        font-weight: 900;

        letter-spacing: 4px;

    }

    .hero h1 {

        margin: 0;

        font-size: clamp(65px, 10vw, 140px);

        line-height: 0.82;

        letter-spacing: -7px;

        font-weight: 900;

    }

    .hero h1 span {

        color: #737373;

    }

    .hero-description {

        max-width: 650px;

        margin: 38px auto 0;

        color: #666;

        font-size: 18px;

        line-height: 1.6;

    }

    .search-box {

        width: min(950px, 100%);

        margin: 30px auto 0;

        display: flex;

        align-items: stretch;

        padding: 8px;

        background: white;

        border: 1px solid #e1e1e1;

        border-radius: 12px;

        box-shadow: 0 15px 45px rgba(0, 0, 0, 0.08);

    }

    .search-box select {

        width: 195px;

        padding: 0 16px;

        border: 0;

        border-right: 1px solid #ddd;

        background: white;

        outline: none;

        font-size: 13px;

        font-weight: 700;

        cursor: pointer;

    }

    .search-input {

        flex: 1;

        min-width: 0;

        display: flex;

        align-items: center;

    }

    .search-input span {

        margin-left: 17px;

        font-size: 26px;

    }

    .search-input input {

        width: 100%;

        min-width: 0;

        padding: 18px 14px;

        border: 0;

        outline: 0;

        font-size: 15px;

        background: transparent;

    }

    .search-box button {

        border: 0;

        border-radius: 8px;

        padding: 17px 30px;

        background: #191919;

        color: white;

        font-weight: 700;

    }

    .popular {

        margin-top: 20px;

        display: flex;

        align-items: center;

        justify-content: center;

        flex-wrap: wrap;

        gap: 8px;

        font-size: 12px;

    }

    .popular a {

        padding: 8px 14px;

        border: 1px solid #ccc;

        border-radius: 30px;

        color: #111;

        text-decoration: none;

    }

    .popular a:hover {

        background: #191919;

        color: white;

    }

    .categories-section,

    .featured-section {

        padding: 90px 6%;

        background: white;

    }

    .featured-section {

        background: #f5f5f3;

    }

    .section-heading {

        display: flex;

        align-items: flex-end;

        justify-content: space-between;

        gap: 30px;

        margin-bottom: 45px;

    }

    .section-heading h2 {

        margin: 0;

        font-size: clamp(42px, 5vw, 70px);

        letter-spacing: -4px;

    }

    .section-heading > a {

        color: #111;

        font-weight: 700;

    }

    .category-grid {

        display: grid;

        grid-template-columns: repeat(3, 1fr);

        gap: 16px;

    }

    .category-card {

        min-height: 155px;

        display: flex;

        align-items: center;

        gap: 20px;

        position: relative;

        padding: 25px;

        border: 1px solid #e2e2e2;

        border-radius: 14px;

        color: #111;

        background: #fafafa;

        text-decoration: none;

        transition:

            transform 0.2s ease,

            box-shadow 0.2s ease;

    }

    .category-card:hover {

        transform: translateY(-4px);

        box-shadow: 0 15px 35px rgba(0, 0, 0, 0.08);

    }

    .category-image-wrap {

        width: 112px;

        height: 105px;

        flex: 0 0 auto;

        overflow: hidden;

        border-radius: 12px;

        background: #eeeeeb;

    }

    .category-image {

        display: block;

        width: 100%;

        height: 100%;

        object-fit: cover;

        transition: transform 0.3s ease;

    }

    .category-card:hover .category-image {

        transform: scale(1.07);

    }

    .category-card h3 {

        margin: 0 0 6px;

        font-size: 20px;

    }

    .category-card p {

        margin: 0;

        color: #777;

        font-size: 13px;

    }

    .arrow {

        position: absolute;

        top: 18px;

        right: 20px;

        font-size: 20px;

    }

    .product-grid {

        display: grid;

        grid-template-columns: repeat(4, 1fr);

        gap: 18px;

    }

    .product-card {

        overflow: hidden;

        border: 1px solid #dedede;

        border-radius: 14px;

        background: white;

        color: #111;

        text-decoration: none;

        transition:

            transform 0.2s ease,

            box-shadow 0.2s ease;

    }

    .product-card:hover {

        transform: translateY(-4px);

        box-shadow: 0 15px 30px rgba(0, 0, 0, 0.07);

    }

    .product-image {

        height: 230px;

        position: relative;

        overflow: hidden;

        background: #eeeeeb;

    }

    .product-image img {

        width: 100%;

        height: 100%;

        display: block;

        object-fit: cover;

        transition: transform 0.35s ease;

    }

    .product-card:hover .product-image img {

        transform: scale(1.04);

    }

    .condition {

        position: absolute;

        top: 14px;

        left: 14px;

        padding: 7px 11px;

        background: white;

        border-radius: 30px;

        font-size: 11px;

        font-weight: 800;

    }

    .product-info {

        padding: 18px;

    }

    .location {

        margin: 0 0 8px;

        color: #888;

        font-size: 11px;

    }

    .product-info h3 {

        margin: 0 0 15px;

        font-size: 17px;

    }

    .product-info strong {

        font-size: 20px;

    }

    .sell-section {

        margin: 80px 6%;

        min-height: 400px;

        display: flex;

        align-items: center;

        justify-content: space-between;

        gap: 50px;

        padding: 65px;

        border-radius: 18px;

        background: #191919;

        color: white;

    }

    .light {

        color: #aaa;

    }

    .sell-section h2 {

        margin: 0 0 25px;

        font-size: clamp(55px, 7vw, 95px);

        line-height: 0.86;

        letter-spacing: -6px;

    }

    .sell-section p:not(.eyebrow) {

        max-width: 500px;

        color: #aaa;

        line-height: 1.6;

    }

    .sell-section > a {

        padding: 19px 27px;

        border-radius: 8px;

        background: white;

        color: #111;

        text-decoration: none;

        font-weight: 800;

        white-space: nowrap;

    }

    footer {

        display: flex;

        align-items: center;

        justify-content: space-between;

        gap: 30px;

        padding: 50px 6%;

        border-top: 1px solid #d6d6d6;

        color: #777;

        font-size: 13px;

    }

    .footer-brand {

        display: flex;

        align-items: center;

        gap: 12px;

    }

    .footer-brand img {

        width: 44px;

        height: 44px;

        object-fit: contain;

    }

    .footer-brand strong {

        color: #111;

        font-size: 22px;

    }

    .footer-brand p {

        margin: 2px 0 0;

    }

    @media (max-width: 1000px) {

        .product-grid {

            grid-template-columns: repeat(2, 1fr);

        }

        .category-grid {

            grid-template-columns: repeat(2, 1fr);

        }

    }

    @media (max-width: 800px) {

        nav {

            display: none;

        }

        .navbar {

            padding: 0 18px;

        }

        .hero {

            min-height: 580px;

        }

        .hero h1 {

            letter-spacing: -4px;

        }

        .search-box {

            flex-direction: column;

            padding: 8px;

        }

        .search-box select {

            width: 100%;

            height: 52px;

            border-right: 0;

            border-bottom: 1px solid #ddd;

        }

        .search-input {

            width: 100%;

        }

        .search-box button {

            width: 100%;

        }

        .categories-section,

        .featured-section {

            padding: 65px 20px;

        }

        .section-heading {

            align-items: flex-start;

            flex-direction: column;

        }

        .sell-section {

            margin: 40px 20px;

            padding: 45px 30px;

            flex-direction: column;

            align-items: flex-start;

        }

        .sell-section h2 {

            letter-spacing: -4px;

        }

        footer {

            padding: 40px 20px;

            flex-direction: column;

            align-items: flex-start;

        }

    }

    @media (max-width: 600px) {

        .category-image-wrap {

            width: 104px;

            height: 96px;

        }

        .brand span {

            display: none;

        }

        .sell-button {

            padding: 11px 14px;

            font-size: 12px;

        }

        .category-grid,

        .product-grid {

            grid-template-columns: 1fr;

        }

        .product-image {

            height: 210px;

        }

    }



    .menu-toggle, .mobile-sell { display: none; }

    .language-switcher { display: flex; align-items: center; gap: 4px; flex-shrink: 0; }

    .language-switcher button { min-width: 44px; min-height: 44px; border: 1px solid #ddd; border-radius: 8px; background: white; color: #222; font-weight: 700; }

    .language-switcher button.active { background: #191919; color: white; border-color: #191919; }

    .menu-toggle:focus-visible, nav a:focus-visible, .language-switcher button:focus-visible { outline: 3px solid #258445; outline-offset: 3px; }

    .admin-link { color: #333; padding: 12px 0; }

    @media (max-width: 1200px) {

        .navbar { height: auto; min-height: 76px; display: grid; grid-template-columns: 1fr auto auto; gap: 10px; padding: 12px 16px; }

        .brand { grid-column: 1; grid-row: 1; gap: 8px; min-width: 0; }

        .brand img { width: 36px; height: 36px; }

        .brand strong { font-size: 20px; }

        .brand span { display: none; }

        .menu-toggle { grid-column: 2; grid-row: 1; display: grid; place-items: center; width: 46px; height: 46px; padding: 0; border: 1px solid #ddd; border-radius: 9px; background: white; color: #171717; font-size: 28px; line-height: 1; }

        .language-switcher { grid-column: 3; grid-row: 1; }

        .language-switcher > span { display: none; }

        .navbar > .sell-button { display: none; }

        #main-navigation { display: none; grid-column: 1 / -1; grid-row: 2; width: 100%; gap: 4px; padding-top: 10px; border-top: 1px solid #e5e5e5; max-height: calc(100dvh - 100px); overflow-y: auto; }

        #main-navigation.open { display: flex; flex-direction: column; align-items: stretch; }

        #main-navigation a { display: flex; align-items: center; min-height: 48px; padding: 12px 16px; border-radius: 8px; font-size: 16px; }

        #main-navigation a:hover { background: #f0f3ef; opacity: 1; }

        #main-navigation .mobile-sell { background: #191919; color: white; margin-top: 4px; }

    }


    /* Colorful animated 4KAZ makeover — non-destructive visual overrides */
    :global(body) { background: #f9f7ff; color: #17112f; }
    .navbar { background: rgba(255,255,255,.94); backdrop-filter: blur(16px); border-bottom-color: #eee6ff; box-shadow: 0 5px 24px rgba(95,30,175,.07); }
    .brand strong { color: #6b12d9; }
    nav a:hover { color: #7b19ed; opacity: 1; }
    .sell-button, #main-navigation .mobile-sell { background: linear-gradient(115deg,#7c19ed,#f132aa); box-shadow: 0 8px 22px rgba(138,40,218,.24); }
    .language-switcher button.active { background: #7a18e8; border-color: #7a18e8; }
    .colorful-hero { position: relative; isolation: isolate; overflow: hidden; min-height: 680px; background: linear-gradient(120deg,#7412ec 0%,#aa27ed 42%,#f254a5 100%); color: #fff; }
    .colorful-hero::before, .colorful-hero::after { content: ''; position: absolute; z-index: -1; border-radius: 50%; pointer-events: none; filter: blur(3px); }
    .colorful-hero::before { width: 520px; height: 520px; background: rgba(255,192,94,.19); top: -240px; right: -80px; animation: drift 9s ease-in-out infinite alternate; }
    .colorful-hero::after { width: 430px; height: 430px; background: rgba(91,226,255,.18); bottom: -260px; left: -110px; animation: drift 11s ease-in-out infinite alternate-reverse; }
    .hero-content { position: relative; z-index: 2; }
    .hero-pill { display: inline-block; padding: 12px 20px; border-radius: 100px; letter-spacing: 2px; background: rgba(255,255,255,.18); border: 1px solid rgba(255,255,255,.4); }
    .hero h1 { text-shadow: 0 12px 35px rgba(58,0,110,.22); letter-spacing: -.055em; line-height: .98; animation: riseIn .7s ease both; }
    .hero h1 span { color: #ffe36a; }
    .hero-description { color: #fff; font-weight: 500; animation: riseIn .9s ease both; }
    .hero-decoration { position: absolute; z-index: 1; display: grid; place-items: center; width: 96px; height: 96px; font-size: 48px; background: rgba(255,255,255,.19); border: 1px solid rgba(255,255,255,.4); border-radius: 24px; box-shadow: 0 15px 35px rgba(63,0,110,.18); animation: floatAround 5s ease-in-out infinite; pointer-events: none; }
    .decoration-one { top: 12%; left: 7%; transform: rotate(-12deg); }
    .decoration-two { top: 16%; right: 7%; animation-delay: -1.2s; }
    .decoration-three { bottom: 14%; left: 5%; animation-delay: -2.4s; }
    .decoration-four { bottom: 14%; right: 5%; animation-delay: -3.4s; }
    .search-box { border: 2px solid rgba(255,255,255,.6); border-radius: 20px; box-shadow: 0 20px 50px rgba(51,0,109,.23); }
    .search-box button { background: linear-gradient(120deg,#7620e8,#e92d9c); border-radius: 13px; }
    .search-box button:hover, .sell-section > a:hover { filter: brightness(1.08); transform: translateY(-2px); }
    .popular { color: #fff; }
    .popular a { color: #fff; border-color: rgba(255,255,255,.65); background: rgba(255,255,255,.12); }
    .popular a:hover { background: white; color: #7520e5; }
    .categories-section { background: #fff; }
    .featured-section { background: #f9f6ff; }
    .section-heading .eyebrow { color: #8b22ec; }
    .section-heading h2 { color: #1b1534; letter-spacing: -.045em; }
    .section-heading > a { color: #7d20e5; }
    .category-card { border: 1px solid transparent; border-radius: 23px; background: #f3eaff; box-shadow: 0 8px 22px rgba(80,20,140,.04); }
    .category-card:nth-child(7n+2) { background: #fff0db; }
    .category-card:nth-child(7n+3) { background: #ffe6f2; }
    .category-card:nth-child(7n+4) { background: #e3efff; }
    .category-card:nth-child(7n+5) { background: #e2fae9; }
    .category-card:nth-child(7n+6) { background: #fff8cf; }
    .category-card:nth-child(7n+7) { background: #ece7ff; }
    .category-card:hover { transform: translateY(-9px) rotate(-.5deg); box-shadow: 0 20px 38px rgba(108,29,192,.15); }
    .category-image-wrap { border-radius: 18px; }
    .category-card h3 { color: #25183e; }
    .category-card p { color: #5b5369; }
    .arrow { color: #8921ee; }
    .product-card { border: 1px solid #efe8ff; border-radius: 22px; box-shadow: 0 8px 25px rgba(92,22,170,.06); }
    .product-card:hover { transform: translateY(-9px); box-shadow: 0 22px 42px rgba(99,20,180,.16); }
    .condition { background: #7d19e9; color: #fff; }
    .product-info strong { color: #8c1eea; }
    .sell-section { position: relative; overflow: hidden; border-radius: 30px; background: linear-gradient(110deg,#6616d8,#bb2ce6 58%,#f2509c); }
    .sell-section::after { content: '✨'; position: absolute; right: 20%; top: 10%; font-size: 100px; opacity: .3; animation: floatAround 5s ease-in-out infinite; pointer-events: none; }
    .sell-section p:not(.eyebrow), .sell-section .light { color: #fff; }
    .sell-section > a { z-index: 1; color: #7520d9; border-radius: 14px; transition: transform .2s ease; }
    footer { background: #fff; border-top-color: #eee6ff; }
    .admin-link { color: #7d20e5; }
    @keyframes floatAround { 0%,100% { translate: 0 0; } 50% { translate: 0 -19px; } }
    @keyframes drift { from { transform: translate(0,0); } to { transform: translate(-55px,45px); } }
    @keyframes riseIn { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
    @media (max-width: 800px) { .colorful-hero { min-height: 630px; padding: 80px 18px; } .hero-decoration { width: 55px; height: 55px; font-size: 27px; opacity: .45; } .decoration-one { top: 6%; left: 3%; } .decoration-two { top: 6%; right: 3%; } .decoration-three, .decoration-four { display: none; } .hero h1 { font-size: clamp(55px,12vw,90px); } .hero-description { font-size: 16px; } }
    @media (prefers-reduced-motion: reduce) { .hero-decoration, .colorful-hero::before, .colorful-hero::after, .hero h1, .hero-description, .sell-section::after { animation: none !important; } :global(html) { scroll-behavior: auto; } }
</style>