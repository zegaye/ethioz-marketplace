
<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { supabase } from '$lib/supabase.js';

  let loading = $state(true);
  let errorMessage = $state('');
  /** @type {any[]} */
  let products = $state([]);

  onMount(() => {
    loadProducts();
  });

  async function loadProducts() {
    loading = true;
    errorMessage = '';

    try {
      const { data: authData, error: authError } =
        await supabase.auth.getUser();

      if (authError) throw authError;

      if (!authData.user) {
        await goto('/login');
        return;
      }

      const { data, error } = await supabase
        .from('marketplace_listings')
        .select(
          'id, title, category, price, status, image_urls, created_at'
        )
        .eq('seller_id', authData.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      products = data ?? [];
    } catch (error) {
      errorMessage =
        error instanceof Error
          ? error.message
          : 'Could not load products.';
    } finally {
      loading = false;
    }
  }

  /** @param {number | string | null | undefined} price */
  function formatPrice(price) {
    return Number(price ?? 0).toLocaleString('en-US') + ' ETB';
  }
</script>

<svelte:head>
  <title>My Products | 4KAZ Marketplace</title>
</svelte:head>

<main>
  <div class="container">
    <header>
      <a href="/dashboard" class="back">← Dashboard</a>
      <a href="/sell" class="add">+ Add Product</a>
    </header>

    <div class="heading">
      <h1>My Products</h1>
      <p>Manage and track your submitted listings.</p>
    </div>

    {#if loading}
      <p>Loading your products...</p>
    {:else if errorMessage}
      <p class="error" role="alert">{errorMessage}</p>
    {:else if products.length === 0}
      <section class="empty">
        <h2>No products yet</h2>
        <p>Your submitted products will appear here.</p>
        <a href="/sell" class="add">List Your First Product</a>
      </section>
    {:else}
      <div class="grid">
        {#each products as product (product.id)}
          <article class="card">
            {#if product.image_urls?.[0]}
              <img
                src={product.image_urls[0]}
                alt={product.title}
                loading="lazy"
              />
            {:else}
              <div class="placeholder">No image</div>
            {/if}

            <div class="content">
              <div class="topline">
                <span class="category">{product.category}</span>
                <span
                  class:approved={product.status === 'approved'}
                  class:pending={product.status === 'pending'}
                  class:rejected={product.status === 'rejected'}
                  class="status"
                >
                  {product.status}
                </span>
              </div>

              <h2>{product.title}</h2>
              <p class="price">{formatPrice(product.price)}</p>

              <p class="date">
                Submitted:
                {new Date(product.created_at).toLocaleDateString()}
              </p>

              <p class="message">
                {#if product.status === 'approved'}
                  Your product is visible to buyers.
                {:else if product.status === 'rejected'}
                  This listing was not approved.
                {:else}
                  Waiting for administrator approval.
                {/if}
              </p>
            </div>
          </article>
        {/each}
      </div>
    {/if}
  </div>
</main>

<style>
  :global(body) {
    margin: 0;
    font-family: Arial, sans-serif;
    background: #f5f3ff;
  }

  main {
    min-height: 100vh;
    padding: 30px 20px 70px;
  }

  .container {
    max-width: 1150px;
    margin: auto;
  }

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    margin-bottom: 45px;
  }

  .back {
    color: #5b21b6;
    text-decoration: none;
    font-weight: 800;
  }

  .add {
    display: inline-block;
    background: #6d28d9;
    color: white;
    padding: 13px 20px;
    border-radius: 12px;
    text-decoration: none;
    font-weight: 800;
  }

  .heading {
    margin-bottom: 30px;
  }

  h1 {
    font-size: 38px;
    color: #251344;
    margin-bottom: 8px;
  }

  .heading p {
    color: #6b6480;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(
      auto-fill,
      minmax(270px, 1fr)
    );
    gap: 22px;
  }

  .card {
    background: white;
    border-radius: 18px;
    overflow: hidden;
    border: 1px solid #e9e2ff;
    box-shadow: 0 8px 25px #3b076410;
  }

  .card img,
  .placeholder {
    width: 100%;
    height: 210px;
    object-fit: cover;
  }

  .placeholder {
    display: grid;
    place-items: center;
    background: #ede9fe;
    color: #6d28d9;
  }

  .content {
    padding: 20px;
  }

  .topline {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
  }

  .category {
    color: #6d28d9;
    font-size: 12px;
    font-weight: 800;
  }

  .status {
    padding: 6px 10px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 800;
    text-transform: capitalize;
    background: #f1f1f1;
  }

  .approved {
    background: #dcfce7;
    color: #166534;
  }

  .pending {
    background: #fef3c7;
    color: #92400e;
  }

  .rejected {
    background: #fee2e2;
    color: #991b1b;
  }

  h2 {
    font-size: 20px;
    color: #251344;
    margin: 15px 0;
  }

  .price {
    color: #6d28d9;
    font-weight: 900;
    font-size: 20px;
  }

  .date {
    font-size: 12px;
    color: #777;
  }

  .message {
    color: #555;
    font-size: 13px;
    line-height: 1.5;
  }

  .empty {
    background: white;
    padding: 55px 25px;
    text-align: center;
    border-radius: 18px;
  }

  .error {
    color: #b42318;
  }

  @media (max-width: 600px) {
    h1 {
      font-size: 29px;
    }

    header {
      flex-wrap: wrap;
    }
  }
</style>
