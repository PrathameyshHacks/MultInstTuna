import React, { useState, useEffect } from 'react';
import './App.css';
import useMicrophone from './hooks/useMicrophone';
import { detectPitch } from './utils/pitchDetection';
import { getNoteFromPitch, getCentsDifference } from './utils/noteUtils';

const stringInstruments = {
	Guitar: ['E2', 'A2', 'D3', 'G3', 'B3', 'E4'],
	Violin: ['G3', 'D4', 'A4', 'E5'],
	Ukulele: ['G4', 'C4', 'E4', 'A4'],
};

const noteFrequencyMap = {
	E2: 82.41, A2: 110.00, D3: 146.83, G3: 196.00, B3: 246.94, E4: 329.63,
	D4: 293.66, A4: 440.00, E5: 659.25,
	G4: 392.00, C4: 261.63,
};

function App() {
	const [instrument, setInstrument] = useState('Guitar');
	const [selectedString, setSelectedString] = useState(null);
	const [note, setNote] = useState(null);
	const [cents, setCents] = useState('0.0');
	const [isListening, setIsListening] = useState(false);
	const [darkMode, setDarkMode] = useState(false);

	const { analyser, dataArray, startMic, stopMic } = useMicrophone();

	useEffect(() => {
		document.body.className = darkMode ? 'dark-mode' : '';
	}, [darkMode]);

	const toggleDarkMode = () => setDarkMode(!darkMode);

	const isStringInstrument = (inst) =>
		Object.keys(stringInstruments).includes(inst);

	const getNoteFromPitchName = (noteName) => {
		return {
			name: noteName,
			frequency: noteFrequencyMap[noteName] || 440,
		};
	};

	useEffect(() => {
		if (!analyser || !dataArray || !isListening) return;

		const detect = () => {
			analyser.getFloatTimeDomainData(dataArray);
			const pitch = detectPitch(dataArray, analyser.context.sampleRate);

			if (pitch !== null && pitch > 50 && pitch < 1500) {
				const nearestNote = getNoteFromPitch(pitch);
				let displayNote = nearestNote.name;
				let displayCents = 0;

				if (isStringInstrument(instrument) && selectedString) {
					const target = getNoteFromPitchName(selectedString);
					displayNote = target.name;
					displayCents = getCentsDifference(pitch, target.frequency);
				} else {
					displayCents = getCentsDifference(pitch, nearestNote.frequency);
				}

				setNote(displayNote);
				setCents(displayCents.toFixed(1));
			} else {
				// silence or invalid pitch
				setCents('0.0');
			}

			requestAnimationFrame(detect);
		};

		detect();
	}, [analyser, dataArray, instrument, selectedString, isListening]);

	const toggleMic = async () => {
		if (isListening) {
			stopMic();
			setIsListening(false);
			setNote(null);
			setCents('0.0');
		} else {
			try {
				await startMic();
				if (analyser?.context?.state === 'suspended') {
					await analyser.context.resume();
				}
				setIsListening(true);
			} catch (err) {
				console.error('Mic start error:', err);
				alert('Microphone access failed. Please allow mic permissions.');
			}
		}
	};

	const instruments = [
		'Guitar', 'Violin', 'Ukulele',
		'Tabla', 'Pakhawaj', 'Harmonium', 'Dholki'
	];

	return (
		<div className="app">
			<button className="toggle-btn" onClick={toggleDarkMode}>
				{darkMode ? 'Light Mode' : 'Dark Mode'}
			</button>

			<h1>🎶 Multi-Instrument Tuner</h1>

			<select
				onChange={(e) => {
					setInstrument(e.target.value);
					setSelectedString(null);
				}}
				value={instrument}
			>
				{instruments.map((inst) => (
					<option key={inst} value={inst}>
						{inst}
					</option>
				))}
			</select>

			{isStringInstrument(instrument) && (
				<select
					onChange={(e) => setSelectedString(e.target.value)}
					value={selectedString || ''}
				>
					<option value="" disabled>Select string</option>
					{stringInstruments[instrument].map((str) => (
						<option key={str} value={str}>
							{str}
						</option>
					))}
				</select>
			)}

			<h2>Selected: {instrument}</h2>
			{isStringInstrument(instrument) && selectedString && (
				<h3>🎸 Tuning String: {selectedString}</h3>
			)}
			<h3>🎤 Microphone: {isListening ? 'Active' : 'Stopped'}</h3>

			<div className="note-display">{note || 'NOTE'}</div>

			<div className="tuner">
				<div className="needle-wrapper">
					<div
						className="needle"
						style={{ transform: `rotate(${cents}deg)` }}
					></div>
					<div className="center-line"></div>
				</div>
				<div className="cents">{cents} cents</div>
			</div>

			<button className="mic-button" onClick={toggleMic}>
				{isListening ? 'Stop Microphone' : 'Start Microphone'}
			</button>
		</div>
	);
}

export default App;
