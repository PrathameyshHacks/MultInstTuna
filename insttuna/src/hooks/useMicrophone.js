import { useState, useRef } from 'react';

function useMicrophone() {
	const [analyser, setAnalyser] = useState(null);
	const [dataArray, setDataArray] = useState(null);
	const mediaStream = useRef(null);

	const startMic = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

			// Create audio context and resume it if suspended (important for mobile)
			const audioContext = new (window.AudioContext || window.webkitAudioContext)();
			if (audioContext.state === 'suspended') {
				await audioContext.resume();
			}

			const source = audioContext.createMediaStreamSource(stream);
			const analyserNode = audioContext.createAnalyser();
			analyserNode.fftSize = 2048;

			const bufferLength = analyserNode.fftSize;
			const dataArrayRef = new Float32Array(bufferLength);

			source.connect(analyserNode);

			mediaStream.current = stream;
			setAnalyser(analyserNode);
			setDataArray(dataArrayRef);

			console.log('✅ Microphone started and audio context is active');

			return true;
		} catch (error) {
			console.error('❌ Microphone access denied or error:', error);
			alert("Microphone access failed: " + error.message);
			return false;
		}
	};

	const stopMic = () => {
		if (mediaStream.current) {
			mediaStream.current.getTracks().forEach((track) => track.stop());
			mediaStream.current = null;
		}
		setAnalyser(null);
		setDataArray(null);
		console.log('🔇 Microphone stopped');
	};

	return { analyser, dataArray, startMic, stopMic };
}

export default useMicrophone;
