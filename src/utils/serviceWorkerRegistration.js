/**
 * Service Worker Registration for PWA offline and install capabilities.
 * Enabled for both development on local network (HTTPS) and production deployments.
 */

export function register() {
	if ('serviceWorker' in navigator) {
		window.addEventListener('load', () => {
			const publicUrl = process.env.PUBLIC_URL || '';
			const swUrl = `${publicUrl}/service-worker.js`;

			navigator.serviceWorker
				.register(swUrl)
				.then((registration) => {
					console.log('✅ MultInstTuna Service Worker registered successfully:', registration.scope);
				})
				.catch((error) => {
					console.warn('⚠️ Service Worker registration failed:', error);
				});
		});
	}
}

export function unregister() {
	if ('serviceWorker' in navigator) {
		navigator.serviceWorker.ready
			.then((registration) => {
				registration.unregister();
			})
			.catch((error) => {
				console.error(error.message);
			});
	}
}
