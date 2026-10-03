<script>
	import { onMount } from 'svelte';

	/**
	 * @typedef {Object} CartItem
	 * @property {number} id
	 * @property {string} title
	 * @property {string} author
	 * @property {number} price
	 * @property {string} image
	 * @property {number} quantity
	 */

	/** @type {CartItem[]} */
	let cart = $state([]);

	let fullName = $state('');
	let phone = $state('');
	let email = $state('');
	let city = $state('');
	let address = $state('');

	let isPaying = $state(false);
	let paymentError = $state('');

	let total = $derived(
		cart.reduce(
			(sum, item) => sum + item.price * item.quantity,
			0
		)
	);

	onMount(() => {
		try {
			const savedCart = localStorage.getItem('4kaz-cart');

			if (savedCart) {
				cart = JSON.parse(savedCart);
			}
		} catch (error) {
			console.error('Could not load cart:', error);
			cart = [];
		}
	});

	async function continueToPayment() {
		paymentError = '';

		if (
			!fullName.trim() ||
			!phone.trim() ||
			!city.trim() ||
			!address.trim()
		) {
			alert('Please complete all required fields.');
			return;
		}

		if (cart.length === 0) {
			alert('Your cart is empty.');
			return;
		}

		if (total <= 0) {
			alert('Invalid order total.');
			return;
		}

		const order = {
			customer: {
				fullName: fullName.trim(),
				phone: phone.trim(),
				email: email.trim(),
				city: city.trim(),
				address: address.trim()
			},
			items: cart,
			total
		};

		try {
			isPaying = true;

			// Save checkout information before leaving the website.
			localStorage.setItem(
				'4kaz-checkout',
				JSON.stringify(order)
			);

			const response = await fetch('/api/chapa/initialize', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					amount: total,
					fullName: fullName.trim(),
					email: email.trim(),
					phone: phone.trim()
				})
			});

			const data = await response.json();

			if (!response.ok || !data.success) {
				throw new Error(
					data.message || 'Unable to initialize payment.'
				);
			}

			if (!data.checkoutUrl) {
				throw new Error(
					'Chapa did not return a checkout URL.'
				);
			}

			// Save the transaction reference for later verification.
			localStorage.setItem(
				'4kaz-chapa-tx-ref',
				data.txRef
			);

			// Send customer to Chapa.
			window.location.href = data.checkoutUrl;
		} catch (error) {
			console.error('Payment error:', error);

			paymentError =
				error instanceof Error
					? error.message
					: 'Unable to connect to Chapa. Please try again.';

			isPaying = false;
		}
	}
</script>

<svelte:head>
	<title>Checkout | 4KAZ Books</title>
	<meta
		name="description"
		content="Complete your order at 4KAZ Books"
	/>
</svelte:head>

