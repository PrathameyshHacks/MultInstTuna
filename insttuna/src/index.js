import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(reg => console.log('Service Worker registered:', reg))
      .catch(err => console.log('SW registration failed:', err));
  });
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
);

// ✅ Register the service worker for PWA
//serviceWorkerRegistration.register();

// Optional: performance monitoring
reportWebVitals();
