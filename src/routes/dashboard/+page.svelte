
<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { supabase } from '$lib/supabase.js';

  let loading = $state(true);
  /** @type {{
 *   seller_type?: string;
 *   verification_status?: string;
 *   full_name?: string;
 *   company_name?: string;
 *   phone?: string;
 *   city?: string;
 *   address?: string;
 * } | null} */
  let seller = $state(null);
  let email = $state('');
  let errorMessage = $state('');

  onMount(() => {
    loadDashboard();
  });

  async function loadDashboard() {
    loading = true;
    errorMessage = '';

    try {
      const { data: sessionData, error: sessionError } =
  await supabase.auth.getSession();

if (sessionError) throw sessionError;

if (!sessionData.session) {
  await goto('/login');
  return;
}

const { data: authData, error: authError } =
  await supabase.auth.getUser();

      if (authError) throw authError;

      if (!authData.user) {
        await goto('/login');
        return;
      }

      email = authData.user.email ?? '';

      const { data, error } = await supabase
        .from('seller_profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (error) throw error;

      seller = data;
    } catch (error) {
      errorMessage =
        error instanceof Error
          ? error.message
          : 'Unable to load your dashboard.';
    } finally {
      loading = false;
    }
  }

  async function logout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      errorMessage = error.message;
      return;
    }

    await goto('/login');
  }

  function sellProduct() {
    goto('/sell');
  }
</script>

<svelte:head>
  <title>Seller Dashboard | 4KAZ Marketplace</title>
  <meta
    name="description"
    content="Manage your seller account on 4KAZ Marketplace."
  />
</svelte:head>

<main class="dashboard">
  <div class="container">
    <header class="header">
      <a href="/" class="brand">4KAZ Marketplace</a>

      <button class="logout" onclick={logout}>
        Logout
      </button>
    </header>

    {#if loading}
      <div class="panel">
        <p>Loading your dashboard...</p>
      </div>
    {:else if errorMessage}
      <div class="panel error" role="alert">
        <h2>Unable to load dashboard</h2>
        <p>{errorMessage}</p>
        <a href="/login">Go to Login</a>
      </div>
    {:else if seller}
      <section class="welcome">
        <div>
          <p class="eyebrow">SELLER ACCOUNT</p>
          <h1>Welcome to your Dashboard</h1>
          <p>
            Manage your account and submit products
            to 4KAZ Marketplace.
          </p>
        </div>

        <span class="account-badge">
          Registered Seller
        </span>
      </section>

      <div class="grid">
        <section class="panel">
          <h2>Account Information</h2>

          <div class="detail">
            <span>Email</span>
            <strong>{email}</strong>
          </div>

          <div class="detail">
            <span>Seller Type</span>
            <strong>
              {seller.seller_type ?? 'Individual'}
            </strong>
          </div>

          <div class="detail">
            <span>Verification Status</span>

            {#if seller.verification_status === 'verified'}
              <strong class="verified">Verified Seller</strong>
            {:else if seller.verification_status === 'rejected'}
              <strong class="rejected">Verification Rejected</strong>
            {:else}
              <strong class="pending">Verification Pending</strong>
            {/if}
          </div>

          <p class="note">
            You can submit products without waiting for
            identity verification. All listings still
            require administrator approval.
          </p>
        </section>

        <section class="panel action-panel">
          <div class="action-icon">+</div>

          <h2>Sell a Product</h2>

          <p>
            Advertise cars, mobile phones, electronics,
            real estate, furniture, and other products.
          </p>

          <button
            class="primary-button"
            onclick={sellProduct}
          >
            + Add New Product
          </button>

          <p class="note">
            Your listing will be reviewed before
            appearing publicly.
          </p>
        </section>
      </div>

      <section class="panel bottom-panel">
        <h2>Marketplace</h2>
        <p>Explore products listed by other sellers.</p>

        <a href="/products" class="secondary-button">
          Browse Products →
        </a>
      </section>
    {:else}
      <div class="panel">
        <h2>Seller profile not found</h2>
        <p>Please complete seller registration first.</p>
        <a href="/signup">Register as Seller</a>
      </div>
    {/if}
  </div>
</main>

<style>
  :global(body) {
    margin: 0;
    font-family: Arial, sans-serif;
    background: #f4f6fb;
  }

  .dashboard {
    min-height: 100vh;
    padding: 30px 20px 70px;
  }

  .container {
    max-width: 1100px;
    margin: auto;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 35px;
    gap: 15px;
  }

  .brand {
    font-size: 23px;
    font-weight: 900;
    color: #484df2;
    text-decoration: none;
  }

  .logout {
    padding: 11px 20px;
    background: white;
    color: #333;
    border: 1px solid #ddd;
    border-radius: 10px;
    font-weight: 700;
    cursor: pointer;
  }

  .welcome {
    background: linear-gradient(
      120deg,
      #484df2,
      #8257e5
    );
    border-radius: 22px;
    padding: 35px;
    color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
    margin-bottom: 25px;
  }

  .welcome h1 {
    font-size: 32px;
    margin: 8px 0;
  }

  .welcome p {
    line-height: 1.6;
  }

  .eyebrow {
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 2px;
  }

  .account-badge {
    background: #ffffff25;
    border: 1px solid #ffffff50;
    padding: 12px 18px;
    border-radius: 30px;
    font-weight: 700;
    white-space: nowrap;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 25px;
  }

  .panel {
    background: white;
    border-radius: 18px;
    padding: 30px;
    box-shadow: 0 8px 25px #00000008;
  }

  .panel h2 {
    margin-top: 0;
    font-size: 22px;
  }

  .detail {
    display: flex;
    justify-content: space-between;
    gap: 15px;
    padding: 15px 0;
    border-bottom: 1px solid #eee;
  }

  .detail span {
    color: #666;
  }

  .detail strong {
    overflow-wrap: anywhere;
    text-align: right;
  }

  .verified {
    color: #16803c;
  }

  .pending {
    color: #bd7800;
  }

  .rejected {
    color: #c53030;
  }

  .note {
    font-size: 13px;
    color: #777;
    line-height: 1.7;
    margin-top: 20px;
  }

  .action-panel {
    text-align: center;
  }

  .action-icon {
    width: 65px;
    height: 65px;
    background: #eef0ff;
    color: #484df2;
    border-radius: 18px;
    display: grid;
    place-items: center;
    font-size: 40px;
    margin: 0 auto 20px;
  }

  .action-panel p {
    color: #666;
    line-height: 1.7;
  }

  .primary-button {
    background: #484df2;
    color: white;
    border: none;
    border-radius: 12px;
    padding: 16px 25px;
    font-size: 16px;
    font-weight: 800;
    cursor: pointer;
    margin-top: 15px;
  }

  .primary-button:hover {
    background: #3539c9;
  }

  .bottom-panel {
    margin-top: 25px;
  }

  .secondary-button {
    display: inline-block;
    padding: 13px 20px;
    background: #eef0ff;
    color: #484df2;
    border-radius: 10px;
    text-decoration: none;
    font-weight: 800;
  }

  .error {
    color: #b42318;
  }

  @media (max-width: 700px) {
    .grid {
      grid-template-columns: 1fr;
    }

    .welcome {
      flex-direction: column;
      align-items: flex-start;
    }

    .welcome h1 {
      font-size: 25px;
    }

    .panel {
      padding: 22px;
    }

    .detail {
      flex-direction: column;
      gap: 5px;
    }

    .detail strong {
      text-align: left;
    }
  }
</style>