<main class="checkout-page">
	<div class="container">
		<a class="back" href="/cart">← Back to Cart</a>

		<h1>Checkout</h1>

		<p class="subtitle">
			Enter your delivery information and review your order.
		</p>

		<div class="checkout-grid">
			<section class="customer-section">
				<h2>Customer Information</h2>

				<div class="form-group">
					<label for="fullName">Full Name *</label>
					<input
						id="fullName"
						type="text"
						bind:value={fullName}
						placeholder="Your full name"
					/>
				</div>

				<div class="form-group">
					<label for="phone">Phone Number *</label>
					<input
						id="phone"
						type="tel"
						bind:value={phone}
						placeholder="09XXXXXXXX"
					/>
				</div>

				<div class="form-group">
					<label for="email">Email Address</label>
					<input
						id="email"
						type="email"
						bind:value={email}
						placeholder="you@example.com"
					/>
				</div>

				<div class="form-group">
					<label for="city">City *</label>
					<input
						id="city"
						type="text"
						bind:value={city}
						placeholder="Addis Ababa"
					/>
				</div>

				<div class="form-group">
					<label for="address">Delivery Address *</label>
					<textarea
						id="address"
						bind:value={address}
						placeholder="Sub-city, area, street or delivery instructions"
						rows="4"
					></textarea>
				</div>
			</section>

			<section class="order-section">
				<h2>Order Summary</h2>

				{#if cart.length === 0}
					<div class="empty-cart">
						<p>Your cart is empty.</p>
						<a href="/books">Browse Books</a>
					</div>
				{:else}
					<div class="items">
						{#each cart as item}
							<div class="order-item">
								<img
									src={item.image}
									alt={item.title}
								/>

								<div class="book-info">
									<strong>{item.title}</strong>
									<span>{item.author}</span>
									<small>
										Quantity: {item.quantity}
									</small>
								</div>

								<strong class="price">
									{(
										item.price * item.quantity
									).toLocaleString()} ETB
								</strong>
							</div>
						{/each}
					</div>

					<div class="total-row">
						<span>Total</span>

						<strong>
							{total.toLocaleString()} ETB
						</strong>
					</div>

					{#if paymentError}
						<div class="payment-error">
							{paymentError}
						</div>
					{/if}

					<button
						class="payment-button"
						onclick={continueToPayment}
						disabled={isPaying}
					>
						{#if isPaying}
							Connecting to Chapa...
						{:else}
							Continue to Payment →
						{/if}
					</button>

					<p class="payment-note">
						🔒 Secure payment powered by Chapa
					</p>
				{/if}
			</section>
		</div>
	</div>
</main>

<style>
	:global(*) {
		box-sizing: border-box;
	}

	.checkout-page {
		min-height: 100vh;
		background: #f5f7fb;
		padding: 50px 20px 80px;
		color: #172033;
	}

	.container {
		max-width: 1150px;
		margin: 0 auto;
	}

	.back {
		display: inline-block;
		margin-bottom: 25px;
		color: #3157d5;
		text-decoration: none;
		font-weight: 700;
	}

	h1 {
		margin: 0;
		font-size: clamp(2rem, 5vw, 3.5rem);
	}

	.subtitle {
		margin: 10px 0 35px;
		color: #687086;
		font-size: 1.05rem;
	}

	.checkout-grid {
		display: grid;
		grid-template-columns: 1.1fr 0.9fr;
		gap: 30px;
		align-items: start;
	}

	.customer-section,
	.order-section {
		background: white;
		border-radius: 18px;
		padding: 30px;
		box-shadow: 0 8px 30px rgba(30, 45, 80, 0.08);
	}

	h2 {
		margin-top: 0;
		margin-bottom: 25px;
	}

	.form-group {
		margin-bottom: 20px;
	}

	label {
		display: block;
		margin-bottom: 8px;
		font-weight: 700;
	}

	input,
	textarea {
		width: 100%;
		border: 1px solid #d7dce7;
		border-radius: 10px;
		padding: 13px 14px;
		font: inherit;
		background: #fff;
		color: #172033;
		outline: none;
	}

	input:focus,
	textarea:focus {
		border-color: #3157d5;
		box-shadow: 0 0 0 3px rgba(49, 87, 213, 0.1);
	}

	textarea {
		resize: vertical;
	}

	.items {
		display: flex;
		flex-direction: column;
		gap: 18px;
	}

	.order-item {
		display: grid;
		grid-template-columns: 65px 1fr auto;
		gap: 14px;
		align-items: center;
		padding-bottom: 18px;
		border-bottom: 1px solid #e7eaf0;
	}

	.order-item img {
		width: 65px;
		height: 82px;
		object-fit: cover;
		border-radius: 8px;
		background: #eef0f5;
	}

	.book-info {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.book-info span,
	.book-info small {
		color: #737b8f;
	}

	.price {
		white-space: nowrap;
	}

	.total-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 25px;
		padding-top: 20px;
		font-size: 1.3rem;
	}

	.total-row strong {
		font-size: 1.6rem;
	}

	.payment-error {
		margin-top: 20px;
		padding: 12px 14px;
		border-radius: 10px;
		background: #fff1f1;
		color: #b42318;
		font-size: 0.9rem;
		font-weight: 700;
	}

	.payment-button {
		width: 100%;
		margin-top: 25px;
		padding: 15px 20px;
		border: 0;
		border-radius: 10px;
		background: #172033;
		color: white;
		font-size: 1rem;
		font-weight: 800;
		cursor: pointer;
		transition:
			transform 0.15s ease,
			opacity 0.15s ease;
	}

	.payment-button:hover:not(:disabled) {
		transform: translateY(-2px);
		opacity: 0.92;
	}

	.payment-button:disabled {
		opacity: 0.65;
		cursor: not-allowed;
	}

	.payment-note {
		text-align: center;
		color: #737b8f;
		font-size: 0.85rem;
		margin-bottom: 0;
		margin-top: 14px;
	}

	.empty-cart {
		text-align: center;
		padding: 40px 10px;
		color: #687086;
	}

	.empty-cart a {
		display: inline-block;
		margin-top: 10px;
		color: #3157d5;
		font-weight: 700;
		text-decoration: none;
	}

	@media (max-width: 800px) {
		.checkout-grid {
			grid-template-columns: 1fr;
		}

		.customer-section,
		.order-section {
			padding: 22px;
		}

		.order-item {
			grid-template-columns: 55px 1fr;
		}

		.order-item img {
			width: 55px;
			height: 72px;
		}

		.price {
			grid-column: 2;
		}
	}
</style>