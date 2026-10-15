<script>
  let sellerType = $state('individual');
  let fullName = $state('');
  let companyName = $state('');
  let email = $state('');
  let password = $state('');
  let phone = $state('');
  let city = $state('');
  let address = $state('');
  let license = $state('');
  let loading = $state(false);
  let message = $state('');
  let success = $state(false);

  /** @param {SubmitEvent} event */
async function registerSeller(event) {
    event.preventDefault();
    loading = true;
    message = '';
    success = false;

    try {
      const response = await fetch('/api/seller-register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sellerType,
          fullName,
          companyName,
          email,
          password,
          phone,
          city,
          address,
          license
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Registration failed');
      }

      success = true;
      message = result.message || 'Registration successful!';
    } catch (error) {
      message =
        error instanceof Error
          ? error.message
          : 'Something went wrong';
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>Seller Registration | 4KAZ Marketplace</title>
  <meta
    name="description"
    content="Register as an individual or business seller on 4KAZ Marketplace."
  />
</svelte:head>

<div class="page">
  <div class="registration-card">
    <div class="header">
      <span class="logo">4KAZ</span>
      <h1>Become a Seller</h1>
      <p>Join 4KAZ Marketplace and reach more buyers.</p>
    </div>

    <form onsubmit={registerSeller}>
      <label for="sellerType">Seller Type</label>
      <select id="sellerType" bind:value={sellerType}>
        <option value="individual">Individual Seller</option>
        <option value="company">Registered Company</option>
      </select>

      {#if sellerType === 'individual'}
        <label for="fullName">Full Name</label>
        <input
          id="fullName"
          bind:value={fullName}
          placeholder="Your full name"
          maxlength="150"
          required
        />
      {:else}
        <label for="companyName">Registered Company Name</label>
        <input
          id="companyName"
          bind:value={companyName}
          placeholder="Company name"
          maxlength="200"
          required
        />

        <label for="license">Business License Number</label>
        <input
          id="license"
          bind:value={license}
          placeholder="Business license number"
          maxlength="100"
          required
        />
      {/if}

      <label for="email">Email Address</label>
      <input
        id="email"
        type="email"
        bind:value={email}
        placeholder="example@email.com"
        required
      />

      <label for="password">Password</label>
      <input
        id="password"
        type="password"
        bind:value={password}
        minlength="8"
        autocomplete="new-password"
        placeholder="Minimum 8 characters"
        required
      />

      <label for="phone">Phone Number</label>
      <input
        id="phone"
        type="tel"
        bind:value={phone}
        placeholder="+251..."
        maxlength="30"
        required
      />

      <label for="city">City</label>
      <input
        id="city"
        bind:value={city}
        placeholder="Addis Ababa"
        maxlength="100"
        required
      />

      <label for="address">Address</label>
      <input
        id="address"
        bind:value={address}
        placeholder="Sub-city / Woreda"
        maxlength="300"
      />

      <button type="submit" disabled={loading}>
        {loading ? 'Creating account...' : 'Create Seller Account'}
      </button>

      {#if message}
        <p class:success class="message" role="status">
          {message}
        </p>
      {/if}
    </form>

    <p class="footer">
      Already registered?
      <a href="/login">Sign in</a>
    </p>
  </div>
</div>

<style>
  .page {
    min-height: 100vh;
    padding: 45px 16px;
    background: linear-gradient(135deg, #eef4ff, #f8fafc);
    display: flex;
    justify-content: center;
    align-items: flex-start;
    font-family: Arial, sans-serif;
  }

  .registration-card {
    width: 100%;
    max-width: 520px;
    background: white;
    padding: 35px;
    border-radius: 20px;
    box-shadow: 0 15px 45px rgba(0, 0, 0, 0.08);
  }

  .header {
    text-align: center;
    margin-bottom: 25px;
  }

  .logo {
    font-size: 27px;
    font-weight: 900;
    color: #2563eb;
  }

  h1 {
    margin: 12px 0;
    font-size: 28px;
    color: #0f172a;
  }

  p {
    color: #64748b;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  label {
    margin-top: 8px;
    font-size: 14px;
    font-weight: 700;
    color: #334155;
  }

  input,
  select {
    width: 100%;
    padding: 13px;
    border: 1px solid #cbd5e1;
    border-radius: 9px;
    font-size: 15px;
    box-sizing: border-box;
    background: white;
    color: #0f172a;
  }

  input:focus,
  select:focus {
    outline: 2px solid #93c5fd;
    border-color: #2563eb;
  }

  button {
    margin-top: 20px;
    padding: 15px;
    background: #2563eb;
    color: white;
    border: none;
    border-radius: 10px;
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
  }

  button:hover {
    background: #1d4ed8;
  }

  button:disabled {
    opacity: 0.6;
    cursor: wait;
  }

  .message {
    padding: 12px;
    border-radius: 8px;
    background: #fee2e2;
    color: #991b1b;
    overflow-wrap: anywhere;
  }

  .message.success {
    background: #dcfce7;
    color: #166534;
  }

  .footer {
    text-align: center;
    margin-top: 25px;
  }

  a {
    color: #2563eb;
    font-weight: 700;
  }

  @media (max-width: 500px) {
    .registration-card {
      padding: 22px;
    }
  }
</style>