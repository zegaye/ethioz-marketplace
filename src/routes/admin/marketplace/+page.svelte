<script>
	import { onMount } from 'svelte';
	import { supabase } from '$lib/supabase.js';

	let listings = $state([]);
	let loading = $state(true);
	let errorMessage = $state('');
	let updatingId = $state(null);

	async function loadListings() {
		loading = true;
		errorMessage = '';

		const { data, error } = await supabase
			.from('marketplace_listings')
			.select('*')
			.eq('status', 'pending')
			.order('created_at', { ascending: false });

		if (error) {
			console.error(error);
			errorMessage = error.message;
			listings = [];
		} else {
			listings = data ?? [];
		}

		loading = false;
	}

	async function updateStatus(id, status) {
		updatingId = id;
		errorMessage = '';

		const { error } = await supabase
			.from('marketplace_listings')
			.update({ status })
			.eq('id', id);

		if (error) {
			console.error(error);
			errorMessage = error.message;
			updatingId = null;
			return;
		}

		listings = listings.filter((listing) => listing.id !== id);
		updatingId = null;
	}

	function formatPrice(price) {
		return Number(price).toLocaleString('en-US');
	}

	function getMainImage(listing) {
		if (
			Array.isArray(listing.image_urls) &&
			listing.image_urls.length > 0
		) {
			return listing.image_urls[0];
		}

		return null;
	}

	function specificationEntries(specifications) {
		if (!specifications || typeof specifications !== 'object') {
			return [];
		}

		return Object.entries(specifications).filter(
			([, value]) =>
				value !== null &&
				value !== undefined &&
				String(value).trim() !== ''
		);
	}

	function formatLabel(key) {
		return key
			.replaceAll('_', ' ')
			.replace(/\b\w/g, (letter) => letter.toUpperCase());
	}

	onMount(loadListings);
</script>

<svelte:head>
	<title>Marketplace Admin | 4KAZ</title>
</svelte:head>

<header>
	<a class="brand" href="/">
		<div class="logo">4K</div>

		<div>
			<strong>4KAZ</strong>
			<span>Marketplace Admin</span>
		</div>
	</a>

	<nav>
		<a href="/">Home</a>
		<a href="/products">Marketplace</a>
		<a href="/sell">Sell Item</a>
	</nav>
</header>

<section class="hero">
	<div class="hero-inner">
		<p class="eyebrow">4KAZ ADMINISTRATION</p>

		<h1>Marketplace<br />Approvals.</h1>

		<p class="hero-text">
			Review seller submissions before they appear publicly.
		</p>
	</div>
</section>

