// changed 

import { useState, useRef, useEffect } from 'react';

function useMicrophone() {
	const [analyser, setAnalyser] = useState(null);
	const [dataArray, setDataArray] = useState(null);
	const [audioContext, setAudioContext] = useState(null);
	const mediaStream = useRef(null);
	const gainNodeRef = useRef(null);

	const startMic = async () => {
		try {
			// Ask for mic access
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

			// Create audio context
			const AudioCtx = window.AudioContext || window.webkitAudioContext;
			const ctx = new AudioCtx();
			if (ctx.state === 'suspended') {
				await ctx.resume();
			}

			// Create nodes
			const source = ctx.createMediaStreamSource(stream);
			const analyserNode = ctx.createAnalyser();
			const gainNode = ctx.createGain();

			// Boost gain slightly for quiet input (especially on mobile)
			gainNode.gain.value = 1.5;

			analyserNode.fftSize = 2048;
			const bufferLength = analyserNode.fftSize;
			const dataArrayRef = new Float32Array(bufferLength);

			// Connect nodes: source → gain → analyser
			source.connect(gainNode);
			gainNode.connect(analyserNode);

			// Store references
			mediaStream.current = stream;
			gainNodeRef.current = gainNode;
			setAudioContext(ctx);
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
			mediaStream.current.getTracks().forEach(track => track.stop());
			mediaStream.current = null;
		}
		if (audioContext) {
			audioContext.close();
			setAudioContext(null);
		}
		setAnalyser(null);
		setDataArray(null);
		console.log('🔇 Microphone stopped');
	};

	// Utility to measure RMS volume
	const getVolume = () => {
		if (!analyser || !dataArray) return 0;
		analyser.getFloatTimeDomainData(dataArray);
		let sumSquares = 0;
		for (let i = 0; i < dataArray.length; i++) {
			sumSquares += dataArray[i] * dataArray[i];
		}
		return Math.sqrt(sumSquares / dataArray.length);
	};

	// Cleanup mic when component unmounts
	useEffect(() => {
		return () => stopMic();
	}, []);

	return { analyser, dataArray, startMic, stopMic, getVolume };
}

export default useMicrophone;
