import adapter from '@sveltejs/adapter-auto';
import { sveltekit } from '@sveltejs/kit/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},

			adapter: adapter()
		}),

		SvelteKitPWA({
			registerType: 'autoUpdate',

			workbox: {
	globIgnores: [
		'**/images/who-is-this-man.png',
		'**/images/coding-book.png'
	]
},
			manifest: {
				name: '4KAZ Marketplace',
				short_name: '4KAZ',
				description: 'Buy and sell products across Ethiopia',
				start_url: '/',
				display: 'standalone',
				background_color: '#ffffff',
				theme_color: '#111111',

				icons: [
	{
		src: '/images/pwa-192x192.png',
		sizes: '192x192',
		type: 'image/png'
	},
	{
		src: '/images/pwa-512x512.png',
		sizes: '512x512',
		type: 'image/png'
	},
	{
		src: '/images/pwa-512x512.png',
		sizes: '512x512',
		type: 'image/png',
		purpose: 'maskable'
	}
]
			}
		})
	]
});