<main>
	<div class="top-row">
		<div>
			<p class="eyebrow dark">PENDING SUBMISSIONS</p>
			<h2>Review listings</h2>
		</div>

		<button class="refresh" onclick={loadListings}>
			↻ Refresh
		</button>
	</div>

	{#if errorMessage}
		<div class="message error">
			<strong>Something went wrong</strong>
			<p>{errorMessage}</p>
		</div>
	{/if}

	{#if loading}
		<div class="state-box">
			<div class="loader"></div>
			<h3>Loading listings...</h3>
		</div>
	{:else if listings.length === 0}
		<div class="state-box">
			<div class="check">✓</div>
			<h3>No pending listings</h3>
			<p>Everything has been reviewed.</p>
		</div>
	{:else}
		<div class="count">
			{listings.length}
			{listings.length === 1 ? 'listing' : 'listings'} waiting for review
		</div>

		<div class="listings">
			{#each listings as listing}
				<article class="listing-card">
					<div class="image-area">
						{#if getMainImage(listing)}
							<img
								src={getMainImage(listing)}
								alt={listing.title}
							/>
						{:else}
							<div class="no-image">
								<span>📦</span>
								<p>No image</p>
							</div>
						{/if}

						<span class="status">Pending</span>
					</div>

					<div class="listing-content">
						<div class="title-row">
							<div>
								<p class="category">{listing.category}</p>
								<h3>{listing.title}</h3>
							</div>

							<div class="price">
								{formatPrice(listing.price)}
								<span>ETB</span>
							</div>
						</div>

						<div class="quick-info">
							<div>
								<span>Condition</span>
								<strong>{listing.condition}</strong>
							</div>

							<div>
								<span>Location</span>
								<strong>{listing.location}</strong>
							</div>

							<div>
								<span>Negotiable</span>
								<strong>
									{listing.negotiable ? 'Yes' : 'No'}
								</strong>
							</div>

							<div>
								<span>Seller phone</span>
								<strong>{listing.seller_phone}</strong>
							</div>
						</div>

						{#if listing.description}
							<div class="section">
								<h4>Description</h4>
								<p>{listing.description}</p>
							</div>
						{/if}

						{#if specificationEntries(listing.specifications).length > 0}
							<div class="section">
								<h4>Specifications</h4>

								<div class="spec-grid">
									{#each specificationEntries(listing.specifications) as [key, value]}
										<div class="spec">
											<span>{formatLabel(key)}</span>
											<strong>{value}</strong>
										</div>
									{/each}
								</div>
							</div>
						{/if}

						{#if Array.isArray(listing.image_urls) && listing.image_urls.length > 1}
							<div class="section">
								<h4>All photos</h4>

								<div class="gallery">
									{#each listing.image_urls as image}
										<img src={image} alt={listing.title} />
									{/each}
								</div>
							</div>
						{/if}

						<div class="actions">
							<button
								class="reject"
								disabled={updatingId === listing.id}
								onclick={() =>
									updateStatus(listing.id, 'rejected')}
							>
								{updatingId === listing.id
									? 'Please wait...'
									: '✕ Reject'}
							</button>

							<button
								class="approve"
								disabled={updatingId === listing.id}
								onclick={() =>
									updateStatus(listing.id, 'approved')}
							>
								{updatingId === listing.id
									? 'Please wait...'
									: '✓ Approve Listing'}
							</button>
						</div>
					</div>
				</article>
			{/each}
		</div>
	{/if}
</main>

<style>
	:global(*) {
		box-sizing: border-box;
	}

	:global(body) {
		margin: 0;
		background: #f5f5f3;
		color: #171717;
		font-family:
			Inter,
			Arial,
			sans-serif;
	}

	header {
		height: 76px;
		padding: 0 6%;
		background: white;
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-bottom: 1px solid #e5e5e5;
	}

	.brand {
		display: flex;
		align-items: center;
		gap: 12px;
		text-decoration: none;
		color: #171717;
	}

	.logo {
		width: 42px;
		height: 42px;
		border-radius: 10px;
		background: #171717;
		color: white;
		display: grid;
		place-items: center;
		font-weight: 900;
	}

	.brand strong {
		display: block;
		font-size: 20px;
	}

	.brand span {
		display: block;
		color: #777;
		font-size: 12px;
		margin-top: 2px;
	}

	nav {
		display: flex;
		gap: 30px;
	}

	nav a {
		color: #171717;
		text-decoration: none;
		font-weight: 700;
		font-size: 14px;
	}

	.hero {
		background: #171717;
		color: white;
		padding: 65px 6%;
	}

	.hero-inner {
		max-width: 1200px;
		margin: auto;
	}

	.eyebrow {
		margin: 0 0 17px;
		font-size: 11px;
		font-weight: 900;
		letter-spacing: 5px;
		color: #bdbdbd;
	}

	.eyebrow.dark {
		color: #555;
	}

	.hero h1 {
		margin: 0;
		font-size: clamp(50px, 7vw, 82px);
		line-height: 0.95;
		letter-spacing: -4px;
	}

	.hero-text {
		margin-top: 25px;
		color: #bcbcbc;
		font-size: 17px;
	}

	main {
		max-width: 1200px;
		margin: auto;
		padding: 60px 25px 100px;
	}

	.top-row {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		gap: 20px;
		margin-bottom: 30px;
	}

	h2 {
		font-size: 42px;
		margin: 0;
		letter-spacing: -2px;
	}

	.refresh {
		border: 1px solid #ccc;
		background: white;
		padding: 12px 18px;
		border-radius: 8px;
		font-weight: 800;
		cursor: pointer;
	}

	.count {
		background: #fff8dd;
		border: 1px solid #eadb9a;
		padding: 13px 16px;
		border-radius: 8px;
		margin-bottom: 22px;
		font-weight: 700;
	}

	.listings {
		display: grid;
		gap: 28px;
	}

	.listing-card {
		background: white;
		border: 1px solid #ddd;
		border-radius: 16px;
		overflow: hidden;
		display: grid;
		grid-template-columns: 360px 1fr;
	}

	.image-area {
		min-height: 360px;
		background: #ececea;
		position: relative;
	}

	.image-area > img {
		width: 100%;
		height: 100%;
		min-height: 360px;
		object-fit: cover;
		display: block;
	}

	.no-image {
		height: 100%;
		min-height: 360px;
		display: grid;
		place-content: center;
		text-align: center;
		color: #777;
	}

	.no-image span {
		font-size: 60px;
	}

	.status {
		position: absolute;
		top: 18px;
		left: 18px;
		background: #fff2ba;
		padding: 8px 13px;
		border-radius: 100px;
		font-size: 12px;
		font-weight: 900;
	}

	.listing-content {
		padding: 32px;
	}

	.title-row {
		display: flex;
		justify-content: space-between;
		gap: 20px;
		border-bottom: 1px solid #eee;
		padding-bottom: 25px;
	}

	.category {
		margin: 0 0 7px;
		color: #777;
		text-transform: uppercase;
		font-size: 11px;
		letter-spacing: 2px;
		font-weight: 900;
	}

	.title-row h3 {
		margin: 0;
		font-size: 31px;
		letter-spacing: -1px;
	}

	.price {
		font-size: 26px;
		font-weight: 900;
		white-space: nowrap;
	}

	.price span {
		display: block;
		text-align: right;
		font-size: 11px;
		color: #777;
		letter-spacing: 2px;
		margin-top: 3px;
	}

	.quick-info {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 10px;
		padding: 25px 0;
		border-bottom: 1px solid #eee;
	}

	.quick-info div,
	.spec {
		background: #f6f6f4;
		padding: 14px;
		border-radius: 8px;
	}

	.quick-info span,
	.spec span {
		display: block;
		font-size: 11px;
		color: #777;
		margin-bottom: 6px;
	}

	.quick-info strong,
	.spec strong {
		font-size: 14px;
	}

	.section {
		padding: 22px 0;
		border-bottom: 1px solid #eee;
	}

	.section h4 {
		margin: 0 0 13px;
		font-size: 15px;
	}

	.section p {
		margin: 0;
		color: #555;
		line-height: 1.7;
	}

	.spec-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 9px;
	}

	.gallery {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		gap: 8px;
	}

	.gallery img {
		width: 100%;
		height: 90px;
		object-fit: cover;
		border-radius: 7px;
	}

	.actions {
		display: flex;
		justify-content: flex-end;
		gap: 12px;
		padding-top: 25px;
	}

	.actions button {
		border: 0;
		border-radius: 8px;
		padding: 14px 22px;
		font-weight: 900;
		cursor: pointer;
		font-size: 14px;
	}

	.actions button:disabled {
		opacity: 0.5;
		cursor: wait;
	}

	.reject {
		background: #f3f3f3;
		color: #9d2020;
	}

	.approve {
		background: #171717;
		color: white;
	}

	.message {
		padding: 18px;
		border-radius: 10px;
		margin-bottom: 25px;
	}

	.message p {
		margin: 5px 0 0;
	}

	.error {
		background: #fff0f0;
		border: 1px solid #e7b1b1;
		color: #8e1919;
	}

	.state-box {
		min-height: 300px;
		background: white;
		border: 1px solid #ddd;
		border-radius: 15px;
		display: grid;
		place-content: center;
		text-align: center;
		padding: 40px;
	}

	.state-box h3 {
		margin-bottom: 5px;
	}

	.state-box p {
		color: #777;
	}

	.check {
		width: 60px;
		height: 60px;
		background: #e9f7e8;
		color: #167020;
		border-radius: 50%;
		display: grid;
		place-items: center;
		font-size: 30px;
		font-weight: 900;
		margin: auto;
	}

	.loader {
		width: 42px;
		height: 42px;
		border: 4px solid #ddd;
		border-top-color: #171717;
		border-radius: 50%;
		margin: auto;
		animation: spin 0.8s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	@media (max-width: 900px) {
		.listing-card {
			grid-template-columns: 1fr;
		}

		.image-area,
		.image-area > img,
		.no-image {
			min-height: 280px;
			max-height: 400px;
		}

		.quick-info {
			grid-template-columns: repeat(2, 1fr);
		}

		.spec-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (max-width: 650px) {
		header {
			padding: 0 20px;
		}

		nav {
			display: none;
		}

		.hero {
			padding: 50px 25px;
		}

		.hero h1 {
			font-size: 52px;
			letter-spacing: -3px;
		}

		main {
			padding: 40px 15px 80px;
		}

		.top-row {
			align-items: flex-start;
			flex-direction: column;
		}

		h2 {
			font-size: 34px;
		}

		.title-row {
			flex-direction: column;
		}

		.price span {
			text-align: left;
		}

		.quick-info,
		.spec-grid {
			grid-template-columns: 1fr 1fr;
		}

		.gallery {
			grid-template-columns: repeat(3, 1fr);
		}

		.actions {
			flex-direction: column-reverse;
		}

		.actions button {
			width: 100%;
		}
	}
</style>