<script>

    import { page } from '$app/state';

    import { onMount } from 'svelte';

    import { supabase } from '$lib/supabase.js';

    const categories = [

        'All',

        'Real Estate',

        'Cars',

        'Mobile Phones',

        'Laptops',

        'TV & Electronics',

        'Home & Furniture',

        'Other'

    ];

    let search = $state(page.url.searchParams.get('search') ?? '');

    let selectedCategory = $state(

        page.url.searchParams.get('category') ?? 'All'

    );

    let selectedCondition = $state('All');

/** @type {any[]} */
let databaseProducts = $state([]);

    let loading = $state(true);

    let loadError = $state('');

    let carMake = $state('');

    let carModel = $state('');

    let yearMin = $state('');

    let yearMax = $state('');

    let priceMin = $state('');

    let priceMax = $state('');

    let mileageMax = $state('');

    let transmission = $state('');

    let fuelType = $state('');

    let bodyStyle = $state('');

    let carLocation = $state('');

    let sortBy = $state('newest');

    const FAVORITES_KEY = '4kaz-marketplace-favorites-v1';
    /** @type {string[]} */
let savedIds = $state([]);
    let savedOnly = $state(false);
    let favoritesMessage = $state('');

    /** @param {string | number} id */
function toggleFavorite(id) {
        const key = String(id);
        savedIds = savedIds.includes(key)
            ? savedIds.filter((savedId) => savedId !== key)
            : [...savedIds, key];
        try {
            localStorage.setItem(FAVORITES_KEY, JSON.stringify(savedIds));
            favoritesMessage = savedIds.includes(key) ? 'Item saved' : 'Item removed from saved items';
        } catch (error) {
            console.warn('Could not persist saved items in this browser:', error);
            favoritesMessage = 'Unable to store saved items in this browser';
        }
    }


    /** @param {any} listing @param {string[]} keys */

    function spec(listing, keys) {

        const values = listing.specifications && typeof listing.specifications === 'object'

            ? listing.specifications : {};

        for (const key of keys) {

            const found = Object.entries(values).find(([k]) =>

                k.toLowerCase().replace(/[^a-z0-9]/g, '') === key.toLowerCase().replace(/[^a-z0-9]/g, '')

            );

            if (found && found[1] !== null && found[1] !== undefined && String(found[1]).trim()) return String(found[1]);

        }

        return '';

    }

    /** @param {unknown} value */

    function numeric(value) {

        const n = Number(String(value ?? '').replace(/[^0-9.]/g, ''));

        return Number.isFinite(n) ? n : 0;

    }

    /** @param {unknown} value */

    function lower(value) { return String(value ?? '').trim().toLowerCase(); }

    function resetCarFilters() {

        carMake = ''; carModel = ''; yearMin = ''; yearMax = '';

        priceMin = ''; priceMax = ''; mileageMax = '';

        transmission = ''; fuelType = ''; bodyStyle = ''; carLocation = '';

    }
 
    
    const sampleProducts = [

        {

            id: 'sample-1',

            make: 'Toyota', model: 'Corolla', year: 2014, mileage: 120000, transmission: 'Automatic', fuelType: 'Petrol', bodyStyle: 'Sedan',

            title: 'Toyota Corolla',

            category: 'Cars',

            price: 1850000,

            condition: 'Used',

            location: 'Addis Ababa',

            image:

                'https://images.unsplash.com/photo-1623869675781-80aa31012a5a?auto=format&fit=crop&w=900&q=80',

            database: false

        },

        {

            id: 'sample-2',

            title: 'iPhone 14 Pro',

            category: 'Mobile Phones',

            price: 78000,

            condition: 'Used',

            location: 'Addis Ababa',

            image:

                'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?auto=format&fit=crop&w=900&q=80',

            database: false

        },

        {

            id: 'sample-3',

            title: 'HP EliteBook Laptop',

            category: 'Laptops',

            price: 52000,

            condition: 'Used',

            location: 'Addis Ababa',

            image:

                'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80',

            database: false

        },

        {

            id: 'sample-4',

            title: 'Samsung Smart TV',

            category: 'TV & Electronics',

            price: 46500,

            condition: 'New',

            location: 'Addis Ababa',

            image:

                'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=900&q=80',

            database: false

        },

        {

            id: 'sample-5',

            title: 'Samsung Galaxy S23',

            category: 'Mobile Phones',

            price: 69000,

            condition: 'Used',

            location: 'Adama',

            image:

                'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=900&q=80',

            database: false

        },

        {

            id: 'sample-6',

            title: 'Dell Latitude Laptop',

            category: 'Laptops',

            price: 44000,

            condition: 'Used',

            location: 'Bahir Dar',

            image:

                'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=900&q=80',

            database: false

        },

        {

            id: 'sample-7',

            title: 'Modern Sofa Set',

            category: 'Home & Furniture',

            price: 85000,

            condition: 'New',

            location: 'Addis Ababa',

            image:

                'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80',

            database: false

        },

        {

            id: 'sample-8',

            make: 'Toyota', model: 'Vitz', year: 2012, mileage: 98000, transmission: 'Automatic', fuelType: 'Petrol', bodyStyle: 'Hatchback',

            title: 'Toyota Vitz',

            category: 'Cars',

            price: 1450000,

            condition: 'Used',

            location: 'Addis Ababa',

            image:

                'https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=900&q=80',

            database: false

        }

    ];

   let allProducts = $derived([

        ...databaseProducts,

        ...sampleProducts

    ]);
    let carMakes = $derived([...new Set(allProducts.filter((p) => p.category === 'Cars').map((p) => p.make).filter(Boolean))].sort());

    let carModels = $derived([...new Set(allProducts.filter((p) => p.category === 'Cars' && (!carMake || lower(p.make) === lower(carMake))).map((p) => p.model).filter(Boolean))].sort());


    let filteredProducts = $derived.by(() => {

        const results = allProducts.filter((product) => {
            if (savedOnly && !savedIds.includes(String(product.id))) return false;

            if (!lower(product.title).includes(lower(search))) return false;

            if (selectedCategory !== 'All' && product.category !== selectedCategory && !(selectedCategory === 'Other Items' && product.category === 'Other')) return false;

            if (selectedCondition !== 'All' && product.condition !== selectedCondition) return false;

            if (selectedCategory !== 'Cars') return true;

            if (carMake && lower(product.make) !== lower(carMake)) return false;

            if (carModel && lower(product.model) !== lower(carModel)) return false;

            if (yearMin && (!product.year || numeric(product.year) < numeric(yearMin))) return false;

            if (yearMax && (!product.year || numeric(product.year) > numeric(yearMax))) return false;

            if (priceMin && product.price < numeric(priceMin)) return false;

            if (priceMax && product.price > numeric(priceMax)) return false;

            if (mileageMax && (!product.mileage && product.mileage !== 0 || numeric(product.mileage) > numeric(mileageMax))) return false;

            if (transmission && lower(product.transmission) !== lower(transmission)) return false;

            if (fuelType && lower(product.fuelType) !== lower(fuelType)) return false;

            if (bodyStyle && lower(product.bodyStyle) !== lower(bodyStyle)) return false;

            if (carLocation && !lower(product.location).includes(lower(carLocation))) return false;

            return true;

        });

        return [...results].sort((a, b) => {

            if (sortBy === 'price-low') return a.price - b.price;

            if (sortBy === 'price-high') return b.price - a.price;

            if (sortBy === 'year-new') return numeric(b.year) - numeric(a.year);

            if (sortBy === 'mileage-low') return (a.mileage === '' ? Infinity : numeric(a.mileage)) - (b.mileage === '' ? Infinity : numeric(b.mileage));

            return (b.created_at || '').localeCompare(a.created_at || '');

        });

    });

    onMount(() => {
        try {
            const stored = JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]');
            savedIds = Array.isArray(stored) ? stored.map(String) : [];
        } catch (error) {
            console.warn('Could not read saved items:', error);
            savedIds = [];
        }
        loadApprovedListings();

    });

    async function loadApprovedListings() {

        loading = true;

        loadError = '';

        const { data, error } = await supabase

            .from('marketplace_listings')

            .select('*')

            .eq('status', 'approved')

            .order('created_at', { ascending: false });

        if (error) {

            console.error('Failed to load marketplace listings:', error);

            loadError =

                'Could not load marketplace listings.';

            databaseProducts = [];

            loading = false;

            return;

        }

        databaseProducts = (data ?? []).map((listing) => {

            let image = '';

            if (

                Array.isArray(listing.image_urls) &&

                listing.image_urls.length > 0

            ) {

                image = listing.image_urls[0];

            }

            return {

                id: listing.id,

                title: listing.title ?? 'Untitled item',

                category: listing.category ?? 'Other',

                price: Number(listing.price ?? 0),

                condition: listing.condition ?? 'Used',

                location: listing.location ?? 'Ethiopia',

                image,

                negotiable: listing.negotiable ?? false,

                make: spec(listing, ['make', 'brand', 'carMake', 'manufacturer']),

                model: spec(listing, ['model', 'carModel']),

                year: spec(listing, ['year', 'modelYear', 'manufactureYear']),

                mileage: spec(listing, ['mileage', 'kilometers', 'kilometres', 'odometer', 'km']),

                transmission: spec(listing, ['transmission', 'gearbox']),

                fuelType: spec(listing, ['fuelType', 'fuel', 'fuel_type']),

                bodyStyle: spec(listing, ['bodyStyle', 'bodyType', 'body']),

                created_at: listing.created_at ?? '',

                database: true

            };

        });

        loading = false;

    }

    /** @param {number} price */

    function formatPrice(price) {

        return new Intl.NumberFormat('en-US').format(price);

    }

    function clearFilters() {

        search = '';

        selectedCategory = 'All';

        selectedCondition = 'All';

        sortBy = 'newest';

        resetCarFilters();
        savedOnly = false;

        window.history.replaceState({}, '', '/products');

    }

