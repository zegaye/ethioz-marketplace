<script>
    let search = $state('');

    const categories = [
        {
            name: 'Fiction',
            image: '/images/fiction.jpg',
            description: 'Novels, stories and literature'
        },
        {
            name: 'Business',
            image: '/images/business.jpg',
            description: 'Business, money and entrepreneurship'
        },
        {
            name: 'Technology',
            image: '/images/technology.jfif',
            description: 'Programming, AI and technology'
        }
    ];

    function searchBooks() {
        if (!search.trim()) return;

        window.location.href =
            `/books?search=${encodeURIComponent(search.trim())}`;
    }
</script>

<svelte:head>
    <title>4KAZ Books | Online Bookstore</title>
    <meta
        name="description"
        content="Discover and buy books from 4KAZ Books."
    />
</svelte:head>

<header class="navbar">
    <div class="brand">
        <img
            src="/images/ethioz logo.jpg"
            alt="4KAZ Books"
            class="logo"
        />

        <a href="/" class="company-name">4KAZ BOOKS</a>
    </div>

    <nav>
        <a href="/">Home</a>
        <a href="/books">Books</a>
        <a href="#categories">Categories</a>
        <a href="/about">About</a>
        <a href="/contact">Contact</a>
    </nav>

    <div class="account">
        <a class="cart" href="/cart">
            🛒 Cart
        </a>
    </div>
</header>

