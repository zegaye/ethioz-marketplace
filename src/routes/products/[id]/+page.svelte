<script>
  import { onMount } from 'svelte';
  import { page } from '$app/state';
  import { supabase } from '$lib/supabase.js';

  let product = $state(null);
  let loading = $state(true);
  let errorMessage = $state('');
  let selectedImage = $state('');

  onMount(async () => {
    try {
      const productId = page.params.id;

      console.log('Loading product:', productId);

      const { data, error } = await supabase
        .from('marketplace_listings')
        .select('*')
        .eq('id', productId)
        .eq('status', 'approved')
        .maybeSingle();

      if (error) {
        console.error('Supabase product error:', error);
        errorMessage = error.message;
        loading = false;
        return;
      }

      if (!data) {
        errorMessage = 'Product not found or this listing is not approved.';
        loading = false;
        return;
      }

      product = data;

      if (
        Array.isArray(data.image_urls) &&
        data.image_urls.length > 0
      ) {
        selectedImage = data.image_urls[0];
      }

      loading = false;
    } catch (error) {
      console.error('Product page error:', error);

      errorMessage =
        error instanceof Error
          ? error.message
          : 'Something went wrong while loading this product.';

      loading = false;
    }
  });

  function formatPrice(price) {
    return new Intl.NumberFormat('en-US').format(
      Number(price ?? 0)
    );
  }

  function getSpecifications(specifications) {
    if (
      !specifications ||
      typeof specifications !== 'object' ||
      Array.isArray(specifications)
    ) {
      return [];
    }

    return Object.entries(specifications).filter(
      ([, value]) =>
        value !== null &&
        value !== undefined &&
        String(value).trim() !== ''
    );
  }
</script>

<svelte:head>
  <title>
    {product
      ? `${product.title} | 4KAZ Marketplace`
      : 'Product Details | 4KAZ Marketplace'}
  </title>
</svelte:head>

