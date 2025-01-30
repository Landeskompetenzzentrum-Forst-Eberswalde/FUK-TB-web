import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
// https://github.com/vite-pwa/sveltekit
import { SvelteKitPWA } from '@vite-pwa/sveltekit'

export default defineConfig({
	plugins: [
		sveltekit(),
		SvelteKitPWA({
			manifest: {
				"theme_color": "#000000",
				"background_color": "#000000",
				"display": "standalone",
				"scope": "/",
				"start_url": "/",
				"screenshots": [
					{
						"src": "Screenshot_20250119-155051.jpg",
						"sizes": "1080x2340",
						"type": "image/jpg",
						"form_factor": "narrow",
						"label": "Home screen showing main navigation and featured content"
					},
					{
						"src": "Screenshot_20250119-160020.jpg",
						"sizes": "2340x1080",
						"type": "image/jpg",
						"form_factor": "wide",
    					"label": "Home screen showing main navigation and featured content"
					}
				],
				"icons": [
					{
						"src": "favicon.svg",
						"sizes": "512x512",
						"purpose": "any",
						"type": "image/svg+xml"
					}
				]
			}
		})
	]
});
