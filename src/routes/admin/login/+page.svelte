<script>
  import { goto } from '$app/navigation';
  import { supabase } from '$lib/supabase.js';

  let email = $state('');
  let password = $state('');
  let loading = $state(false);
  let errorMessage = $state('');

  /** @param {SubmitEvent} event */
  async function login(event) {
    event.preventDefault();

    loading = true;
    errorMessage = '';

    try {
      const { data, error: authError } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password
        });

      if (authError) throw authError;

      if (!data.user) {
        throw new Error('Unable to identify your account.');
      }

      // Verify admin permissions on the database.
      const { data: isAdmin, error: adminError } =
        await supabase.rpc('is_marketplace_admin');

      if (adminError) throw adminError;

      if (isAdmin !== true) {
        await supabase.auth.signOut();
        throw new Error(
          'Access denied. This account is not a marketplace administrator.'
        );
      }

      await goto('/admin/marketplace');
    } catch (error) {
      errorMessage =
        error instanceof Error
          ? error.message
          : 'Admin login failed.';
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>Admin Login | 4KAZ Marketplace</title>
</svelte:head>

<main>
  <form onsubmit={login}>
    <div class="logo">4K</div>

    <h1>Admin Login</h1>
    <p>4KAZ Marketplace Administration</p>

    {#if errorMessage}
      <div class="error" role="alert">
        {errorMessage}
      </div>
    {/if}

    <label for="email">Admin Email</label>
    <input
      id="email"
      type="email"
      bind:value={email}
      autocomplete="username"
      required
    />

    <label for="password">Password</label>
    <input
      id="password"
      type="password"
      bind:value={password}
      autocomplete="current-password"
      required
    />

    <button type="submit" disabled={loading}>
      {loading ? 'Signing in...' : 'Login as Admin'}
    </button>

    <p class="back">
      <a href="/">← Back to Marketplace</a>
    </p>
  </form>
</main>

<style>
  :global(body) {
    margin: 0;
    font-family: Arial, sans-serif;
    background: #f1f4fa;
  }

  main {
    min-height: 100vh;
    display: grid;
    place-items: center;
    padding: 24px;
  }

  form {
    width: 100%;
    max-width: 420px;
    background: white;
    border-radius: 18px;
    padding: 36px;
    box-shadow: 0 12px 35px #00000012;
  }

  .logo {
    width: 48px;
    height: 48px;
    background: #111827;
    color: white;
    border-radius: 12px;
    display: grid;
    place-items: center;
    font-weight: 900;
    margin-bottom: 24px;
  }

  h1 {
    text-align: center;
    font-size: 30px;
    margin-bottom: 10px;
  }

  p {
    color: #666;
    text-align: center;
    margin-bottom: 25px;
  }

  label {
    display: block;
    font-weight: 700;
    margin: 18px 0 8px;
  }

  input {
    width: 100%;
    padding: 14px;
    border: 1px solid #ccd3e0;
    border-radius: 8px;
    font-size: 16px;
    box-sizing: border-box;
  }

  button {
    width: 100%;
    padding: 15px;
    margin-top: 25px;
    background: #111827;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 800;
    cursor: pointer;
  }

  button:disabled {
    opacity: 0.6;
    cursor: wait;
  }

  .back {
    margin-top: 25px;
    text-align: center;
  }

  a {
    color: #484df2;
    font-weight: 700;
  }

  .error {
    background: #ffe5e5;
    color: #a02020;
    padding: 12px;
    border-radius: 8px;
    margin-bottom: 15px;
  }
</style>