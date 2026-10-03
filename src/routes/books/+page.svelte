<script>
	/**
	 * @typedef {Object} Book
	 * @property {number} id
	 * @property {string} title
	 * @property {string} author
	 * @property {string} category
	 * @property {number} price
	 * @property {string} image
	 */

	let search = $state('');
	let selectedCategory = $state('All');

	/** @type {Book[]} */
	const books = [
	{
		id: 1,
		title: 'ኮድ ማድረግ',
		author: '4KAZ Books',
		category: 'Technology',
		price: 200,
		image: '/images/coding-book.png'
	},
	{
		id: 2,
		title: 'ጠፈርን ስንመረምር',
		author: '4KAZ Books',
		category: 'Kids',
		price: 300,
		image: '/images/Eploring-space-book.png'
	},
	{
		id: 3,
		title: 'ይህ ሰው ማን ነው?',
		author: '4KAZ Books',
		category: 'Spiritual',
		price: 500,
		image: '/images/who-is-this-man.png'
	}
];

	const categories = ['All', 'Fiction', 'Business', 'Technology'];

	let filteredBooks = $derived(
		books.filter((book) => {
			const query = search.toLowerCase().trim();

			const matchesCategory =
				selectedCategory === 'All' ||
				book.category === selectedCategory;

			const matchesSearch =
				book.title.toLowerCase().includes(query) ||
				book.author.toLowerCase().includes(query);

			return matchesCategory && matchesSearch;
		})
	);

	/**
	 * @param {Book} book
	 */
	function downloadBook(book) {
		window.location.href = `/buy/${book.id}`;
	}
</script>

<svelte:head>
	<title>Digital Books | 4KAZ Books</title>
	<meta
		name="description"
		content="Buy and download digital books from 4KAZ Books."
	/>
</svelte:head>

<main class="books-page">

	<section class="hero">
		<p class="eyebrow">4KAZ BOOKS</p>

		<h1>Digital Books</h1>

		<p>
			Choose your book, pay securely with Chapa,
			and download your digital copy.
		</p>
	</section>

	<section class="controls">

		<input
			type="search"
			placeholder="Search books or authors..."
			bind:value={search}
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

	<section class="book-grid">

		{#each filteredBooks as book}

			<article class="book-card">

				<div class="cover">
					<img
						src={book.image}
						alt={book.title}
					/>
				</div>

				<div class="book-info">

					<span class="category">
						{book.category}
					</span>

					<h2>{book.title}</h2>

					<p class="author">
						by {book.author}
					</p>

					<div class="price">
						{book.price} ETB
					</div>

					<button
						class="download"
						onclick={() => downloadBook(book)}
					>
						Download Now
					</button>

					<p class="digital">
						Digital PDF • Available immediately after payment
					</p>

				</div>

			</article>

		{/each}

	</section>

	{#if filteredBooks.length === 0}
		<div class="empty">
			<h2>No books found</h2>
			<p>Try another search.</p>
		</div>
	{/if}

</main>

<style>

	.books-page {
		max-width: 1200px;
		margin: auto;
		padding: 40px 24px 80px;
	}

	.hero {
		text-align: center;
		margin-bottom: 40px;
	}

	.eyebrow {
		font-size: 12px;
		font-weight: 800;
		letter-spacing: 3px;
		color: #777;
	}

	.hero h1 {
		font-size: 48px;
		margin: 8px 0 12px;
	}

	.hero p {
		color: #666;
	}

	.controls {
		margin-bottom: 40px;
	}

	.controls input {
		display: block;
		width: 100%;
		max-width: 600px;
		margin: 0 auto 20px;
		padding: 14px 18px;
		border: 1px solid #ddd;
		border-radius: 10px;
		font-size: 16px;
	}

	.categories {
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		gap: 10px;
	}

	.categories button {
		background: white;
		border: 1px solid #ddd;
		border-radius: 30px;
		padding: 9px 18px;
		cursor: pointer;
	}

	.categories button.active {
		background: #111;
		color: white;
		border-color: #111;
	}

	.book-grid {
		display: grid;
		grid-template-columns:
			repeat(auto-fit, minmax(250px, 1fr));
		gap: 30px;
	}

	.book-card {
		background: white;
		border: 1px solid #e5e5e5;
		border-radius: 16px;
		overflow: hidden;
		transition: 0.2s;
	}

	.book-card:hover {
		transform: translateY(-5px);
		box-shadow: 0 12px 30px rgba(0,0,0,0.08);
	}

	.cover {
		height: 330px;
		background: #f5f5f5;
		padding: 20px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.cover img {
		width: 100%;
		height: 100%;
		object-fit: contain;
	}

	.book-info {
		padding: 22px;
	}

	.category {
		font-size: 12px;
		font-weight: bold;
		color: #777;
		text-transform: uppercase;
	}

	.book-info h2 {
		margin: 8px 0;
		font-size: 22px;
	}

	.author {
		color: #666;
		margin-bottom: 18px;
	}

	.price {
		font-size: 22px;
		font-weight: 800;
		margin-bottom: 15px;
	}

	.download {
		width: 100%;
		border: none;
		background: #111;
		color: white;
		padding: 14px;
		border-radius: 8px;
		font-size: 15px;
		font-weight: bold;
		cursor: pointer;
	}

	.download:hover {
		opacity: 0.85;
	}

	.digital {
		text-align: center;
		font-size: 12px;
		color: #777;
		margin-top: 12px;
	}

	.empty {
		text-align: center;
		padding: 60px;
	}

	@media (max-width: 600px) {

		.books-page {
			padding: 25px 15px;
		}

		.hero h1 {
			font-size: 36px;
		}

	}

</style>