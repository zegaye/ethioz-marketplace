
<script>
  import { goto } from '$app/navigation';
  import { supabase } from '$lib/supabase.js';

  let email = $state('');
  let password = $state('');
  let loading = $state(false);
  let errorMessage = $state('');

  async function login(event) {
    event.preventDefault();
    loading = true;
    errorMessage = '';

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password
      });

      if (error) throw error;

      const { data, error: adminError } = await supabase.rpc(
        'is_marketplace_admin'
      );

      if (adminError || data !== true) {
        await supabase.auth.signOut();
        errorMessage = 'This account does not have administrator access.';
        return;
      }

      await goto('/admin/marketplace');
    } catch (error) {
      errorMessage =
        error instanceof Error ? error.message : 'Login failed.';
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
    <p>Sign in to manage 4KAZ Marketplace listings.</p>

    {#if errorMessage}
      <div class="error" role="alert">{errorMessage}</div>
    {/if}

    <label for="email">Email address</label>
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
      {loading ? 'Signing in...' : 'Sign In'}
    </button>

    <a href="/">← Back to Marketplace</a>
  </form>
</main>

<style>
  :global(body) {
    margin: 0;
    font-family: Arial, sans-serif;
    background: #f5f5f3;
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
    border: 1px solid #e5e5e5;
    border-radius: 18px;
    padding: 36px;
    box-shadow: 0 12px 35px #0000000d;
  }

  .logo {
    width: 48px;
    height: 48px;
    background: #171717;
    color: white;
    border-radius: 12px;
    display: grid;
    place-items: center;
    font-weight: 900;
    margin-bottom: 24px;
  }

  h1 {
    margin: 0 0 10px;
    font-size: 32px;
  }

  p {
    color: #666;
    margin-bottom: 30px;
    line-height: 1.5;
  }

  label {
    display: block;
    font-weight: 700;
    margin: 18px 0 8px;
  }

  input {
    width: 100%;
    padding: 14px;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 16px;
    box-sizing: border-box;
  }

  button {
    width: 100%;
    padding: 15px;
    margin-top: 25px;
    background: #171717;
    color: white;
    border: 0;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 800;
    cursor: pointer;
  }

  button:disabled {
    opacity: 0.6;
    cursor: wait;
  }

  a {
    display: block;
    text-align: center;
    margin-top: 24px;
    color: #555;
    text-decoration: none;
  }

  .error {
    background: #fff0f0;
    color: #a02020;
    padding: 12px;
    border-radius: 8px;
    font-size: 14px;
  }
</style>
