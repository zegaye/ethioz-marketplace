<script>
    import { browser } from '$app/environment';

    let search = $state('');
    let selectedCategory = $state('All');
    let cartCount = $state(0);

    const books = [
        {
            id: 1,
            title: 'The Silent Journey',
            author: 'Daniel Tesfaye',
            category: 'Fiction',
            price: 450,
            image: '/images/fiction.jpg'
        },
        {
            id: 2,
            title: 'Build Your Business',
            author: 'Samuel Bekele',
            category: 'Business',
            price: 600,
            image: '/images/business.jpg'
        },
        {
            id: 3,
            title: 'Modern Technology',
            author: 'Michael Tadesse',
            category: 'Technology',
            price: 750,
            image: '/images/technology.jfif'
        }
    ];

    const categories = ['All', 'Fiction', 'Business', 'Technology'];

    let filteredBooks = $derived(
        books.filter((book) => {
            const matchesCategory =
                selectedCategory === 'All' ||
                book.category === selectedCategory;

            const matchesSearch =
                book.title
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||
                book.author
                    .toLowerCase()
                    .includes(search.toLowerCase());

            return matchesCategory && matchesSearch;
        })
    );

    function updateCartCount() {
        if (!browser) return;

        try {
            const saved = localStorage.getItem('4kaz-cart');

            if (!saved) {
                cartCount = 0;
                return;
            }

            const cart = JSON.parse(saved);

            cartCount = cart.reduce(
                (total, item) => total + item.quantity,
                0
            );
        } catch {
            cartCount = 0;
        }
    }

    function addToCart(book) {
        if (!browser) return;

        let cart = [];

        try {
            const saved = localStorage.getItem('4kaz-cart');

            if (saved) {
                cart = JSON.parse(saved);
            }
        } catch {
            cart = [];
        }

        const existingBook = cart.find(
            (item) => item.id === book.id
        );

        if (existingBook) {
            existingBook.quantity += 1;
        } else {
            cart.push({
                ...book,
                quantity: 1
            });
        }

        localStorage.setItem(
            '4kaz-cart',
            JSON.stringify(cart)
        );

        updateCartCount();
    }

    $effect(() => {
        if (browser) {
            updateCartCount();
        }
    });
</script>

<svelte:head>
    <title>Books | 4KAZ Books</title>
    <meta
        name="description"
        content="Browse books from 4KAZ Books."
    />
</svelte:head>

<header>
    <a class="logo" href="/">4KAZ BOOKS</a>

    <nav>
        <a href="/">Home</a>
        <a href="/books">Books</a>
        <a href="/about">About</a>
        <a href="/contact">Contact</a>
    </nav>

    <a class="cart" href="/cart">
        🛒 Cart ({cartCount})
    </a>
</header>

