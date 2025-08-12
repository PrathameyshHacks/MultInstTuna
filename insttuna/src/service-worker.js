/* eslint-disable no-restricted-globals */
const CACHE_NAME = "tuner-app-cache-v1";
const urlsToCache = ["/", "/index.html", "/manifest.json", "/logo192.png", "/logo512.png"];

// Install service worker
self.addEventListener("install", (event) => {
	event.waitUntil(
		caches.open(CACHE_NAME).then((cache) => {
			console.log("Opened cache");
			return cache.addAll(urlsToCache);
		})
	);
});

// Fetch from cache first, then network
self.addEventListener("fetch", (event) => {
	event.respondWith(
		caches.match(event.request).then((response) => {
			return response || fetch(event.request);
		})
	);
});

// Activate and remove old caches
self.addEventListener("activate", (event) => {
	event.waitUntil(
		caches.keys().then((cacheNames) => {
			return Promise.all(
				cacheNames.map((name) => {
					if (name !== CACHE_NAME) {
						console.log("Deleting old cache:", name);
						return caches.delete(name);
					}
				})
			);
		})
	);
});
