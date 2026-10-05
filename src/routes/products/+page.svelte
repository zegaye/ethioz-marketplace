<script>
    import { page } from '$app/state';
    import { onMount } from 'svelte';
    import { supabase } from '$lib/supabase.js';

    const categories = [
        'All',
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

    let databaseProducts = $state([]);
    let loading = $state(true);
    let loadError = $state('');

    const sampleProducts = [
        {
            id: 'sample-1',
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

    let filteredProducts = $derived(
        allProducts.filter((product) => {
            const matchesSearch = product.title
                .toLowerCase()
                .includes(search.trim().toLowerCase());

            const matchesCategory =
                selectedCategory === 'All' ||
                product.category === selectedCategory;

            const matchesCondition =
                selectedCondition === 'All' ||
                product.condition === selectedCondition;

            return (
                matchesSearch &&
                matchesCategory &&
                matchesCondition
            );
        })
    );

    onMount(() => {
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
                database: true
            };
        });

        loading = false;
    }

    function formatPrice(price) {
        return new Intl.NumberFormat('en-US').format(price);
    }

    function clearFilters() {
        search = '';
        selectedCategory = 'All';
        selectedCondition = 'All';

        window.history.replaceState(
            {},
            '',
            '/products'
        );
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

        <div class="results-heading">
            <div>
                <h2>
                    {selectedCategory === 'All'
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

            {#if search || selectedCategory !== 'All' || selectedCondition !== 'All'}
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
                                ? `/product/${product.id}`
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
                                {/if}

                                <button
                                    class="favorite"
                                    type="button"
                                    aria-label="Save item"
                                    onclick={(event) => {
                                        event.preventDefault();
                                        event.stopPropagation();
                                    }}
                                >
                                    ♡
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
</style>