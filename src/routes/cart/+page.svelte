<script>
    import {
        getCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        cartTotal,
        cartCount
    } from '$lib/cart.svelte.js';

    const cart = getCart();
</script>

<svelte:head>
    <title>Shopping Cart | 4KAZ Books</title>
</svelte:head>

<header>
    <a href="/" class="brand">4KAZ BOOKS</a>

    <nav>
        <a href="/">Home</a>
        <a href="/books">Books</a>
        <a href="/about">About</a>
        <a href="/contact">Contact</a>
    </nav>

    <a href="/cart" class="cart-button">
        🛒 Cart ({cartCount()})
    </a>
</header>

<main>
    <div class="title-area">
        <p>YOUR ORDER</p>
        <h1>Shopping Cart.</h1>
    </div>

    {#if cart.length === 0}

        <section class="empty-cart">
            <div class="empty-icon">📚</div>

            <h2>Your cart is empty</h2>

            <p>
                You haven't added any books yet.
            </p>

            <a href="/books">
                Explore Books →
            </a>
        </section>

    {:else}

        <div class="cart-layout">

            <section class="items">

                {#each cart as item}

                    <article class="cart-item">

                        <img
                            src={item.image}
                            alt={item.title}
                        />

                        <div class="book-info">

                            <span class="category">
                                {item.category}
                            </span>

                            <h2>{item.title}</h2>

                            <p>by {item.author}</p>

                            <strong>
                                {item.price.toLocaleString()} ETB
                            </strong>

                        </div>

                        <div class="actions">

                            <div class="quantity">

                                <button
                                    onclick={() =>
                                        decreaseQuantity(item.id)}
                                    aria-label={`Decrease ${item.title} quantity`}
                                >
                                    −
                                </button>

                                <span>
                                    {item.quantity}
                                </span>

                                <button
                                    onclick={() =>
                                        increaseQuantity(item.id)}
                                    aria-label={`Increase ${item.title} quantity`}
                                >
                                    +
                                </button>

                            </div>

                            <strong class="subtotal">
                                {(item.price * item.quantity)
                                    .toLocaleString()} ETB
                            </strong>

                            <button
                                class="remove"
                                onclick={() =>
                                    removeFromCart(item.id)}
                            >
                                Remove
                            </button>

                        </div>

                    </article>

                {/each}

            </section>

            <aside class="summary">

                <p class="summary-label">
                    ORDER SUMMARY
                </p>

                <h2>Your Order</h2>

                <div class="summary-row">
                    <span>Items</span>
                    <span>{cartCount()}</span>
                </div>

                <div class="summary-row">
                    <span>Subtotal</span>

                    <span>
                        {cartTotal().toLocaleString()} ETB
                    </span>
                </div>

                <div class="summary-row">
                    <span>Delivery</span>
                    <span>Calculated at checkout</span>
                </div>

                <div class="divider"></div>

                <div class="total">
                    <span>Total</span>

                    <strong>
                        {cartTotal().toLocaleString()} ETB
                    </strong>
                </div>

                <a class="checkout" href="/checkout">
                    Proceed to Checkout →
                </a>

                <a class="continue" href="/books">
                    ← Continue Shopping
                </a>

            </aside>

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
    }

    .brand {
        color: #111;
        text-decoration: none;
        font-size: 23px;
        font-weight: 900;
    }

    nav {
        display: flex;
        gap: 30px;
    }

    nav a {
        color: #333;
        text-decoration: none;
        font-size: 14px;
        font-weight: 600;
    }

    .cart-button {
        background: #191919;
        color: white;
        padding: 14px 20px;
        border-radius: 8px;
        text-decoration: none;
        font-weight: bold;
    }

    main {
        max-width: 1400px;
        margin: auto;
        padding: 70px 5% 120px;
    }

    .title-area p {
        margin: 0;
        font-size: 11px;
        font-weight: 800;
        letter-spacing: 4px;
    }

    .title-area h1 {
        margin: 15px 0 60px;
        font-size: clamp(55px, 7vw, 100px);
        letter-spacing: -6px;
    }

    .cart-layout {
        display: grid;
        grid-template-columns: minmax(0, 2fr) minmax(300px, 0.8fr);
        gap: 40px;
        align-items: start;
    }

    .items {
        display: flex;
        flex-direction: column;
        gap: 18px;
    }

    .cart-item {
        display: grid;
        grid-template-columns: 140px 1fr auto;
        gap: 25px;
        align-items: center;
        padding: 20px;
        background: white;
        border-radius: 14px;
    }

    .cart-item img {
        width: 140px;
        height: 180px;
        object-fit: cover;
        border-radius: 8px;
    }

    .category {
        color: #888;
        font-size: 11px;
        font-weight: bold;
        text-transform: uppercase;
        letter-spacing: 1px;
    }

    .book-info h2 {
        margin: 8px 0;
        font-size: 25px;
    }

    .book-info p {
        margin: 0 0 20px;
        color: #777;
    }

    .actions {
        min-width: 150px;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 18px;
    }

    .quantity {
        display: flex;
        align-items: center;
        border: 1px solid #ddd;
        border-radius: 8px;
        overflow: hidden;
    }

    .quantity button {
        width: 40px;
        height: 40px;
        border: none;
        background: #f3f3f3;
        font-size: 20px;
        cursor: pointer;
    }

    .quantity span {
        min-width: 40px;
        text-align: center;
        font-weight: bold;
    }

    .subtotal {
        font-size: 17px;
    }

    .remove {
        padding: 0;
        border: none;
        background: transparent;
        color: #777;
        text-decoration: underline;
        cursor: pointer;
    }

    .summary {
        position: sticky;
        top: 30px;
        padding: 30px;
        background: #191919;
        color: white;
        border-radius: 15px;
    }

    .summary-label {
        color: #aaa;
        font-size: 10px;
        font-weight: bold;
        letter-spacing: 3px;
    }

    .summary h2 {
        margin: 12px 0 30px;
        font-size: 30px;
    }

    .summary-row {
        display: flex;
        justify-content: space-between;
        gap: 20px;
        margin: 18px 0;
        color: #ccc;
        font-size: 14px;
    }

    .divider {
        height: 1px;
        margin: 25px 0;
        background: #444;
    }

    .total {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 30px;
        font-size: 18px;
    }

    .total strong {
        font-size: 24px;
    }

    .checkout {
        display: block;
        padding: 17px;
        background: white;
        color: #111;
        border-radius: 8px;
        text-decoration: none;
        text-align: center;
        font-weight: bold;
    }

    .continue {
        display: block;
        margin-top: 20px;
        color: #aaa;
        text-align: center;
        text-decoration: none;
        font-size: 13px;
    }

    .empty-cart {
        padding: 100px 20px;
        background: white;
        border-radius: 15px;
        text-align: center;
    }

    .empty-icon {
        font-size: 60px;
    }

    .empty-cart h2 {
        margin-bottom: 10px;
        font-size: 32px;
    }

    .empty-cart p {
        margin-bottom: 30px;
        color: #777;
    }

    .empty-cart a {
        display: inline-block;
        padding: 16px 25px;
        background: #191919;
        color: white;
        border-radius: 8px;
        text-decoration: none;
        font-weight: bold;
    }

    @media (max-width: 850px) {
        nav {
            display: none;
        }

        .cart-layout {
            grid-template-columns: 1fr;
        }

        .cart-item {
            grid-template-columns: 100px 1fr;
        }

        .cart-item img {
            width: 100px;
            height: 140px;
        }

        .actions {
            grid-column: 1 / -1;
            width: 100%;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
        }

        .summary {
            position: static;
        }

        .title-area h1 {
            letter-spacing: -4px;
        }
    }
</style>