</script>

<svelte:head>

    <title>Browse Products | 4KAZ Marketplace</title>

    <meta

        name="description"

        content="Browse new and used products on 4KAZ Marketplace."

    />

</svelte:head>

<header class="navbar">

    <a class="brand" href="/">

        <span class="logo">4K</span>

        <div>

            <strong>4KAZ</strong>

            <small>Marketplace</small>

        </div>

    </a>

    <nav>

        <a href="/">Home</a>

        <a class="active" href="/products">Browse</a>

        <a href="/products?category=Cars">Cars</a>

        <a href="/products?category=Mobile%20Phones">Phones</a>

        <a href="/products?category=TV%20%26%20Electronics">

            Electronics

        </a>

    </nav>

    <a class="sell-button" href="/sell">

        + Sell an Item

    </a>

</header>

<main>

    <section class="page-header">

        <p class="eyebrow">4KAZ MARKETPLACE</p>

        <h1>Find what you need.</h1>

        <p>

            Browse new and used products from sellers across Ethiopia.

        </p>

    </section>

    <section class="marketplace">

        <div class="search-row">

            <div class="search-box">

                <span>⌕</span>

                <input

                    bind:value={search}

                    type="search"

                    placeholder="Search cars, phones, laptops, TVs..."

                />

            </div>

            <select

                bind:value={selectedCondition}

                aria-label="Filter by condition"

            >

                <option value="All">

                    All conditions

                </option>

                <option value="New">

                    New

                </option>

                <option value="Used">

                    Used

                </option>

            </select>

        </div>

        <div class="categories">

            {#each categories as category}

                <button

                    type="button"

                    class:active-category={

                        selectedCategory === category

                    }

                    onclick={() => {

                        selectedCategory = category;

                    }}

                >

                    {category}

                </button>

            {/each}

        </div>

        {#if selectedCategory === 'Cars'}
            <section class="car-filter-panel" aria-label="Car search filters">
                <div class="car-filter-heading">
                    <div>
                        <p class="filter-kicker">VEHICLE SEARCH</p>
                        <h2>Find your next car</h2>
                        <p>Filter by vehicle details, price, and location.</p>
                    </div>
                    <button class="reset-car" type="button" onclick={resetCarFilters}>Reset car filters</button>
                </div>
                <div class="car-filter-grid">
                    <label>Make
                        <select bind:value={carMake} onchange={() => carModel = ''}>
                            <option value="">All makes</option>
                            {#each carMakes as make}<option value={make}>{make}</option>{/each}
                        </select>
                    </label>
                    <label>Model
                        <select bind:value={carModel}>
                            <option value="">All models</option>
                            {#each carModels as model}<option value={model}>{model}</option>{/each}
                        </select>
                    </label>
                    <label>Year from<input type="number" min="1900" max="2100" placeholder="2010" bind:value={yearMin} /></label>
                    <label>Year to<input type="number" min="1900" max="2100" placeholder="2026" bind:value={yearMax} /></label>
                    <label>Min price (ETB)<input type="number" min="0" placeholder="Minimum" bind:value={priceMin} /></label>
                    <label>Max price (ETB)<input type="number" min="0" placeholder="Maximum" bind:value={priceMax} /></label>
                    <label>Max mileage (km)<input type="number" min="0" placeholder="Any mileage" bind:value={mileageMax} /></label>
                    <label>Transmission
                        <select bind:value={transmission}><option value="">Any</option><option value="Automatic">Automatic</option><option value="Manual">Manual</option></select>
                    </label>
                    <label>Fuel type
                        <select bind:value={fuelType}><option value="">Any</option><option value="Petrol">Petrol</option><option value="Diesel">Diesel</option><option value="Hybrid">Hybrid</option><option value="Electric">Electric</option></select>
                    </label>
                    <label>Body style
                        <select bind:value={bodyStyle}><option value="">Any</option><option value="Sedan">Sedan</option><option value="SUV">SUV</option><option value="Hatchback">Hatchback</option><option value="Pickup">Pickup</option><option value="Coupe">Coupe</option><option value="Van">Van</option><option value="Wagon">Wagon</option></select>
                    </label>
                    <label>Location<input type="search" placeholder="e.g. Addis Ababa" bind:value={carLocation} /></label>
                    <label>Sort by
                        <select bind:value={sortBy}><option value="newest">Newest first</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="year-new">Newest model year</option><option value="mileage-low">Lowest mileage</option></select>
                    </label>
                </div>
                <p class="filter-note">Car filters use the specifications provided by sellers. Listings with missing details may not match every filter.</p>
            </section>
        {/if}

        <div class="saved-toolbar">
            <button
                type="button"
                class:saved-active={savedOnly}
                aria-pressed={savedOnly}
                onclick={() => savedOnly = !savedOnly}
            >
                {savedOnly ? '♥ Showing saved items' : '♡ Saved items'} ({savedIds.length})
            </button>
            <span aria-live="polite">{favoritesMessage}</span>
        </div>

        <div class="results-heading">

            <div>

                <h2>

                    {savedOnly
                        ? 'Saved items'
                        : selectedCategory === 'All'
                        ? 'Marketplace'

                        : selectedCategory}

                </h2>

                <p>

                    {filteredProducts.length}

                    {filteredProducts.length === 1

                        ? ' item'

                        : ' items'} found

                </p>

            </div>

            {#if search || savedOnly || selectedCategory !== 'All' || selectedCondition !== 'All' || sortBy !== 'newest'}

                <button

                    class="clear-button"

                    type="button"

                    onclick={clearFilters}

                >

                    Clear filters

                </button>

            {/if}

        </div>

        {#if loading}

            <div class="status-box">

                <div class="spinner"></div>

                <h3>Loading marketplace...</h3>

                <p>

                    Getting the newest approved listings.

                </p>

            </div>

        {:else}

            {#if loadError}

                <div class="error-message">

                    {loadError}

                </div>

            {/if}

            {#if filteredProducts.length > 0}

                <div class="product-grid">

                    {#each filteredProducts as product}

                        <a

                            class="product-card"

                            href={product.database

    ? `/products/${product.id}`

    : '#'}

                            onclick={(event) => {

                                if (!product.database) {

                                    event.preventDefault();

                                }

                            }}

                        >

                            <div class="product-image">

                                {#if product.image}

                                    <img

                                        src={product.image}

                                        alt={product.title}

                                        loading="lazy"

                                    />

                                {:else}

                                    <div class="no-image">

                                        <span>📦</span>

                                        <small>No image</small>

                                    </div>

                                {/if}

                                <span

                                    class="condition"

                                    class:new-badge={

                                        product.condition === 'New'

                                    }

                                >

                                    {product.condition}

                                </span>

                                {#if product.database}

                                    <span class="real-listing">

                                        Seller listing

                                    </span>

                                {:else}
                                    <span class="real-listing">Sample item</span>
                                {/if}

                                <button

                                    class="favorite"

                                    type="button"

                                    aria-label={savedIds.includes(String(product.id)) ? `Remove ${product.title} from saved items` : `Save ${product.title}`}
                                    aria-pressed={savedIds.includes(String(product.id))}
                                    class:is-saved={savedIds.includes(String(product.id))}
                                    title={savedIds.includes(String(product.id)) ? 'Remove from saved items' : 'Save item'}
                                    onclick={(event) => {
                                        event.preventDefault();
                                        event.stopPropagation();
                                        toggleFavorite(product.id);
                                    }}
                                >
                                    {savedIds.includes(String(product.id)) ? '♥' : '♡'}

                                </button>

                            </div>

                            <div class="product-details">

                                <p class="category">

                                    {product.category}

                                </p>

                                <h3>

                                    {product.title}

                                </h3>

                                <strong>

                                    {formatPrice(product.price)}

                                    ETB

                                </strong>

                                {#if product.negotiable}

                                    <span class="negotiable">

                                        Negotiable

                                    </span>

                                {/if}

                                <p class="location">

                                    📍 {product.location}

                                </p>

                            </div>

                        </a>

                    {/each}

                </div>

            {:else}

                <div class="empty">

                    <div>🔎</div>

                    <h3>No products found</h3>

                    <p>

                        Try another search, category or condition.

                    </p>

                    <button

                        type="button"

                        onclick={clearFilters}

                    >

                        Clear filters

                    </button>

                </div>

            {/if}

        {/if}

    </section>

</main>

<footer>

    <div>

        <strong>4KAZ Marketplace</strong>

        <p>Buy & sell across Ethiopia.</p>

    </div>

    <p>

        Cars · Phones · Laptops · Electronics · More

    </p>

    <p>© 2026 4KAZ Marketplace</p>

</footer>

<style>

    :global(*) {

        box-sizing: border-box;

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

        font: inherit;

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

        background: white;

        border-bottom: 1px solid #ddd;

        position: sticky;

        top: 0;

        z-index: 100;

    }

    .brand {

        display: flex;

        align-items: center;

        gap: 10px;

        color: #111;

        text-decoration: none;

    }

    .logo {

        width: 46px;

        height: 46px;

        display: grid;

        place-items: center;

        background: #191919;

        color: white;

        border-radius: 10px;

        font-weight: 900;

    }

    .brand div {

        display: flex;

        flex-direction: column;

    }

    .brand strong {

        font-size: 21px;

    }

    .brand small {

        color: #777;

    }

    nav {

        display: flex;

        gap: 26px;

    }

    nav a {

        color: #333;

        text-decoration: none;

        font-size: 14px;

        font-weight: 600;

    }

    nav a:hover,

    nav .active {

        color: #000;

        text-decoration: underline;

        text-underline-offset: 6px;

    }

    .sell-button {

        padding: 13px 19px;

        border-radius: 8px;

        background: #191919;

        color: white;

        text-decoration: none;

        font-weight: 700;

        font-size: 14px;

    }

    .page-header {

        padding: 75px 6% 55px;

        background: #191919;

        color: white;

    }

    .eyebrow {

        margin: 0 0 18px;

        color: #aaa;

        font-size: 10px;

        font-weight: 900;

        letter-spacing: 4px;

    }

    .page-header h1 {

        margin: 0;

        font-size: clamp(50px, 7vw, 95px);

        letter-spacing: -5px;

        line-height: 0.95;

    }

    .page-header > p:last-child {

        margin: 25px 0 0;

        color: #aaa;

        font-size: 17px;

    }

    .marketplace {

        padding: 45px 6% 90px;

    }

    .search-row {

        display: flex;

        gap: 12px;

        margin-bottom: 20px;

    }

    .search-box {

        flex: 1;

        display: flex;

        align-items: center;

        gap: 10px;

        padding: 0 18px;

        background: white;

        border: 1px solid #ddd;

        border-radius: 10px;

    }

    .search-box span {

        font-size: 25px;

    }

    .search-box input {

        width: 100%;

        padding: 17px 5px;

        border: 0;

        outline: 0;

        background: transparent;

    }

    select {

        min-width: 180px;

        padding: 0 16px;

        border: 1px solid #ddd;

        border-radius: 10px;

        background: white;

        outline: none;

    }

    .categories {

        display: flex;

        flex-wrap: wrap;

        gap: 8px;

        padding-bottom: 30px;

        border-bottom: 1px solid #ddd;

    }

    .categories button {

        padding: 9px 15px;

        border: 1px solid #ccc;

        border-radius: 30px;

        background: white;

        font-size: 12px;

        font-weight: 600;

    }

    .categories button:hover,

    .categories .active-category {

        border-color: #191919;

        background: #191919;

        color: white;

    }

    .results-heading {

        display: flex;

        align-items: center;

        justify-content: space-between;

        gap: 20px;

        margin: 40px 0 25px;

    }

    .results-heading h2 {

        margin: 0;

        font-size: 32px;

    }

    .results-heading p {

        margin: 6px 0 0;

        color: #777;

        font-size: 13px;

    }

    .clear-button {

        padding: 10px 15px;

        border: 1px solid #ccc;

        border-radius: 8px;

        background: white;

        font-weight: 700;

    }

    .product-grid {

        display: grid;

        grid-template-columns: repeat(4, 1fr);

        gap: 18px;

    }

    .product-card {

        overflow: hidden;

        border: 1px solid #dedede;

        border-radius: 13px;

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

        height: 235px;

        position: relative;

        overflow: hidden;

        background: #ececea;

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

    .no-image {

        width: 100%;

        height: 100%;

        display: flex;

        flex-direction: column;

        align-items: center;

        justify-content: center;

        gap: 10px;

        color: #777;

    }

    .no-image span {

        font-size: 45px;

    }

    .condition {

        position: absolute;

        top: 14px;

        left: 14px;

        padding: 7px 11px;

        border-radius: 30px;

        background: #333;

        color: white;

        font-size: 10px;

        font-weight: 800;

        text-transform: uppercase;

    }

    .condition.new-badge {

        background: white;

        color: #111;

    }

    .real-listing {

        position: absolute;

        left: 14px;

        bottom: 14px;

        padding: 6px 10px;

        border-radius: 30px;

        background: white;

        color: #111;

        font-size: 9px;

        font-weight: 800;

        text-transform: uppercase;

        letter-spacing: 0.5px;

    }

    .favorite.is-saved {
        background: #ffe9ee;
        color: #d21d4a;
    }

    .saved-toolbar {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 14px;
        margin-top: 24px;
    }

    .saved-toolbar button {
        padding: 11px 17px;
        border: 1px solid #ccc;
        border-radius: 9px;
        background: white;
        color: #222;
        font-weight: 700;
    }

    .saved-toolbar button.saved-active {
        background: #191919;
        border-color: #191919;
        color: white;
    }

    .saved-toolbar span {
        font-size: 12px;
        color: #666;
    }

    .favorite {

        position: absolute;

        top: 12px;

        right: 12px;

        width: 38px;

        height: 38px;

        border: 0;

        border-radius: 50%;

        background: white;

        font-size: 22px;

        box-shadow: 0 3px 12px rgba(0, 0, 0, 0.12);

    }

    .product-details {

        padding: 17px;

    }

    .category {

        margin: 0 0 8px;

        color: #888;

        font-size: 10px;

        font-weight: 800;

        text-transform: uppercase;

        letter-spacing: 1px;

    }

    .product-details h3 {

        margin: 0 0 15px;

        font-size: 17px;

    }

    .product-details strong {

        display: block;

        font-size: 20px;

    }

    .negotiable {

        display: inline-block;

        margin-top: 8px;

        padding: 5px 8px;

        border-radius: 5px;

        background: #f0f0ee;

        color: #555;

        font-size: 10px;

        font-weight: 700;

    }

    .location {

        margin: 16px 0 0;

        color: #777;

        font-size: 12px;

    }

    .status-box {

        padding: 80px 20px;

        text-align: center;

        background: white;

        border-radius: 12px;

        border: 1px solid #dedede;

    }

    .status-box h3 {

        margin: 18px 0 7px;

    }

    .status-box p {

        color: #777;

    }

    .spinner {

        width: 35px;

        height: 35px;

        margin: auto;

        border: 4px solid #ddd;

        border-top-color: #191919;

        border-radius: 50%;

        animation: spin 0.7s linear infinite;

    }

    @keyframes spin {

        to {

            transform: rotate(360deg);

        }

    }

    .error-message {

        margin-bottom: 20px;

        padding: 15px 18px;

        border: 1px solid #e5aaaa;

        border-radius: 8px;

        background: #fff0f0;

        color: #9b1c1c;

        font-size: 13px;

        font-weight: 600;

    }

    .empty {

        padding: 80px 20px;

        text-align: center;

        background: white;

        border-radius: 12px;

    }

    .empty > div {

        font-size: 55px;

    }

    .empty h3 {

        margin-bottom: 7px;

        font-size: 25px;

    }

    .empty p {

        color: #777;

    }

    .empty button {

        margin-top: 10px;

        padding: 12px 18px;

        border: 0;

        border-radius: 7px;

        background: #191919;

        color: white;

    }

    footer {

        display: flex;

        align-items: center;

        justify-content: space-between;

        gap: 25px;

        padding: 45px 6%;

        border-top: 1px solid #ddd;

        background: white;

        color: #777;

        font-size: 12px;

    }

    footer strong {

        color: #111;

        font-size: 18px;

    }

    footer p {

        margin: 5px 0 0;

    }

    @media (max-width: 1000px) {

        .product-grid {

            grid-template-columns: repeat(2, 1fr);

        }

    }

    @media (max-width: 750px) {

        nav {

            display: none;

        }

        .navbar {

            padding: 0 18px;

        }

        .marketplace {

            padding: 35px 20px 70px;

        }

        .page-header {

            padding: 55px 20px 45px;

        }

        .search-row {

            flex-direction: column;

        }

        select {

            height: 52px;

        }

        .product-grid {

            grid-template-columns: 1fr;

        }

        .product-image {

            height: 250px;

        }

        footer {

            padding: 40px 20px;

            flex-direction: column;

            align-items: flex-start;

        }

    }

    @media (max-width: 450px) {

        .brand small {

            display: none;

        }

        .sell-button {

            padding: 11px 13px;

            font-size: 11px;

        }

    }

    .car-filter-panel { margin: 26px 0 8px; padding: 28px; background: white; border: 1px solid #ddd; border-radius: 16px; }

    .car-filter-heading { display: flex; justify-content: space-between; align-items: flex-start; gap: 20px; margin-bottom: 24px; }

    .car-filter-heading h2 { margin: 0 0 6px; font-size: 28px; }

    .car-filter-heading p { margin: 0; color: #777; font-size: 13px; }

    .car-filter-heading .filter-kicker { color: #111; font-size: 10px; letter-spacing: 2px; font-weight: 800; margin-bottom: 8px; }

    .reset-car { border: 1px solid #bbb; border-radius: 8px; padding: 11px 14px; background: #fff; white-space: nowrap; }

    .car-filter-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 16px; }

    .car-filter-grid label { display: flex; flex-direction: column; gap: 7px; font-size: 12px; font-weight: 700; color: #333; }

    .car-filter-grid input, .car-filter-grid select { width: 100%; min-width: 0; height: 45px; border: 1px solid #ddd; border-radius: 8px; padding: 0 10px; background: #fff; color: #111; font-size: 13px; }

    .filter-note { margin: 18px 0 0; font-size: 12px; color: #777; line-height: 1.5; }

    @media (max-width: 1000px) { .car-filter-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); } }

    @media (max-width: 750px) { .car-filter-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } .car-filter-panel { padding: 20px; } }

    @media (max-width: 450px) { .car-filter-grid { grid-template-columns: 1fr; } .car-filter-heading { flex-direction: column; } }


    /* 4KAZ colorful marketplace design - safe visual overrides */
    :global(body) { background: #faf7ff; color: #211536; }
    .navbar { background: rgba(255,255,255,.96); border-bottom: 1px solid #efe3ff; box-shadow: 0 5px 25px rgba(85,26,157,.08); backdrop-filter: blur(14px); }
    .logo { background: linear-gradient(135deg,#7118e8,#ef3da2); border-radius: 15px; box-shadow: 0 8px 18px rgba(118,25,221,.22); }
    .brand strong { color: #7216d9; }
    nav a:hover, nav .active { color: #8421e7; }
    .sell-button { background: linear-gradient(115deg,#7c1dea,#f035a4); border-radius: 13px; box-shadow: 0 8px 20px rgba(126,28,216,.22); transition: transform .2s ease; }
    .sell-button:hover { transform: translateY(-2px); }
    .page-header { position: relative; overflow: hidden; background: linear-gradient(115deg,#6913dd 0%,#a528e9 55%,#ed4b9f 100%); padding-top: 88px; padding-bottom: 76px; }
    .page-header::before { content: ''; position: absolute; width: 340px; height: 340px; border-radius: 50%; background: rgba(255,255,255,.09); top: -170px; right: 8%; pointer-events: none; animation: floatGlow 9s ease-in-out infinite alternate; }
    .page-header::after { content: ''; position: absolute; width: 220px; height: 220px; border-radius: 50%; background: rgba(255,225,120,.13); bottom: -140px; left: 10%; pointer-events: none; animation: floatGlow 8s ease-in-out infinite alternate-reverse; }
    .page-header .eyebrow { color: #ffe99d; }
    .page-header h1 { position: relative; z-index: 1; text-shadow: 0 8px 24px rgba(55,0,105,.2); letter-spacing: -.05em; }
    .page-header > p:last-child { position: relative; color: #fff; }
    .marketplace { max-width: 1600px; margin: auto; }
    .search-row { margin-top: -10px; position: relative; z-index: 2; }
    .search-box, .search-row > select { border: 1px solid #e8d9ff; border-radius: 16px; box-shadow: 0 8px 25px rgba(100,38,162,.06); }
    .search-box:focus-within { border-color: #8e30e9; box-shadow: 0 0 0 3px rgba(142,48,233,.13); }
    .categories { border-bottom-color: #e9dfff; }
    .categories button { background: #fff; border-color: #e5d7f8; color: #52366c; border-radius: 999px; transition: background .2s ease, transform .2s ease; }
    .categories button:hover { transform: translateY(-2px); }
    .categories button:hover, .categories .active-category { background: linear-gradient(115deg,#7d1fe5,#dc3fae); border-color: transparent; color: #fff; }
    .results-heading h2 { color: #281441; }
    .clear-button, .reset-car { border-color: #dfccf8; border-radius: 12px; color: #7620d5; }
    .product-grid { gap: 22px; }
    .product-card { border: 1px solid #ecdefb; border-radius: 22px; box-shadow: 0 8px 24px rgba(87,29,153,.07); transition: transform .25s ease, box-shadow .25s ease; }
    .product-card:hover { transform: translateY(-8px); box-shadow: 0 22px 42px rgba(93,26,173,.16); }
    .product-image { background: #f1eafa; }
    .product-card:hover .product-image img { transform: scale(1.075); }
    .condition { background: #6f1bdb; }
    .condition.new-badge { background: #e7fff0; color: #166c40; }
    .real-listing { background: #fff; color: #7121d8; }
    .favorite { color: #8524e3; }
    .favorite.is-saved { background: #ffe7f0; color: #d21d64; }
    .product-details { padding: 20px; }
    .product-details h3 { color: #24143a; }
    .product-details strong { color: #7a1ce2; }
    .category { color: #8d4abb; }
    .negotiable { background: #f0e8ff; color: #7426bb; border-radius: 999px; }
    .saved-toolbar button { border-color: #e5d7f8; border-radius: 999px; }
    .saved-toolbar button.saved-active { background: #7b1de2; border-color: #7b1de2; }
    .car-filter-panel { border-color: #e8dcfa; border-radius: 22px; box-shadow: 0 12px 30px rgba(85,29,153,.05); }
    .car-filter-heading .filter-kicker { color: #8424df; }
    .car-filter-grid input, .car-filter-grid select { border-color: #e5d9f5; border-radius: 10px; }
    .car-filter-grid input:focus, .car-filter-grid select:focus { outline: 2px solid #aa66e8; outline-offset: 1px; }
    .spinner { border-top-color: #8520e7; }
    .status-box, .empty { border: 1px solid #e8d9f8; border-radius: 20px; }
    .empty button { background: linear-gradient(115deg,#7c1dea,#ed3ca3); border-radius: 12px; }
    footer { border-top-color: #e9dcf9; }
    footer strong { color: #7020d0; }
    @keyframes floatGlow { from { transform: translate(0,0); } to { transform: translate(-40px,30px); } }
    @media (max-width: 750px) {
        .navbar { gap: 10px; }
        .page-header { padding-top: 60px; padding-bottom: 55px; }
        .page-header h1 { letter-spacing: -.04em; }
        .search-row { margin-top: 0; }
        .product-grid { grid-template-columns: repeat(2,minmax(0,1fr)); gap: 12px; }
        .product-image { height: 180px; }
        .product-details { padding: 13px; }
        .product-details h3 { font-size: 14px; }
        .product-details strong { font-size: 16px; }
        .favorite { width: 35px; height: 35px; }
    }
    @media (max-width: 420px) {
        .product-image { height: 145px; }
        .product-details { padding: 11px; }
        .product-details h3 { font-size: 13px; }
        .product-details strong { font-size: 14px; }
        .condition { top: 8px; left: 8px; padding: 5px 7px; font-size: 9px; }
        .real-listing { left: 8px; bottom: 8px; font-size: 8px; }
    }
    @media (prefers-reduced-motion: reduce) { .page-header::before, .page-header::after { animation: none; } .product-card, .product-image img { transition: none; } }

</style>