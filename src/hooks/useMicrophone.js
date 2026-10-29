import { useState, useRef, useCallback, useEffect } from 'react';

/**
 * Enhanced Web Audio Microphone Hook.
 * - Manages AudioContext lifecycle with user gesture activation (iOS Safari friendly)
 * - Enumerates and supports switching between audio input devices (USB interfaces, mics)
 * - Includes subsonic high-pass filter (30 Hz) to eliminate AC hum and table thuds
 * - Clean error reporting without modal window alert() blocking
 */
export function useMicrophone() {
	const [analyser, setAnalyser] = useState(null);
	const [dataArray, setDataArray] = useState(null);
	const [error, setError] = useState(null);
	const [devices, setDevices] = useState([]);
	const [selectedDeviceId, setSelectedDeviceId] = useState('');
	const [isInitializing, setIsInitializing] = useState(false);

	const audioContextRef = useRef(null);
	const mediaStreamRef = useRef(null);
	const sourceNodeRef = useRef(null);
	const filterNodeRef = useRef(null);

	// Fetch available audio input devices
	const refreshDevices = useCallback(async () => {
		if (!navigator.mediaDevices || typeof navigator.mediaDevices.enumerateDevices !== 'function') {
			return;
		}
		try {
			const allDevices = await navigator.mediaDevices.enumerateDevices();
			if (Array.isArray(allDevices)) {
				const audioInputs = allDevices.filter((d) => d && d.kind === 'audioinput');
				setDevices(audioInputs);
			}
		} catch (err) {
			console.warn('Could not enumerate audio devices:', err);
		}
	}, []);

	useEffect(() => {
		refreshDevices();
		if (navigator.mediaDevices && navigator.mediaDevices.addEventListener) {
			navigator.mediaDevices.addEventListener('devicechange', refreshDevices);
			return () => {
				navigator.mediaDevices.removeEventListener('devicechange', refreshDevices);
			};
		}
	}, [refreshDevices]);

	const startMic = useCallback(
		async (deviceId = selectedDeviceId) => {
			setError(null);
			setIsInitializing(true);

			// Security check for microphone permissions
			const isLocal = ['localhost', '127.0.0.1', '::1'].includes(window.location.hostname);
			if (window.isSecureContext === false && !isLocal) {
				const msg = `Microphone access on mobile devices requires HTTPS. Please access this app via https://${window.location.host} and accept the certificate prompt.`;
				setError(msg);
				setIsInitializing(false);
				return false;
			}

			if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
				const msg = 'Audio input capture is not supported in this browser.';
				setError(msg);
				setIsInitializing(false);
				return false;
			}

			try {
				const AudioContextClass = window.AudioContext || window.webkitAudioContext;
				if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
					audioContextRef.current = new AudioContextClass();
				}

				if (audioContextRef.current.state === 'suspended') {
					await audioContextRef.current.resume();
				}

				// Build constraints: disable noise cancellation/auto gain to preserve instrument harmonics
				const audioConstraints = {
					echoCancellation: false,
					noiseSuppression: false,
					autoGainControl: false,
				};

				if (deviceId) {
					audioConstraints.deviceId = { exact: deviceId };
				}

				let stream;
				try {
					stream = await navigator.mediaDevices.getUserMedia({ audio: audioConstraints });
				} catch (constraintErr) {
					console.warn('Custom audio constraints failed; retrying with basic audio', constraintErr);
					stream = await navigator.mediaDevices.getUserMedia({ audio: true });
				}

				// Check context again after user permission prompt
				if (audioContextRef.current.state === 'suspended') {
					await audioContextRef.current.resume();
				}

				// Clean up previous nodes
				if (sourceNodeRef.current) {
					try {
						sourceNodeRef.current.disconnect();
					} catch (e) {}
				}
				if (filterNodeRef.current) {
					try {
						filterNodeRef.current.disconnect();
					} catch (e) {}
				}

				const source = audioContextRef.current.createMediaStreamSource(stream);

				// Subsonic high-pass filter at 35 Hz to remove table vibrations / AC hum
				const highPass = audioContextRef.current.createBiquadFilter();
				highPass.type = 'highpass';
				highPass.frequency.setValueAtTime(35, audioContextRef.current.currentTime);
				highPass.Q.setValueAtTime(0.7, audioContextRef.current.currentTime);

				// Analyser Node: 2048 or 4096 fft size for deep bass frequency resolution
				const analyserNode = audioContextRef.current.createAnalyser();
				analyserNode.fftSize = 2048;
				analyserNode.smoothingTimeConstant = 0.0;

				const bufferLength = analyserNode.fftSize;
				const dataArrayRef = new Float32Array(bufferLength);

				source.connect(highPass);
				highPass.connect(analyserNode);

				mediaStreamRef.current = stream;
				sourceNodeRef.current = source;
				filterNodeRef.current = highPass;

				setAnalyser(analyserNode);
				setDataArray(dataArrayRef);
				setIsInitializing(false);

				// Re-enumerate to get labeled device names once permission is granted
				refreshDevices();
				return true;
			} catch (err) {
				console.error('Microphone activation failed:', err);
				let errorMsg = 'Could not access microphone: ' + (err.message || err.name);
				if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
					errorMsg = 'Microphone permission denied. Please allow microphone access in your browser settings.';
				} else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
					errorMsg = 'No audio input microphone was detected on this device.';
				}
				setError(errorMsg);
				setIsInitializing(false);
				return false;
			}
		},
		[selectedDeviceId, refreshDevices]
	);

	const stopMic = useCallback(() => {
		if (mediaStreamRef.current) {
			mediaStreamRef.current.getTracks().forEach((track) => track.stop());
			mediaStreamRef.current = null;
		}

		if (sourceNodeRef.current) {
			try {
				sourceNodeRef.current.disconnect();
			} catch (e) {}
			sourceNodeRef.current = null;
		}

		if (filterNodeRef.current) {
			try {
				filterNodeRef.current.disconnect();
			} catch (e) {}
			filterNodeRef.current = null;
		}

		if (audioContextRef.current && audioContextRef.current.state === 'running') {
			audioContextRef.current.suspend().catch(() => {});
		}

		setAnalyser(null);
		setDataArray(null);
	}, []);

	const selectDevice = useCallback(
		async (deviceId) => {
			setSelectedDeviceId(deviceId);
			if (mediaStreamRef.current) {
				stopMic();
				await startMic(deviceId);
			}
		},
		[stopMic, startMic]
	);

	return {
		analyser,
		dataArray,
		error,
		devices,
		selectedDeviceId,
		isInitializing,
		startMic,
		stopMic,
		selectDevice,
		audioContext: audioContextRef.current,
	};
}

export default useMicrophone;
