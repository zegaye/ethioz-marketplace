<script>
  import { goto } from '$app/navigation';
  import { supabase } from '$lib/supabase.js';

  let email = $state('');
  let password = $state('');
  let loading = $state(false);
  let errorMessage = $state('');
  let statusMessage = $state('');

  /** @param {SubmitEvent} event */
  async function login(event) {
    event.preventDefault();
    loading = true;
    errorMessage = '';
    statusMessage = '';

    try {
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password
        });

      if (authError) throw authError;

      const user = authData.user;

      if (!user) {
        throw new Error('Unable to find your account.');
      }

      const { data: seller, error: profileError } =
        await supabase
          .from('seller_profiles')
          .select('verification_status')
          .eq('id', user.id)
          .single();

      if (profileError) throw profileError;

      if (seller.verification_status === 'verified') {
        statusMessage = 'Account verified! Redirecting...';
        await goto('/dashboard');
      } else if (seller.verification_status === 'pending') {
        statusMessage =
          'Login successful. Your seller account is awaiting admin verification.';
      } else if (seller.verification_status === 'rejected') {
        statusMessage =
          'Your seller verification was rejected. Please contact support.';
      } else {
        errorMessage = 'Unknown verification status.';
      }
    } catch (error) {
      errorMessage =
        error instanceof Error ? error.message : 'Login failed.';
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>Seller Login | 4KAZ Marketplace</title>
</svelte:head>

<main>
  <form onsubmit={login}>
    <div class="logo">4K</div>

    <h1>Seller Login</h1>
    <p>Sign in to your 4KAZ Marketplace seller account.</p>

    {#if errorMessage}
      <div class="error" role="alert">{errorMessage}</div>
    {/if}

    {#if statusMessage}
      <div class="status" role="status">{statusMessage}</div>
    {/if}

    <label for="email">Email Address</label>
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
      {loading ? 'Signing in...' : 'Login'}
    </button>

    <p class="register">
      Don't have an account?
      <a href="/signup">Register here</a>
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
    background: #484df2;
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
    background: #484df2;
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

  .register {
    margin-top: 25px;
    font-size: 14px;
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
  }

  .status {
    background: #e7f8eb;
    color: #176b35;
    padding: 12px;
    border-radius: 8px;
    text-align: center;
    line-height: 1.5;
  }
</style>