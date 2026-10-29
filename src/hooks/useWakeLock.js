import { useEffect, useRef } from 'react';

/**
 * Screen Wake Lock hook for mobile and tablet devices.
 * Automatically keeps the screen awake during active tuning sessions,
 * and seamlessly re-acquires the lock if the user tabs out and returns.
 */
export function useWakeLock(isActive) {
	const wakeLockRef = useRef(null);

	useEffect(() => {
		let isMounted = true;

		const requestLock = async () => {
			if (!isActive || !('wakeLock' in navigator)) return;

			try {
				if (!wakeLockRef.current) {
					wakeLockRef.current = await navigator.wakeLock.request('screen');
					wakeLockRef.current.addEventListener('release', () => {
						wakeLockRef.current = null;
					});
				}
			} catch (err) {
				// Non-fatal: battery saver or lack of system permission
				console.debug('WakeLock request suppressed:', err);
			}
		};

		const releaseLock = async () => {
			if (wakeLockRef.current) {
				try {
					await wakeLockRef.current.release();
				} catch (e) {}
				wakeLockRef.current = null;
			}
		};

		const handleVisibilityChange = () => {
			if (document.visibilityState === 'visible' && isActive && isMounted) {
				requestLock();
			}
		};

		if (isActive) {
			requestLock();
			document.addEventListener('visibilitychange', handleVisibilityChange);
		} else {
			releaseLock();
		}

		return () => {
			isMounted = false;
			releaseLock();
			document.removeEventListener('visibilitychange', handleVisibilityChange);
		};
	}, [isActive]);
}

export default useWakeLock;

