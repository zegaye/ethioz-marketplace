
<script>
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabase.js';


/** @type {any[]} */
let sellers = $state([]);
  let loading = $state(true);
  let errorMessage = $state('');
/** @type {string | null} */
let updatingId = $state(null);
  async function loadSellers() {
    loading = true;
    errorMessage = '';

    const { data, error } = await supabase
      .from('seller_profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      errorMessage = error.message;
      sellers = [];
    } else {
      sellers = data ?? [];
    }

    loading = false;
  }

/**
 * @param {string} id
 * @param {'pending' | 'verified' | 'rejected'} status
 */
async function updateStatus(id, status) 
{    if (!confirm(`Change seller status to ${status}?`)) return;

    updatingId = id;
    errorMessage = '';

    const { data, error } = await supabase
      .from('seller_profiles')
      .update({ verification_status: status })
      .eq('id', id)
      .select('id, verification_status')
      .single();

    if (error) {
      errorMessage = error.message;
    } else {
      sellers = sellers.map((seller) =>
        seller.id === data.id
          ? { ...seller, verification_status: data.verification_status }
          : seller
      );
    }

    updatingId = null;
  }

  onMount(async () => {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      window.location.replace('/admin/login');
      return;
    }

    const { data: isAdmin, error: adminError } =
      await supabase.rpc('is_marketplace_admin');

    if (adminError || isAdmin !== true) {
      window.location.replace('/');
      return;
    }

    await loadSellers();
  });
</script>

<svelte:head>
  <title>Seller Verification | 4KAZ Marketplace</title>
</svelte:head>

<main>
  <header>
    <div>
      <h1>Seller Verification</h1>
      <p>Review and manage registered 4KAZ sellers.</p>
    </div>
    <button onclick={loadSellers} disabled={loading}>Refresh</button>
  </header>

  <nav>
    <a href="/admin/marketplace">Product Approvals</a>
    <a href="/">Marketplace Home</a>
  </nav>

  {#if errorMessage}
    <p class="error" role="alert">{errorMessage}</p>
  {/if}

  {#if loading}
    <p>Loading sellers...</p>
  {:else if sellers.length === 0 && !errorMessage}
    <p>No registered sellers found.</p>
  {:else}
    <div class="summary">
      <strong>Total sellers: {sellers.length}</strong>
      <span>
        Pending: {sellers.filter(s => s.verification_status === 'pending').length}
      </span>
    </div>

    <div class="seller-grid">
      {#each sellers as seller (seller.id)}
        <article class="seller-card">
          <div class="card-top">
            <h2>{seller.company_name || seller.full_name || 'Unnamed seller'}</h2>
            <span class="status">{seller.verification_status}</span>
          </div>

          <p><strong>Type:</strong> {seller.seller_type}</p>
          <p><strong>Phone:</strong> {seller.phone}</p>
          <p><strong>City:</strong> {seller.city}</p>
          <p><strong>Address:</strong> {seller.address || 'Not provided'}</p>

          {#if seller.seller_type === 'company'}
            <p><strong>Business license:</strong>
              {seller.business_license_number || 'Not provided'}
            </p>
          {/if}

          {#if seller.verification_status === 'pending'}
            <div class="actions">
              <button
                class="approve"
                disabled={updatingId === seller.id}
                onclick={() => updateStatus(seller.id, 'verified')}
              >
                Approve
              </button>

              <button
                class="reject"
                disabled={updatingId === seller.id}
                onclick={() => updateStatus(seller.id, 'rejected')}
              >
                Reject
              </button>
            </div>
          {/if}
        </article>
      {/each}
    </div>
  {/if}
</main>

<style>
  :global(body) {
    margin: 0;
    font-family: Arial, sans-serif;
    background: #f5f6fa;
    color: #172033;
  }

  main {
    max-width: 1200px;
    margin: auto;
    padding: 35px 20px;
  }

  header, .card-top, .summary {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 15px;
    flex-wrap: wrap;
  }

  h1 { margin-bottom: 8px; }
  header p { color: #64748b; }

  nav {
    display: flex;
    gap: 20px;
    margin: 25px 0;
  }

  a { color: #4049e8; font-weight: bold; }

  .summary {
    background: white;
    padding: 20px;
    border-radius: 12px;
    margin-bottom: 20px;
  }

  .seller-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 320px), 1fr));
    gap: 20px;
  }

  .seller-card {
    background: white;
    padding: 24px;
    border-radius: 14px;
    border: 1px solid #e2e8f0;
    box-shadow: 0 4px 14px #00000008;
  }

  h2 { font-size: 20px; }
  .seller-card p { overflow-wrap: anywhere; }

  .status {
    background: #fff0c2;
    padding: 7px 12px;
    border-radius: 20px;
    font-size: 12px;
    text-transform: capitalize;
  }

  .actions { display: flex; gap: 10px; margin-top: 22px; }

  button {
    padding: 11px 17px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: bold;
  }

  button:disabled { opacity: 0.5; cursor: wait; }
  .approve { background: #16803c; color: white; }
  .reject { background: #fee2e2; color: #991b1b; }
  .error { color: #b91c1c; }
</style>
