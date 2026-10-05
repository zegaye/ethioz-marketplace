<script>
	let search = $state('');

	const categories = [
		{
			name: 'Cars',
			icon: '🚗',
			description: 'New & used cars',
			href: '/cars'
		},
		{
			name: 'Mobile Phones',
			icon: '📱',
			description: 'Phones & accessories',
			href: '/mobile'
		},
		{
			name: 'Laptops',
			icon: '💻',
			description: 'Laptops & computers',
			href: '/laptops'
		},
		{
			name: 'TV & Electronics',
			icon: '📺',
			description: 'TVs & electronics',
			href: '/electronics'
		},
		{
			name: 'Home & Furniture',
			icon: '🛋️',
			description: 'Furniture & home items',
			href: '/home-items'
		},
		{
			name: 'Other Items',
			icon: '📦',
			description: 'Explore everything else',
			href: '/products'
		}
	];

	const featuredProducts = [
		{
			id: 1,
			title: 'Toyota Corolla',
			price: '1,850,000 ETB',
			condition: 'Used',
			location: 'Addis Ababa',
			icon: '🚗'
		},
		{
			id: 2,
			title: 'iPhone 14 Pro',
			price: '78,000 ETB',
			condition: 'Used',
			location: 'Addis Ababa',
			icon: '📱'
		},
		{
			id: 3,
			title: 'HP EliteBook Laptop',
			price: '52,000 ETB',
			condition: 'Used',
			location: 'Addis Ababa',
			icon: '💻'
		},
		{
			id: 4,
			title: 'Samsung Smart TV',
			price: '46,500 ETB',
			condition: 'New',
			location: 'Addis Ababa',
			icon: '📺'
		}
	];

	function searchMarketplace() {
		const query = search.trim();

		if (!query) return;

		window.location.href =
			`/products?search=${encodeURIComponent(query)}`;
	}
</script>

<svelte:head>
	<title>4KAZ Marketplace | Buy & Sell in Ethiopia</title>

	<meta
		name="description"
		content="Buy and sell new and used cars, phones, laptops, electronics and more on 4KAZ Marketplace."
	/>
</svelte:head>

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

	<nav>
		<a href="/">Home</a>
		<a href="/products">Browse</a>
		<a href="/cars">Cars</a>
		<a href="/mobile">Phones</a>
		<a href="/electronics">Electronics</a>
	</nav>

	<a class="sell-button" href="/sell">
		+ Sell an Item
	</a>
</header>

<main>
	<section class="hero">
		<div class="hero-content">
			<p class="eyebrow">4KAZ MARKETPLACE</p>

			<h1>
				BUY IT.<br />
				SELL IT. <span>FIND IT.</span>
			</h1>

			<p class="hero-description">
				Discover new and used products from sellers across Ethiopia.
				Cars, phones, laptops, electronics and much more.
			</p>

			<form
				class="search-box"
				onsubmit={(event) => {
					event.preventDefault();
					searchMarketplace();
				}}
			>
				<span class="search-icon">⌕</span>

				<input
					bind:value={search}
					type="search"
					placeholder="Search cars, phones, laptops, TVs..."
				/>

				<button type="submit">
					Search
				</button>
			</form>

			<div class="popular">
				<span>Popular:</span>
				<a href="/cars">Cars</a>
				<a href="/mobile">Phones</a>
				<a href="/laptops">Laptops</a>
				<a href="/electronics">Electronics</a>
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
					<div class="category-icon">
						{category.icon}
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
				<p class="eyebrow">JUST LISTED</p>
				<h2>Featured items</h2>
			</div>

			<a href="/products">Browse marketplace →</a>
		</div>

		<div class="product-grid">
			{#each featuredProducts as product}
				<a
					class="product-card"
					href={`/product/${product.id}`}
				>
					<div class="product-image">
						<span>{product.icon}</span>

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
	input {
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
		width: min(800px, 100%);
		margin: 30px auto 0;
		display: flex;
		align-items: center;
		padding: 9px 9px 9px 20px;
		background: white;
		border: 1px solid #e1e1e1;
		border-radius: 12px;
		box-shadow: 0 15px 45px rgba(0, 0, 0, 0.08);
	}

	.search-icon {
		font-size: 26px;
	}

	.search-box input {
		flex: 1;
		min-width: 0;
		padding: 18px;
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
		min-height: 150px;
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

	.category-icon {
		width: 68px;
		height: 68px;
		display: grid;
		place-items: center;
		flex: 0 0 auto;
		background: white;
		border-radius: 50%;
		font-size: 34px;
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
		transition: transform 0.2s ease;
	}

	.product-card:hover {
		transform: translateY(-4px);
	}

	.product-image {
		height: 230px;
		display: grid;
		place-items: center;
		position: relative;
		background: #eeeeeb;
	}

	.product-image > span {
		font-size: 80px;
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

		.search-box {
			padding-left: 14px;
		}

		.search-box button {
			padding: 15px 18px;
		}

		.product-image {
			height: 210px;
		}
	}
</style>