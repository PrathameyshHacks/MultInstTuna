export function register() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker
                .register('/service-worker.js')
                .then(registration => {
                    console.log('✅ ServiceWorker registered:', registration);

                    // Optional: Listen for updates
                    registration.onupdatefound = () => {
                        const installingWorker = registration.installing;
                        if (installingWorker) {
                            installingWorker.onstatechange = () => {
                                if (installingWorker.state === 'installed') {
                                    if (navigator.serviceWorker.controller) {
                                        console.log('🔄 New content is available; please refresh.');
                                    } else {
                                        console.log('📦 Content is cached for offline use.');
                                    }
                                }
                            };
                        }
                    };
                })
                .catch(error => {
                    console.error('❌ ServiceWorker registration failed:', error);
                });
        });
    }
}
