import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import crypto from 'node:crypto';

/*
 * IMPORTANT:
 * These prices live on the SERVER.
 * The customer's browser cannot choose the payment amount.
 */
const BOOKS = {
	1: {
		title: 'The Silent Journey',
		price: 450
	},
	2: {
		title: 'Build Your Business',
		price: 600
	},
	3: {
		title: 'Modern Technology',
		price: 750
	}
};

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, url }) {
	try {
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

		const bookId = Number(body.bookId);
		const fullName = String(body.fullName ?? '').trim();
		const email = String(body.email ?? '').trim();
		const phone = String(body.phone ?? '').trim();

		/*
		 * Find the book on OUR SERVER.
		 * We do NOT accept the price from the browser.
		 */
		const book = BOOKS[bookId];

		if (!book) {
			return json(
				{
					success: false,
					message: 'Invalid book.'
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

		if (!phone) {
			return json(
				{
					success: false,
					message: 'Phone number is required.'
				},
				{ status: 400 }
			);
		}

		const nameParts = fullName.split(/\s+/);

		const firstName = nameParts[0];

		const lastName =
			nameParts.slice(1).join(' ') || 'Customer';

		/*
		 * Include the book ID in the transaction reference.
		 *
		 * Example:
		 * 4KAZ-B1-1760000000000-a1b2c3d4
		 */
		const txRef =
			`4KAZ-B${bookId}-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;

		/** @type {Record<string, any>} */
		const payload = {
			/*
			 * Price comes from BOOKS above,
			 * NOT from the customer's browser.
			 */
			amount: book.price.toFixed(2),

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
				description: `Digital book: ${book.title}`
			}
		};

		if (email) {
			payload.email = email;
		}

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
					message:
						data.message ||
						'Unable to initialize Chapa payment.'
				},
				{
					status:
						response.status >= 400
							? response.status
							: 500
				}
			);
		}

		const checkoutUrl = data?.data?.checkout_url;

		if (!checkoutUrl) {
			console.error(
				'Chapa did not return checkout_url:',
				data
			);

			return json(
				{
					success: false,
					message:
						'Chapa did not return a checkout URL.'
				},
				{ status: 502 }
			);
		}

		return json({
			success: true,
			checkoutUrl,
			txRef,

			book: {
				id: bookId,
				title: book.title,
				price: book.price
			}
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