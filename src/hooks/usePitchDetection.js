import { useState, useEffect, useRef } from 'react';
import { detectPitch, PitchSmoother } from '../utils/pitchDetection';
import { getNoteFromPitch, getCentsDifference, getTuningStatus } from '../utils/noteUtils';

export function usePitchDetection({
	analyser,
	dataArray,
	isListening,
	a4Freq = 440,
	noiseThreshold = 0.012,
	tolerance = 3.5,
	selectedTarget = null,
	targetFreq = null,
	useFlats = false,
}) {
	const [detectedNote, setDetectedNote] = useState(null);
	const [detectedPitch, setDetectedPitch] = useState(null);
	const [cents, setCents] = useState(0);
	const [clarity, setClarity] = useState(0);
	const [tuningStatus, setTuningStatus] = useState('idle');

	const smootherRef = useRef(new PitchSmoother(5));
	const lastNoteTimeRef = useRef(0);
	const lastUpdateTimestampRef = useRef(0);

	// Reset state when microphone is turned off
	useEffect(() => {
		if (!isListening) {
			setDetectedNote(null);
			setDetectedPitch(null);
			setCents(0);
			setClarity(0);
			setTuningStatus('idle');
			smootherRef.current.reset();
		} else {
			setTuningStatus('listening');
		}
	}, [isListening]);

	useEffect(() => {
		if (!analyser || !dataArray || !isListening) return;

		let animationFrameId;

		const processFrame = () => {
			animationFrameId = requestAnimationFrame(processFrame);

			const now = performance.now();
			// Throttle UI state updates to ~35 fps (~28ms) to prevent unnecessary React re-render thrashing
			const shouldUpdateUI = now - lastUpdateTimestampRef.current >= 28;

			analyser.getFloatTimeDomainData(dataArray);
			const sampleRate = analyser.context ? analyser.context.sampleRate : 44100;

			// Detect pitch with noise threshold
			const result = detectPitch(
				dataArray,
				sampleRate,
				40, // Lower bound: 40 Hz
				1850, // Upper bound: 1850 Hz
				noiseThreshold,
				0.78 // Harmonic clarity threshold
			);

			if (result && result.pitch) {
				const smoothedPitch = smootherRef.current.add(result.pitch);
				const nearest = getNoteFromPitch(smoothedPitch, a4Freq, useFlats);

				if (nearest) {
					lastNoteTimeRef.current = now;

					let calculatedCents = nearest.cents;
					let currentNoteObject = nearest;

					// If user locked onto a specific target note (e.g. Guitar E2 or Tabla C#4)
					if (targetFreq && selectedTarget) {
						calculatedCents = getCentsDifference(smoothedPitch, targetFreq);
					}

					const status = getTuningStatus(calculatedCents, tolerance);

					if (shouldUpdateUI) {
						lastUpdateTimestampRef.current = now;
						setDetectedPitch(smoothedPitch);
						setDetectedNote(currentNoteObject);
						setCents(calculatedCents);
						setClarity(Math.round(result.clarity * 100));
						setTuningStatus(status);
					}
				}
			} else {
				// Smooth hold: keep showing note for 420ms after sound decay to avoid abrupt blinking
				if (now - lastNoteTimeRef.current > 420) {
					smootherRef.current.reset();
					if (shouldUpdateUI) {
						lastUpdateTimestampRef.current = now;
						setDetectedNote(null);
						setDetectedPitch(null);
						setCents(0);
						setClarity(0);
						setTuningStatus(isListening ? 'listening' : 'idle');
					}
				}
			}
		};

		processFrame();

		return () => {
			if (animationFrameId) {
				cancelAnimationFrame(animationFrameId);
			}
		};
	}, [
		analyser,
		dataArray,
		isListening,
		a4Freq,
		noiseThreshold,
		tolerance,
		selectedTarget,
		targetFreq,
		useFlats,
	]);

	return {
		detectedNote,
		detectedPitch,
		cents,
		clarity,
		tuningStatus,
	};
}

export default usePitchDetection;
