
<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { supabase } from '$lib/supabase.js';

  let loading = $state(true);
  let errorMessage = $state('');
/** @type {{
  id: string,
  verification_status: string,
  seller_type: string,
  full_name: string | null,
  company_name: string | null,
  phone: string | null,
  city: string | null,
  address: string | null
} | null} */
let seller = $state(null);
  onMount(() => {
    loadSeller();
  });

  async function loadSeller() {
    loading = true;
    errorMessage = '';

    try {
      const { data: authData, error: authError } =
        await supabase.auth.getUser();

      if (authError || !authData.user) {
        await goto('/login');
        return;
      }

      const { data, error } = await supabase
        .from('seller_profiles')
        .select(
          'id, seller_type, full_name, company_name, phone, city, address, verification_status'
        )
        .eq('id', authData.user.id)
        .single();

      if (error) throw error;

      seller = data;
    } catch (error) {
      errorMessage =
        error instanceof Error
          ? error.message
          : 'Unable to load seller profile.';
    } finally {
      loading = false;
    }
  }

  async function logout() {
    await supabase.auth.signOut();
    await goto('/login');
  }
</script>

<svelte:head>
  <title>Seller Dashboard | 4KAZ Marketplace</title>
</svelte:head>

<main>
  <header>
    <div class="brand">4KAZ Marketplace</div>
    <button class="logout" onclick={logout}>Logout</button>
  </header>

  <div class="container">
    {#if loading}
      <p>Loading seller dashboard...</p>
    {:else if errorMessage}
      <div class="error" role="alert">{errorMessage}</div>
    {:else if seller}
      <h1>Seller Dashboard</h1>
      <p class="subtitle">
        Welcome to your 4KAZ Marketplace account.
      </p>

      <section class="profile">
        <div class="profile-header">
          <h2>
            {seller.seller_type === 'company'
              ? seller.company_name
              : seller.full_name}
          </h2>

          <span class:verified={seller.verification_status === 'verified'}
                class:pending={seller.verification_status === 'pending'}
                class:rejected={seller.verification_status === 'rejected'}>
            {seller.verification_status}
          </span>
        </div>

        <p><strong>Seller type:</strong> {seller.seller_type}</p>
        <p><strong>Phone:</strong> {seller.phone || 'Not provided'}</p>
        <p><strong>City:</strong> {seller.city || 'Not provided'}</p>
        <p><strong>Address:</strong> {seller.address || 'Not provided'}</p>
      </section>

      {#if seller.verification_status === 'verified'}
        <div class="success">
          ✓ Your seller account has been verified.
          You can now proceed with product registration.
        </div>

        <div class="actions">
          <a class="primary" href="/sell">
            + Register a Product
          </a>
          <a class="secondary" href="/">
            Browse Marketplace
          </a>
        </div>
      {:else if seller.verification_status === 'pending'}
        <div class="notice">
          Your account is awaiting administrator verification.
        </div>
      {:else if seller.verification_status === 'rejected'}
        <div class="error">
          Your seller application was rejected.
          Please contact marketplace support.
        </div>
      {/if}
    {:else}
      <p>No seller profile found.</p>
    {/if}
  </div>
</main>

<style>
  :global(body) {
    margin: 0;
    font-family: Arial, sans-serif;
    background: #f3f5fb;
    color: #14213d;
  }

  header {
    background: white;
    padding: 20px 6%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #e5e8f0;
  }

  .brand {
    font-size: 23px;
    font-weight: 900;
    color: #484df2;
  }

  .logout {
    background: #fee2e2;
    color: #991b1b;
    border: none;
    border-radius: 8px;
    padding: 12px 20px;
    font-weight: 700;
    cursor: pointer;
  }

  .container {
    max-width: 1000px;
    margin: 50px auto;
    padding: 0 20px;
  }

  h1 {
    font-size: 34px;
    margin-bottom: 10px;
  }

  .subtitle {
    color: #64748b;
    margin-bottom: 30px;
  }

  .profile {
    background: white;
    padding: 30px;
    border-radius: 16px;
    border: 1px solid #e2e8f0;
    margin-bottom: 25px;
  }

  .profile-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
  }

  h2 {
    margin: 0;
  }

  .profile p {
    line-height: 1.8;
  }

  span {
    padding: 8px 15px;
    border-radius: 30px;
    text-transform: capitalize;
    font-size: 13px;
    font-weight: 700;
  }

  .verified {
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

  .success, .notice, .error {
    padding: 20px;
    border-radius: 12px;
    margin-bottom: 25px;
    line-height: 1.6;
  }

  .success {
    background: #dcfce7;
    color: #166534;
  }

  .notice {
    background: #fef3c7;
    color: #92400e;
  }

  .error {
    background: #fee2e2;
    color: #991b1b;
  }

  .actions {
    display: flex;
    gap: 15px;
    flex-wrap: wrap;
  }

  .actions a {
    padding: 15px 24px;
    border-radius: 10px;
    font-weight: 700;
    text-decoration: none;
  }

  .primary {
    background: #484df2;
    color: white;
  }

  .secondary {
    background: white;
    color: #484df2;
    border: 1px solid #dbe1ec;
  }
</style>
