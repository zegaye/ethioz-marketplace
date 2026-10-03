import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import crypto from 'node:crypto';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, url }) {
	try {
		// Make sure the Chapa secret key exists
		if (!env.CHAPA_SECRET_KEY) {
			console.error('CHAPA_SECRET_KEY is missing.');

			return json(
				{
					success: false,
					message: 'Chapa server configuration is incomplete.'
				},
				{ status: 500 }
			);
		}

		const body = await request.json();

		const amount = Number(body.amount);
		const fullName = String(body.fullName ?? '').trim();
		const email = String(body.email ?? '').trim();
		const phone = String(body.phone ?? '').trim();

		// Basic validation
		if (!Number.isFinite(amount) || amount <= 0) {
			return json(
				{
					success: false,
					message: 'Invalid payment amount.'
				},
				{ status: 400 }
			);
		}

		if (!fullName) {
			return json(
				{
					success: false,
					message: 'Customer name is required.'
				},
				{ status: 400 }
			);
		}

		// Split full name
		const nameParts = fullName.split(/\s+/);
		const firstName = nameParts[0];
		const lastName = nameParts.slice(1).join(' ') || 'Customer';

		// Create a unique transaction reference
		const txRef =
			`4KAZ-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;

		/** @type {Record<string, any>} */
            const payload = {
			amount: amount.toFixed(2),
			currency: 'ETB',

			first_name: firstName,
			last_name: lastName,

			tx_ref: txRef,

			callback_url:
				`${url.origin}/api/chapa/callback?tx_ref=${encodeURIComponent(txRef)}`,

			return_url:
				`${url.origin}/payment-success?tx_ref=${encodeURIComponent(txRef)}`,

			customization: {
				title: '4KAZ Books',
				description: 'Book purchase from 4KAZ Books'
			}
		};

		// Email is optional
		if (email) {
			payload.email = email;
		}

		// Chapa requires a supplied phone number to be in a valid format.
		if (phone) {
			payload.phone_number = phone;
		}

		const response = await fetch(
			'https://api.chapa.co/v1/transaction/initialize',
			{
				method: 'POST',

				headers: {
					Authorization: `Bearer ${env.CHAPA_SECRET_KEY}`,
					'Content-Type': 'application/json'
				},

				body: JSON.stringify(payload)
			}
		);

		const data = await response.json();

		if (!response.ok || data.status !== 'success') {
			console.error('Chapa initialize error:', data);

			return json(
				{
					success: false,
					message: data.message || 'Unable to initialize Chapa payment.'
				},
				{ status: response.status || 500 }
			);
		}

		const checkoutUrl = data?.data?.checkout_url;

		if (!checkoutUrl) {
			console.error('Chapa did not return checkout_url:', data);

			return json(
				{
					success: false,
					message: 'Chapa did not return a checkout URL.'
				},
				{ status: 502 }
			);
		}

		return json({
			success: true,
			checkoutUrl,
			txRef
		});
	} catch (error) {
		console.error('Chapa payment error:', error);

		return json(
			{
				success: false,
				message: 'Unable to create Chapa payment.'
			},
			{ status: 500 }
		);
	}
}