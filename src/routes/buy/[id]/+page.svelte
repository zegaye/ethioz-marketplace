<script>
	import { page } from '$app/state';

	/**
	 * @typedef {Object} Book
	 * @property {number} id
	 * @property {string} title
	 * @property {string} author
	 * @property {number} price
	 * @property {string} image
	 */

	/** @type {Book[]} */
	const books = [
		{
			id: 1,
			title: 'The Silent Journey',
			author: 'Daniel Tesfaye',
			price: 450,
			image: '/images/fiction.jpg'
		},
		{
			id: 2,
			title: 'Build Your Business',
			author: 'Samuel Bekele',
			price: 600,
			image: '/images/bussiness.jpg'
		},
		{
			id: 3,
			title: 'Modern Technology',
			author: 'Michael Tadesse',
			price: 750,
			image: '/images/technology.jpg'
		}
	];

	const bookId = $derived(Number(page.params.id));

	const book = $derived(
		books.find((item) => item.id === bookId)
	);

	let fullName = $state('');
	let phone = $state('');
	let email = $state('');

	let isPaying = $state(false);
	let paymentError = $state('');

	async function payWithChapa() {
		if (!book) return;

		paymentError = '';

		if (!fullName.trim()) {
			paymentError = 'Please enter your full name.';
			return;
		}

		if (!phone.trim()) {
			paymentError = 'Please enter your phone number.';
			return;
		}

		isPaying = true;

		try {
			const response = await fetch('/api/chapa/initialize', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
	bookId: book.id,
	fullName: fullName.trim(),
	phone: phone.trim(),
	email: email.trim()
})
			});

			const data = await response.json();

			if (!response.ok || !data.success || !data.checkoutUrl) {
				throw new Error(
					data.message || 'Unable to start payment.'
				);
			}

			localStorage.setItem(
				'4kaz-purchase',
				JSON.stringify({
					bookId: book.id,
					title: book.title,
					txRef: data.txRef
				})
			);

			window.location.href = data.checkoutUrl;
		} catch (error) {
			console.error(error);

			paymentError =
				error instanceof Error
					? error.message
					: 'Unable to connect to Chapa.';
		} finally {
			isPaying = false;
		}
	}
</script>

<svelte:head>
	<title>{book ? `${book.title} | 4KAZ Books` : 'Book | 4KAZ Books'}</title>
</svelte:head>

<main class="purchase-page">
	{#if book}

		<a class="back" href="/books">
			← Back to Books
		</a>

		<div class="purchase-card">

			<section class="book-section">

				<img
					src={book.image}
					alt={book.title}
				/>

				<div>
					<p class="digital-label">
						DIGITAL BOOK
					</p>

					<h1>{book.title}</h1>

					<p class="author">
						by {book.author}
					</p>

					<p class="price">
						{book.price} ETB
					</p>

					<p class="description">
						After successful payment, you will be
						able to download your digital copy.
					</p>
				</div>

			</section>

			<section class="payment-section">

				<h2>Get your digital copy</h2>

				<p class="secure">
					Enter your details and continue to secure payment.
				</p>

				<label for="fullName">
					Full Name
				</label>

				<input
					id="fullName"
					type="text"
					placeholder="Your full name"
					bind:value={fullName}
				/>

				<label for="phone">
					Phone Number
				</label>

				<input
					id="phone"
					type="tel"
					placeholder="09xxxxxxxx"
					bind:value={phone}
				/>

				<label for="email">
					Email
					<span>(optional)</span>
				</label>

				<input
					id="email"
					type="email"
					placeholder="you@example.com"
					bind:value={email}
				/>

				{#if paymentError}
					<div class="error">
						{paymentError}
					</div>
				{/if}

				<button
					class="pay-button"
					onclick={payWithChapa}
					disabled={isPaying}
				>
					{isPaying
						? 'Connecting to Chapa...'
						: `Pay ${book.price} ETB with Chapa`}
				</button>

				<p class="notice">
					🔒 Payment is processed securely through Chapa.
				</p>

			</section>

		</div>

	{:else}

		<div class="not-found">
			<h1>Book not found</h1>
			<p>This digital book does not exist.</p>
			<a href="/books">Return to Books</a>
		</div>

	{/if}
</main>

<style>
	.purchase-page {
		max-width: 1050px;
		margin: 0 auto;
		padding: 45px 24px 80px;
	}

	.back {
		display: inline-block;
		margin-bottom: 25px;
		color: #333;
		text-decoration: none;
		font-weight: 600;
	}

	.purchase-card {
		display: grid;
		grid-template-columns: 1fr 1fr;
		background: white;
		border: 1px solid #e4e4e4;
		border-radius: 18px;
		overflow: hidden;
		box-shadow: 0 15px 45px rgba(0, 0, 0, 0.06);
	}

	.book-section {
		background: #f6f6f6;
		padding: 45px;
	}

	.book-section img {
		display: block;
		width: 220px;
		height: 300px;
		object-fit: contain;
		margin: 0 auto 30px;
	}

	.digital-label {
		font-size: 12px;
		font-weight: 800;
		letter-spacing: 2px;
		color: #777;
	}

	.book-section h1 {
		font-size: 32px;
		margin: 8px 0;
	}

	.author {
		color: #666;
	}

	.price {
		font-size: 28px;
		font-weight: 800;
		margin: 22px 0;
	}

	.description {
		color: #666;
		line-height: 1.6;
	}

	.payment-section {
		padding: 45px;
	}

	.payment-section h2 {
		font-size: 28px;
		margin: 0 0 8px;
	}

	.secure {
		color: #666;
		margin-bottom: 28px;
	}

	label {
		display: block;
		font-weight: 700;
		margin: 18px 0 7px;
	}

	label span {
		font-weight: normal;
		color: #777;
	}

	input {
		width: 100%;
		box-sizing: border-box;
		padding: 13px 14px;
		border: 1px solid #d5d5d5;
		border-radius: 8px;
		font-size: 15px;
	}

	input:focus {
		outline: none;
		border-color: #111;
	}

	.error {
		margin-top: 18px;
		background: #fff1f1;
		padding: 12px;
		border-radius: 7px;
		color: #a40000;
	}

	.pay-button {
		width: 100%;
		margin-top: 25px;
		padding: 15px;
		border: none;
		border-radius: 8px;
		background: #111;
		color: white;
		font-size: 16px;
		font-weight: 800;
		cursor: pointer;
	}

	.pay-button:hover:not(:disabled) {
		opacity: 0.86;
	}

	.pay-button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.notice {
		text-align: center;
		color: #777;
		font-size: 12px;
		margin-top: 15px;
	}

	.not-found {
		text-align: center;
		padding: 100px 20px;
	}

	@media (max-width: 750px) {
		.purchase-card {
			grid-template-columns: 1fr;
		}

		.book-section,
		.payment-section {
			padding: 30px 22px;
		}
	}
</style>