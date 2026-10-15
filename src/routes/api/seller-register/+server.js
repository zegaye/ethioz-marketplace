
import { json } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';
import { env } from '$env/dynamic/public';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
  try {
    const data = await request.json();

    const sellerType = String(data.sellerType ?? '').trim();
    const fullName = String(data.fullName ?? '').trim();
    const companyName = String(data.companyName ?? '').trim();
    const email = String(data.email ?? '').trim().toLowerCase();
    const password = String(data.password ?? '');
    const phone = String(data.phone ?? '').trim();
    const city = String(data.city ?? '').trim();
    const address = String(data.address ?? '').trim();
    const license = String(data.license ?? '').trim();

    if (!['individual', 'company'].includes(sellerType)) {
      return json(
        { error: 'Please select a valid seller type.' },
        { status: 400 }
      );
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      password.length < 8 ||
      !phone ||
      !city ||
      (sellerType === 'individual' && !fullName) ||
      (sellerType === 'company' && (!companyName || !license))
    ) {
      return json(
        { error: 'Please complete all required fields.' },
        { status: 400 }
      );
    }

    if (
      email.length > 254 ||
      password.length > 128 ||
      fullName.length > 150 ||
      companyName.length > 200 ||
      phone.length > 30 ||
      city.length > 100 ||
      address.length > 300 ||
      license.length > 100
    ) {
      return json(
        { error: 'One or more fields exceed the allowed length.' },
        { status: 400 }
      );
    }

    const supabaseUrl = env.PUBLIC_SUPABASE_URL;
    const supabaseKey = env.PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase configuration');
      return json(
        { error: 'Registration service is unavailable.' },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    });

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          seller_type: sellerType,
          full_name: sellerType === 'individual' ? fullName : null,
          company_name: sellerType === 'company' ? companyName : null,
          phone,
          city,
          address: address || null,
          business_license_number:
            sellerType === 'company' ? license : null
        }
      }
    });

    if (error) {
      console.error('Seller signup failed:', error.message);

      return json(
        {
          error:
            'Registration could not be completed. Please check your details or try again later.'
        },
        { status: 400 }
      );
    }

    return json({
      message:
        'Registration request received. If a new account was created, check your email for a confirmation link. After confirming, sign in. Seller verification will remain pending.',
      requiresEmailConfirmation: true
    });
  } catch (error) {
    console.error('Seller registration error:', error);

    return json(
      { error: 'Unable to process registration.' },
      { status: 500 }
    );
  }
}