<main>

    <!-- HERO -->
    <section class="hero">

        <p class="eyebrow">4KAZ ONLINE BOOKSTORE</p>

        <h1>
            READ.<br />
            LEARN. <span>GROW.</span>
        </h1>

        <p class="hero-description">
            Discover books that entertain, educate and inspire.
            Find your next great read at 4KAZ Books.
        </p>

        <form
            class="search-box"
            onsubmit={(event) => {
                event.preventDefault();
                searchBooks();
            }}
        >
            <span class="search-icon">⌕</span>

            <input
                bind:value={search}
                type="search"
                placeholder="Search by title, author or category..."
            />

            <button type="submit">Search</button>
        </form>

        <div class="popular">
            <span>Popular:</span>

            <a href="/books?category=Fiction">Fiction</a>
            <a href="/books?category=Business">Business</a>
            <a href="/books?category=Technology">Technology</a>
        </div>

    </section>

    <!-- CATEGORIES -->
    <section class="books-section" id="categories">

        <div class="section-top">
            <div>
                <p class="eyebrow">EXPLORE</p>
                <h2>Book Categories</h2>
            </div>

            <a href="/books">View all books →</a>
        </div>

        <div class="category-grid">

            {#each categories as category}

                <a
                    class="category-card"
                    href={`/books?category=${category.name}`}
                >
                    <img
                        src={category.image}
                        alt={category.name}
                    />

                    <div class="overlay"></div>

                    <div class="card-content">
                        <p>EXPLORE</p>

                        <h3>{category.name}</h3>

                        <span>
                            {category.description}
                        </span>
                    </div>

                    <div class="arrow">↗</div>
                </a>

            {/each}

        </div>

    </section>

    <!-- ABOUT -->
    <section class="about">

        <div>
            <p class="eyebrow light">
                4KAZ BOOKS
            </p>

            <h2>
                FIND YOUR<br />
                NEXT BOOK.
            </h2>

            <p class="about-text">
                From powerful business books to unforgettable
                fiction and modern technology guides, discover
                books for every kind of reader.
            </p>
        </div>

        <a class="start-button" href="/books">
            Start Shopping →
        </a>

    </section>

</main>

<footer>

    <div class="footer-brand">

        <img
            src="/images/ethioz logo.jpg"
            alt="4KAZ Books"
        />

        <div>
            <h2>4KAZ</h2>
            <p>Online Bookstore</p>
        </div>

    </div>

    <div>
        Fiction · Business · Technology
    </div>

    <div>
        © 2026 4KAZ Books
    </div>

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
        background: #f2f2f0;
        color: #171717;
    }

    button,
    input {
        font-family: inherit;
    }

    button {
        cursor: pointer;
    }


    /* NAVIGATION */

    .navbar {
        height: 86px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 5%;
        background: rgba(242, 242, 240, 0.96);
        border-bottom: 1px solid #d6d6d6;
        position: sticky;
        top: 0;
        z-index: 100;
    }

    .brand {
        display: flex;
        align-items: center;
        gap: 12px;
    }

    .logo {
        width: 50px;
        height: 50px;
        object-fit: contain;
    }

    .company-name {
        font-size: 24px;
        font-weight: 900;
        text-decoration: none;
        color: #111;
        letter-spacing: -1px;
    }

    nav {
        display: flex;
        gap: 28px;
    }

    nav a {
        text-decoration: none;
        color: #222;
        font-size: 14px;
        font-weight: 600;
    }

    nav a:hover {
        opacity: 0.5;
    }

    .cart {
        display: inline-block;
        background: #191919;
        color: white;
        text-decoration: none;
        padding: 14px 22px;
        border-radius: 8px;
        font-weight: bold;
    }


    /* HERO */

    .hero {
        min-height: 680px;
        padding: 90px 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
    }

    .eyebrow {
        font-size: 11px;
        font-weight: 800;
        letter-spacing: 4px;
        margin: 0 0 25px;
    }

    .hero h1 {
        margin: 0;
        font-size: clamp(70px, 11vw, 155px);
        line-height: 0.8;
        letter-spacing: -8px;
        font-weight: 900;
    }

    .hero h1 span {
        color: #666;
    }

    .hero-description {
        max-width: 600px;
        margin-top: 40px;
        font-size: 18px;
        line-height: 1.6;
        color: #666;
    }


    /* SEARCH */

    .search-box {
        width: min(760px, 100%);
        background: white;
        display: flex;
        align-items: center;
        padding: 9px 9px 9px 20px;
        border-radius: 12px;
        margin-top: 30px;
        box-shadow: 0 15px 50px rgba(0,0,0,0.08);
    }

    .search-icon {
        font-size: 27px;
    }

    .search-box input {
        flex: 1;
        border: none;
        outline: none;
        padding: 18px;
        font-size: 15px;
        min-width: 0;
    }

    .search-box button {
        background: #191919;
        color: white;
        border: none;
        border-radius: 8px;
        padding: 17px 30px;
        font-weight: bold;
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
        color: #111;
        text-decoration: none;
        border: 1px solid #ccc;
        border-radius: 30px;
        padding: 8px 15px;
    }

    .popular a:hover {
        background: #191919;
        color: white;
    }


    /* BOOK CATEGORIES */

    .books-section {
        background: white;
        padding: 100px 6%;
    }

    .section-top {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        margin-bottom: 50px;
    }

    .section-top h2 {
        font-size: clamp(45px, 6vw, 80px);
        letter-spacing: -5px;
        margin: 0;
    }

    .section-top > a {
        color: #111;
        font-weight: bold;
    }

    .category-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 20px;
    }

    .category-card {
        height: 500px;
        position: relative;
        overflow: hidden;
        border-radius: 15px;
        text-decoration: none;
        background: #222;
    }

    .category-card img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
        transition: transform 0.5s ease;
    }

    .category-card:hover img {
        transform: scale(1.07);
    }

    .overlay {
        position: absolute;
        inset: 0;
        background: linear-gradient(
            to top,
            rgba(0,0,0,0.9),
            rgba(0,0,0,0.05)
        );
    }

    .card-content {
        position: absolute;
        left: 30px;
        bottom: 30px;
        color: white;
    }

    .card-content p {
        font-size: 10px;
        letter-spacing: 3px;
        margin-bottom: 8px;
    }

    .card-content h3 {
        font-size: 42px;
        margin: 0 0 7px;
        letter-spacing: -2px;
    }

    .card-content span {
        font-size: 14px;
        color: #ddd;
    }

    .arrow {
        position: absolute;
        top: 25px;
        right: 25px;
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: white;
        color: #111;
        border-radius: 50%;
        font-size: 22px;
    }


    /* ABOUT */

    .about {
        margin: 80px 6%;
        min-height: 430px;
        background: #181818;
        color: white;
        border-radius: 18px;
        padding: 65px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 50px;
    }

    .light {
        color: #aaa;
    }

    .about h2 {
        font-size: clamp(55px, 7vw, 100px);
        line-height: 0.85;
        letter-spacing: -6px;
        margin: 0 0 30px;
    }

    .about-text {
        max-width: 500px;
        color: #aaa;
        line-height: 1.6;
    }

    .start-button {
        background: white;
        color: #111;
        text-decoration: none;
        border-radius: 8px;
        padding: 19px 28px;
        font-weight: bold;
        white-space: nowrap;
    }


    /* FOOTER */

    footer {
        border-top: 1px solid #ccc;
        padding: 55px 6%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 30px;
        color: #666;
        font-size: 13px;
    }

    .footer-brand {
        display: flex;
        align-items: center;
        gap: 12px;
    }

    .footer-brand img {
        width: 45px;
        height: 45px;
        object-fit: contain;
    }

    .footer-brand h2 {
        color: #111;
        font-size: 24px;
        margin: 0;
    }

    .footer-brand p {
        margin: 3px 0 0;
    }


    /* MOBILE */

    @media (max-width: 850px) {

        nav {
            display: none;
        }

        .navbar {
            padding: 0 20px;
        }

        .company-name {
            font-size: 19px;
        }

        .hero {
            min-height: 600px;
            padding: 70px 20px;
        }

        .hero h1 {
            letter-spacing: -5px;
        }

        .category-grid {
            grid-template-columns: 1fr;
        }

        .category-card {
            height: 420px;
        }

        .books-section {
            padding: 70px 20px;
        }

        .section-top {
            align-items: flex-start;
            gap: 20px;
        }

        .about {
            margin: 40px 20px;
            padding: 45px 30px;
            flex-direction: column;
            align-items: flex-start;
        }

        .about h2 {
            letter-spacing: -4px;
        }

        footer {
            padding: 40px 20px;
            flex-direction: column;
            align-items: flex-start;
        }
    }

</style>