import { browser } from '$app/environment';

/**
 * @typedef {Object} Book
 * @property {number} id
 * @property {string} title
 * @property {string} author
 * @property {string} category
 * @property {number} price
 * @property {string} image
 */

/**
 * @typedef {Book & { quantity: number }} CartItem
 */

/** @type {CartItem[]} */
let cart = $state([]);

let loaded = false;

function loadCart() {
    if (!browser || loaded) return;

    loaded = true;

    const saved = localStorage.getItem('4kaz-cart');

    if (!saved) return;

    try {
        /** @type {CartItem[]} */
        const savedItems = JSON.parse(saved);

        cart.splice(0, cart.length, ...savedItems);
    } catch (error) {
        console.error('Could not load cart:', error);
        localStorage.removeItem('4kaz-cart');
    }
}

function saveCart() {
    if (!browser) return;

    localStorage.setItem(
        '4kaz-cart',
        JSON.stringify(cart)
    );
}

export function getCart() {
    loadCart();
    return cart;
}

/**
 * @param {Book} book
 */
export function addToCart(book) {
    loadCart();

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

    saveCart();
}

/**
 * @param {number} id
 */
export function removeFromCart(id) {
    loadCart();

    const index = cart.findIndex(
        (item) => item.id === id
    );

    if (index !== -1) {
        cart.splice(index, 1);
        saveCart();
    }
}

/**
 * @param {number} id
 */
export function increaseQuantity(id) {
    loadCart();

    const book = cart.find(
        (item) => item.id === id
    );

    if (book) {
        book.quantity += 1;
        saveCart();
    }
}

/**
 * @param {number} id
 */
export function decreaseQuantity(id) {
    loadCart();

    const book = cart.find(
        (item) => item.id === id
    );

    if (!book) return;

    if (book.quantity > 1) {
        book.quantity -= 1;
        saveCart();
    } else {
        removeFromCart(id);
    }
}

export function cartCount() {
    loadCart();

    return cart.reduce(
        (total, item) => total + item.quantity,
        0
    );
}

export function cartTotal() {
    loadCart();

    return cart.reduce(
        (total, item) =>
            total + item.price * item.quantity,
        0
    );
}