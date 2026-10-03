import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { google } from 'googleapis';
import { readFile } from 'node:fs/promises';

/** @type {import('./$types').RequestHandler} */
export async function GET() {
	try {
		const credentialsText = await readFile(
			'google-service-account.json',
			'utf8'
		);

		const credentials = JSON.parse(credentialsText);

		const auth = new google.auth.GoogleAuth({
			credentials,
			scopes: ['https://www.googleapis.com/auth/drive.readonly']
		});

		const drive = google.drive({
			version: 'v3',
			auth
		});

		const fileId = env.CODING_BOOK_DRIVE_FILE_ID;

		if (!fileId) {
			return json(
				{
					success: false,
					message: 'CODING_BOOK_DRIVE_FILE_ID is missing.'
				},
				{ status: 500 }
			);
		}

		const response = await drive.files.get({
			fileId,
			fields: 'id,name,mimeType,size'
		});

		return json({
			success: true,
			message: 'Google Drive connection works!',
			book: response.data
		});
	} catch (error) {
		console.error('Google Drive test error:', error);

		return json(
			{
				success: false,
				message:
					error instanceof Error
						? error.message
						: 'Unable to access Google Drive.'
			},
			{ status: 500 }
		);
	}
}