<main class="page">

  <a class="back" href="/products">
    ← Back to products
  </a>

  {#if loading}

    <div class="message-box">
      <h2>Loading product...</h2>
      <p>Please wait.</p>
    </div>

  {:else if errorMessage}

    <div class="message-box">
      <h1>Product unavailable</h1>

      <p>{errorMessage}</p>

      <a class="browse-button" href="/products">
        Browse products
      </a>
    </div>

  {:else if product}

    <div class="product-layout">

      <section class="gallery">

        <div class="main-image">

          {#if selectedImage}

            <img
              src={selectedImage}
              alt={product.title}
            />

          {:else}

            <div class="no-image">
              No image available
            </div>

          {/if}

        </div>

        {#if product.image_urls?.length > 1}

          <div class="thumbnails">

            {#each product.image_urls as image}

              <button
                type="button"
                class:active={selectedImage === image}
                onclick={() => {
                  selectedImage = image;
                }}
              >
                <img
                  src={image}
                  alt={product.title}
                />
              </button>

            {/each}

          </div>

        {/if}

      </section>


      <section class="details">

        <div class="badges">

          <span class="seller-listing">
            SELLER LISTING
          </span>

          {#if product.condition}
            <span class="condition">
              {product.condition}
            </span>
          {/if}

        </div>


        <p class="category">
          {product.category ?? 'Other'}
        </p>


        <h1>{product.title}</h1>


        <div class="price">
          {formatPrice(product.price)}
          <span>ETB</span>
        </div>


        {#if product.negotiable}
          <div class="negotiable">
            ✓ Negotiable
          </div>
        {/if}


        <div class="information">

          <div>
            <span>Condition</span>
            <strong>
              {product.condition ?? 'Not specified'}
            </strong>
          </div>

          <div>
            <span>Location</span>
            <strong>
              {product.location ?? 'Ethiopia'}
            </strong>
          </div>

          <div>
            <span>Category</span>
            <strong>
              {product.category ?? 'Other'}
            </strong>
          </div>

        </div>


        {#if product.description}

          <div class="section">

            <h2>Description</h2>

            <p class="description">
              {product.description}
            </p>

          </div>

        {/if}


        {#if getSpecifications(product.specifications).length > 0}

          <div class="section">

            <h2>Specifications</h2>

            <div class="specifications">

              {#each getSpecifications(product.specifications) as [key, value]}

                <div class="specification">

                  <span>{key}</span>

                  <strong>
                    {String(value)}
                  </strong>

                </div>

              {/each}

            </div>

          </div>

        {/if}


        <div class="seller-box">

          <h2>Interested in this item?</h2>

          <p>
            Contact the seller directly for more information.
          </p>

          {#if product.seller_phone}

            <a
              class="contact-button"
              href={`tel:${product.seller_phone}`}
            >
              📞 Contact Seller
            </a>

            <p class="seller-phone">
              {product.seller_phone}
            </p>

          {:else}

            <p>
              Seller contact information is unavailable.
            </p>

          {/if}

        </div>

      </section>

    </div>

  {/if}

</main>

<style>
  :global(body) {
    margin: 0;
    background: #f5f5f5;
    color: #161616;
    font-family:
      Arial,
      Helvetica,
      sans-serif;
  }

  .page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 32px 20px 70px;
  }

  .back {
    display: inline-block;
    margin-bottom: 24px;
    color: #333;
    font-weight: 700;
    text-decoration: none;
  }

  .back:hover {
    text-decoration: underline;
  }

  .product-layout {
    display: grid;
    grid-template-columns:
      minmax(0, 1.1fr)
      minmax(340px, 0.9fr);
    gap: 36px;
    align-items: start;
  }

  .gallery {
    min-width: 0;
  }

  .main-image {
    height: 520px;
    background: white;
    border: 1px solid #ddd;
    border-radius: 16px;
    overflow: hidden;

    display: flex;
    align-items: center;
    justify-content: center;
  }

  .main-image img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .no-image {
    color: #777;
    font-size: 18px;
  }

  .thumbnails {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    margin-top: 12px;
  }

  .thumbnails button {
    width: 80px;
    height: 80px;
    padding: 3px;
    background: white;
    border: 2px solid transparent;
    border-radius: 10px;
    cursor: pointer;
  }

  .thumbnails button.active {
    border-color: #111;
  }

  .thumbnails img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 6px;
  }

  .details {
    background: white;
    padding: 30px;
    border: 1px solid #ddd;
    border-radius: 16px;
  }

  .badges {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-bottom: 18px;
  }

  .seller-listing,
  .condition {
    padding: 7px 11px;
    border-radius: 999px;
    font-size: 11px;
    font-weight: 800;
  }

  .seller-listing {
    background: #111;
    color: white;
  }

  .condition {
    background: #eee;
    color: #222;
  }

  .category {
    margin: 0 0 8px;
    color: #777;
    font-size: 13px;
    font-weight: 800;
    text-transform: uppercase;
  }

  h1 {
    margin: 0;
    font-size: 38px;
    line-height: 1.15;
  }

  .price {
    margin-top: 22px;
    font-size: 34px;
    font-weight: 900;
  }

  .price span {
    font-size: 17px;
    color: #666;
  }

  .negotiable {
    display: inline-block;
    margin-top: 10px;
    padding: 6px 10px;
    background: #eee;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 700;
  }

  .information {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    margin-top: 28px;
  }

  .information div {
    background: #f5f5f5;
    padding: 14px;
    border-radius: 9px;
  }

  .information span {
    display: block;
    margin-bottom: 6px;
    color: #777;
    font-size: 12px;
  }

  .information strong {
    font-size: 14px;
  }

  .section {
    margin-top: 26px;
    padding-top: 22px;
    border-top: 1px solid #e5e5e5;
  }

  .section h2,
  .seller-box h2 {
    margin: 0 0 12px;
    font-size: 20px;
  }

  .description {
    margin: 0;
    line-height: 1.7;
    color: #555;
    white-space: pre-line;
  }

  .specifications {
    border: 1px solid #ddd;
    border-radius: 9px;
    overflow: hidden;
  }

  .specification {
    display: flex;
    justify-content: space-between;
    gap: 20px;
    padding: 13px 14px;
    border-bottom: 1px solid #ddd;
  }

  .specification:last-child {
    border-bottom: none;
  }

  .specification span {
    color: #777;
    text-transform: capitalize;
  }

  .seller-box {
    margin-top: 28px;
    padding: 22px;
    background: #f4f4f4;
    border-radius: 12px;
  }

  .seller-box p {
    color: #666;
  }

  .contact-button,
  .browse-button {
    display: inline-block;
    padding: 14px 22px;
    background: #111;
    color: white;
    text-decoration: none;
    border-radius: 8px;
    font-weight: 800;
  }

  .seller-phone {
    margin-bottom: 0;
    font-weight: 700;
  }

  .message-box {
    background: white;
    padding: 60px 30px;
    border-radius: 16px;
    text-align: center;
  }

  .message-box h1,
  .message-box h2 {
    margin-top: 0;
  }

  @media (max-width: 850px) {
    .product-layout {
      grid-template-columns: 1fr;
    }

    .main-image {
      height: 380px;
    }
  }

  @media (max-width: 550px) {
    .page {
      padding: 20px 14px 50px;
    }

    .details {
      padding: 20px;
    }

    .information {
      grid-template-columns: 1fr;
    }

    .main-image {
      height: 300px;
    }

    h1 {
      font-size: 30px;
    }

    .price {
      font-size: 29px;
    }
  }
</style>