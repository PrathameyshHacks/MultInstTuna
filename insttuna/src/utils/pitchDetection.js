import React, { useEffect, useState } from 'react';
import { getNoteFromPitch, getCentsDifference } from '../utils/noteUtils';
import useMicrophone from '../hooks/useMicrophone';

function PitchDetector({ onPitchDetected }) {
	const { analyser, dataArray, startMic } = useMicrophone();
	const [pitch, setPitch] = useState(null);

	useEffect(() => {
		startMic();
	}, []);

	useEffect(() => {
		if (!analyser || !dataArray) return;

		const detectPitch = () => {
			analyser.getFloatTimeDomainData(dataArray);
			let maxVal = 0;
			let maxIndex = -1;

			for (let i = 0; i < dataArray.length; i++) {
				if (Math.abs(dataArray[i]) > maxVal) {
					maxVal = Math.abs(dataArray[i]);
					maxIndex = i;
				}
			}

			if (maxVal < 0.01) {
				requestAnimationFrame(detectPitch);
				return;
			}

			let bestOffset = 0;
			let bestCorrelation = 0;
			let rms = 0;

			for (let i = 0; i < dataArray.length; i++) {
				rms += dataArray[i] * dataArray[i];
			}
			rms = Math.sqrt(rms / dataArray.length);
			if (rms < 0.01) {
				requestAnimationFrame(detectPitch);
				return;
			}

			const sampleRate = 44100;
			let foundPitch = null;

			for (let offset = 8; offset < 1000; offset++) {
				let correlation = 0;
				for (let i = 0; i < dataArray.length - offset; i++) {
					correlation += dataArray[i] * dataArray[i + offset];
				}
				if (correlation > bestCorrelation) {
					bestCorrelation = correlation;
					bestOffset = offset;
				}
			}

			if (bestCorrelation > 0.9) {
				foundPitch = sampleRate / bestOffset;
			}

			if (foundPitch) {
				setPitch(foundPitch);
				const { name, frequency } = getNoteFromPitch(foundPitch);
				const cents = getCentsDifference(foundPitch, frequency);
				onPitchDetected({ pitch: foundPitch, name, cents });
			}

			requestAnimationFrame(detectPitch);
		};

		detectPitch();
	}, [analyser, dataArray]);

	return null;
}

export default PitchDetector;
