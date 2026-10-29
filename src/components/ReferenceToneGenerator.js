import React, { useState, useEffect } from 'react';
import toneSynth from '../services/audioSynthesizer';
import { NOTE_NAMES_SHARP } from '../constants/notes';
import { getFrequencyFromNote } from '../utils/noteUtils';

export function ReferenceToneGenerator({ a4Freq = 440 }) {
	const [isOpen, setIsOpen] = useState(false);
	const [selectedNote, setSelectedNote] = useState('A');
	const [selectedOctave, setSelectedOctave] = useState(4);
	const [waveform, setWaveform] = useState('sine'); // 'sine' | 'triangle' | 'drone' | 'sawtooth'
	const [volume, setVolume] = useState(0.25);
	const [isPlaying, setIsPlaying] = useState(false);

	const noteString = `${selectedNote}${selectedOctave}`;
	const currentFreq = getFrequencyFromNote(noteString, a4Freq);

	// Update frequency while playing
	useEffect(() => {
		if (isPlaying) {
			toneSynth.setFrequency(currentFreq);
		}
	}, [currentFreq, isPlaying]);

	// Update volume while playing
	useEffect(() => {
		toneSynth.setVolume(volume);
	}, [volume]);

	// Clean up on unmount
	useEffect(() => {
		return () => {
			toneSynth.stop();
		};
	}, []);

	const togglePlay = () => {
		if (isPlaying) {
			toneSynth.stop();
			setIsPlaying(false);
		} else {
			toneSynth.start(currentFreq, waveform, volume);
			setIsPlaying(true);
		}
	};

	const changeWaveform = (newWaveform) => {
		setWaveform(newWaveform);
		if (isPlaying) {
			toneSynth.start(currentFreq, newWaveform, volume);
		}
	};

	const quickPitchPresets = [
		{ name: 'A4 (440 Hz)', note: 'A', oct: 4 },
		{ name: 'C#4 (Pehli Kali)', note: 'C#', oct: 4 },
		{ name: 'C4 (Middle C)', note: 'C', oct: 4 },
		{ name: 'E2 (Guitar E)', note: 'E', oct: 2 },
		{ name: 'G3 (Violin G)', note: 'G', oct: 3 },
	];

	return (
		<div className="reference-tone-card">
			<div className="tone-card-header" onClick={() => setIsOpen(!isOpen)}>
				<div className="tone-header-left">
					<span className="tone-icon">🔊</span>
					<div>
						<h3 className="tone-title">Reference Tone Synthesizer</h3>
						<span className="tone-sub">Acoustic pitch generator & Tanpura drone</span>
					</div>
				</div>
				<button
					type="button"
					className={`tone-expand-btn ${isOpen ? 'open' : ''}`}
					aria-expanded={isOpen}
				>
					{isOpen ? '▲ Hide' : '▼ Expand'}
				</button>
			</div>

			{isOpen && (
				<div className="tone-card-body">
					{/* Note & Octave selectors */}
					<div className="tone-controls-grid">
						<div className="control-field">
							<label htmlFor="tone-note-select">Note</label>
							<select
								id="tone-note-select"
								value={selectedNote}
								onChange={(e) => setSelectedNote(e.target.value)}
								className="tone-select"
							>
								{NOTE_NAMES_SHARP.map((n) => (
									<option key={n} value={n}>
										{n}
									</option>
								))}
							</select>
						</div>

						<div className="control-field">
							<label htmlFor="tone-octave-select">Octave</label>
							<select
								id="tone-octave-select"
								value={selectedOctave}
								onChange={(e) => setSelectedOctave(parseInt(e.target.value, 10))}
								className="tone-select"
							>
								{[1, 2, 3, 4, 5, 6].map((oct) => (
									<option key={oct} value={oct}>
										Octave {oct}
									</option>
								))}
							</select>
						</div>

						<div className="control-field">
							<label htmlFor="tone-waveform-select">Timbre</label>
							<select
								id="tone-waveform-select"
								value={waveform}
								onChange={(e) => changeWaveform(e.target.value)}
								className="tone-select"
							>
								<option value="sine">〰️ Pure Sine</option>
								<option value="triangle">📐 Warm Triangle</option>
								<option value="drone">🪕 Tanpura Drone</option>
								<option value="sawtooth">🪚 Bright Saw</option>
							</select>
						</div>
					</div>

					{/* Target Frequency and Play Button */}
					<div className="tone-playback-row">
						<div className="freq-target-pill">
							<span className="target-note-large">{noteString}</span>
							<span className="target-hz-large">{currentFreq.toFixed(1)} Hz</span>
						</div>

						<button
							type="button"
							className={`tone-play-btn ${isPlaying ? 'playing' : ''}`}
							onClick={togglePlay}
						>
							{isPlaying ? '⏹ Stop Tone' : '▶ Play Reference Tone'}
						</button>
					</div>

					{/* Volume Slider */}
					<div className="volume-slider-row">
						<span className="vol-icon">🔉</span>
						<input
							type="range"
							min="0.01"
							max="0.8"
							step="0.02"
							value={volume}
							onChange={(e) => setVolume(parseFloat(e.target.value))}
							className="volume-slider"
							aria-label="Tone volume"
						/>
						<span className="vol-val">{Math.round((volume / 0.8) * 100)}%</span>
					</div>

					{/* Quick Presets */}
					<div className="quick-tone-presets">
						<span className="quick-label">Quick Notes:</span>
						<div className="quick-pills-wrap">
							{quickPitchPresets.map((qp) => (
								<button
									key={qp.name}
									type="button"
									className="quick-tone-pill"
									onClick={() => {
										setSelectedNote(qp.note);
										setSelectedOctave(qp.oct);
									}}
								>
									{qp.name}
								</button>
							))}
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export default ReferenceToneGenerator;