<main>
    <section class="hero">
        <p class="eyebrow">4KAZ BOOKSTORE</p>

        <h1>Books.</h1>

        <p class="subtitle">
            Discover stories, business ideas and modern technology.
        </p>
    </section>

    <section class="controls">
        <input
            type="search"
            placeholder="Search books..."
            bind:value={search}
            aria-label="Search books"
        />

        <div class="categories">
            {#each categories as category}
                <button
                    class:active={selectedCategory === category}
                    onclick={() => selectedCategory = category}
                >
                    {category}
                </button>
            {/each}
        </div>
    </section>

    <section class="books">
        {#each filteredBooks as book}
            <article class="book-card">

                <div class="image-wrapper">
                    <img
                        src={book.image}
                        alt={book.title}
                    />

                    <span class="badge">
                        {book.category}
                    </span>
                </div>

                <div class="information">
                    <p class="author">
                        {book.author}
                    </p>

                    <h2>
                        {book.title}
                    </h2>

                    <div class="bottom">
                        <strong>
                            {book.price.toLocaleString()} ETB
                        </strong>
<button
    class="add-button"
    onclick={() => addToCart(book)}
>
    Add to Cart
</button>
                    </div>
                </div>

            </article>
        {/each}
    </section>

    {#if filteredBooks.length === 0}
        <div class="empty">
            <h2>No books found 📚</h2>
            <p>Try another search.</p>
        </div>
    {/if}
</main>

<style>
    :global(*) {
        box-sizing: border-box;
    }

    :global(body) {
        margin: 0;
        background: #f5f5f2;
        color: #171717;
        font-family: Arial, Helvetica, sans-serif;
    }

    header {
        height: 86px;
        padding: 0 5%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: white;
        border-bottom: 1px solid #ddd;
        position: sticky;
        top: 0;
        z-index: 20;
    }

    .logo {
        color: #171717;
        text-decoration: none;
        font-size: 22px;
        font-weight: 900;
    }

    nav {
        display: flex;
        gap: 32px;
    }

    nav a {
        color: #171717;
        text-decoration: none;
        font-size: 14px;
        font-weight: 700;
    }

    .cart {
        padding: 14px 20px;
        background: #171717;
        color: white;
        border-radius: 8px;
        text-decoration: none;
        font-weight: 700;
    }

    main {
        max-width: 1400px;
        margin: auto;
        padding: 70px 5% 120px;
    }

    .hero {
        margin-bottom: 60px;
    }

    .eyebrow {
        margin: 0;
        font-size: 11px;
        font-weight: 800;
        letter-spacing: 4px;
    }

    h1 {
        margin: 10px 0;
        font-size: clamp(70px, 10vw, 140px);
        line-height: 0.9;
        letter-spacing: -7px;
    }

    .subtitle {
        color: #777;
        font-size: 17px;
    }

    .controls {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 30px;
        margin-bottom: 40px;
    }

    input {
        width: min(420px, 100%);
        padding: 16px 18px;
        border: 1px solid #ddd;
        border-radius: 30px;
        background: white;
        font-size: 15px;
        outline: none;
    }

    .categories {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
    }

    .categories button {
        padding: 11px 19px;
        border: 1px solid #ccc;
        border-radius: 30px;
        background: transparent;
        cursor: pointer;
    }

    .categories button.active {
        background: #171717;
        color: white;
        border-color: #171717;
    }

    .books {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 28px;
    }

    .book-card {
        overflow: hidden;
        background: white;
        border-radius: 15px;
    }

    .image-wrapper {
        height: 390px;
        position: relative;
        overflow: hidden;
    }

    .image-wrapper img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
    }

    .badge {
        position: absolute;
        top: 16px;
        left: 16px;
        padding: 8px 14px;
        background: white;
        border-radius: 30px;
        font-size: 11px;
        font-weight: 700;
    }

    .information {
        padding: 24px;
    }

    .author {
        margin: 0 0 8px;
        color: #888;
        font-size: 13px;
    }

    .information h2 {
        margin: 0 0 35px;
        font-size: 25px;
    }

    .bottom {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 20px;
    }

    .bottom strong {
        font-size: 18px;
    }

    .add-button {
        padding: 13px 18px;
        border: none;
        border-radius: 7px;
        background: #171717;
        color: white;
        font-weight: 700;
        cursor: pointer;
    }

    .add-button:hover {
        opacity: 0.82;
    }

    .empty {
        padding: 80px 20px;
        text-align: center;
    }

    @media (max-width: 950px) {
        .books {
            grid-template-columns: repeat(2, 1fr);
        }

        .controls {
            align-items: flex-start;
            flex-direction: column;
        }
    }

    @media (max-width: 650px) {
        nav {
            display: none;
        }

        header {
            padding: 0 20px;
        }

        main {
            padding-left: 20px;
            padding-right: 20px;
        }

        .books {
            grid-template-columns: 1fr;
        }

        .image-wrapper {
            height: 430px;
        }

        h1 {
            letter-spacing: -4px;
        }
    }
</style>