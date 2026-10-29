import React, { useState, useEffect, useCallback, useMemo } from 'react';
import './App.css';
import { INSTRUMENTS } from './constants/instruments';
import { DEFAULT_A4_FREQ } from './constants/notes';
import { getFrequencyFromNote, getSwaraFromNote } from './utils/noteUtils';
import { useMicrophone } from './hooks/useMicrophone';
import { usePitchDetection } from './hooks/usePitchDetection';
import { useWakeLock } from './hooks/useWakeLock';
import toneSynth from './services/audioSynthesizer';

import Header from './components/Header';
import TuningMeter from './components/TuningMeter';
import InstrumentSelector from './components/InstrumentSelector';
import StringSelector from './components/StringSelector';
import IndianClassicalPanel from './components/IndianClassicalPanel';
import ReferenceToneGenerator from './components/ReferenceToneGenerator';
import CalibrationModal from './components/CalibrationModal';
import InstallModal from './components/InstallModal';

function App() {
	// Persistent Preferences
	const [darkMode, setDarkMode] = useState(() => {
		const saved = localStorage.getItem('insttuna_theme');
		return saved !== null ? saved === 'dark' : true; // Default dark mode for pro audio feel
	});

	const [a4Freq, setA4Freq] = useState(() => {
		const saved = localStorage.getItem('insttuna_a4');
		return saved ? parseInt(saved, 10) : DEFAULT_A4_FREQ;
	});

	const [tolerance, setTolerance] = useState(() => {
		const saved = localStorage.getItem('insttuna_tolerance');
		return saved ? parseFloat(saved) : 3.5;
	});

	const [noiseThreshold, setNoiseThreshold] = useState(() => {
		const saved = localStorage.getItem('insttuna_noise_threshold');
		return saved ? parseFloat(saved) : 0.012;
	});

	const [useFlats, setUseFlats] = useState(() => {
		return localStorage.getItem('insttuna_flats') === 'true';
	});

	const [alwaysShowSwara, setAlwaysShowSwara] = useState(() => {
		return localStorage.getItem('insttuna_always_swara') === 'true';
	});

	// Instrument Selection State - Default: Acoustic Guitar
	const [selectedInstrumentId, setSelectedInstrumentId] = useState('guitar');
	const currentInstrument = useMemo(() => {
		return INSTRUMENTS.find((i) => i.id === selectedInstrumentId) || INSTRUMENTS[0];
	}, [selectedInstrumentId]);

	const [selectedPreset, setSelectedPreset] = useState(() => {
		const defaultInst = INSTRUMENTS.find((i) => i.id === 'guitar') || INSTRUMENTS[0];
		return defaultInst.presets && defaultInst.presets.length > 0 ? defaultInst.presets[0] : null;
	});

	const [selectedTarget, setSelectedTarget] = useState(null); // null = Auto mode
	const [tonic, setTonic] = useState('C#');
	const [isCalibrationOpen, setIsCalibrationOpen] = useState(false);
	const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
	const [nativeInstallPrompt, setNativeInstallPrompt] = useState(null);
	const [isPlayingDrone, setIsPlayingDrone] = useState(false);

	// Detect platform for install instructions
	const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
	const mqResult = typeof window.matchMedia === 'function'
		? window.matchMedia('(display-mode: standalone)')
		: null;
	const isStandalone = (mqResult?.matches ?? false) || window.navigator.standalone === true;

	// Web Audio Microphone Hook
	const {
		analyser,
		dataArray,
		error: micError,
		devices,
		selectedDeviceId,
		startMic,
		stopMic,
		selectDevice,
	} = useMicrophone();

	const isListening = Boolean(analyser);

	// Keep screen on during tuning sessions
	useWakeLock(isListening);

	// Calculate target frequency if specific string/part locked
	const targetFreq = useMemo(() => {
		if (!selectedTarget) return null;
		return getFrequencyFromNote(selectedTarget.note, a4Freq);
	}, [selectedTarget, a4Freq]);

	// Pitch Detection Engine
	const {
		detectedNote,
		detectedPitch,
		cents,
		clarity,
		tuningStatus,
	} = usePitchDetection({
		analyser,
		dataArray,
		isListening,
		a4Freq,
		noiseThreshold,
		tolerance,
		selectedTarget,
		targetFreq,
		useFlats,
	});

	// Synchronize theme class on body
	useEffect(() => {
		document.body.className = darkMode ? 'dark-mode' : 'light-mode';
		localStorage.setItem('insttuna_theme', darkMode ? 'dark' : 'light');
	}, [darkMode]);

	// Save preferences
	useEffect(() => {
		localStorage.setItem('insttuna_a4', a4Freq.toString());
	}, [a4Freq]);

	useEffect(() => {
		localStorage.setItem('insttuna_tolerance', tolerance.toString());
	}, [tolerance]);

	useEffect(() => {
		localStorage.setItem('insttuna_noise_threshold', noiseThreshold.toString());
	}, [noiseThreshold]);

	useEffect(() => {
		localStorage.setItem('insttuna_flats', useFlats.toString());
	}, [useFlats]);

	useEffect(() => {
		localStorage.setItem('insttuna_always_swara', alwaysShowSwara.toString());
	}, [alwaysShowSwara]);

	// Listen for PWA beforeinstallprompt
	useEffect(() => {
		const handleBeforeInstall = (e) => {
			e.preventDefault();
			setNativeInstallPrompt(e);
		};
		window.addEventListener('beforeinstallprompt', handleBeforeInstall);
		return () => {
			window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
		};
	}, []);

	const handleInstallApp = async () => {
		if (!nativeInstallPrompt) return;
		nativeInstallPrompt.prompt();
		const { outcome } = await nativeInstallPrompt.userChoice;
		if (outcome === 'accepted') {
			setNativeInstallPrompt(null);
		}
	};

	// Handle Instrument Switch
	const handleSelectInstrument = useCallback((instId) => {
		setSelectedInstrumentId(instId);
		const inst = INSTRUMENTS.find((i) => i.id === instId);
		if (inst && inst.presets && inst.presets.length > 0) {
			setSelectedPreset(inst.presets[0]);
			if (inst.presets[0].tonic) {
				setTonic(inst.presets[0].tonic);
			}
		} else {
			setSelectedPreset(null);
		}
		setSelectedTarget(null); // Reset string target on instrument change
	}, []);

	// Handle Preset Switch
	const handleSelectPreset = useCallback((preset) => {
		setSelectedPreset(preset);
		if (preset.tonic) {
			setTonic(preset.tonic);
		}
		setSelectedTarget(null);
	}, []);

	// Microphone Toggle
	const toggleMic = useCallback(async () => {
		if (isListening) {
			stopMic();
		} else {
			await startMic();
		}
	}, [isListening, stopMic, startMic]);

	// Spacebar keyboard shortcut to start/stop mic
	useEffect(() => {
		const handleKeyDown = (e) => {
			if (e.code === 'Space' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'SELECT') {
				e.preventDefault();
				toggleMic();
			}
		};
		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [toggleMic]);

	// Quick Reference Tone playback for string pills
	const handlePlayReferenceTone = useCallback(
		(freq) => {
			toneSynth.start(freq, 'sine', 0.25);
			setTimeout(() => {
				toneSynth.stop();
			}, 1800);
		},
		[]
	);

	// Tanpura continuous drone toggle
	const handleToggleDrone = useCallback(() => {
		if (isPlayingDrone) {
			toneSynth.stop();
			setIsPlayingDrone(false);
		} else {
			const droneFreq = getFrequencyFromNote(`${tonic}3`, a4Freq);
			toneSynth.start(droneFreq, 'drone', 0.28);
			setIsPlayingDrone(true);
		}
	}, [isPlayingDrone, tonic, a4Freq]);

	// Determine if Indian Classical Panel should be shown
	const isIndianInstrument = [
		'tabla',
		'pakhawaj',
		'dholki',
		'harmonium',
		'sitar',
	].includes(currentInstrument.id);

	const showIndianPanel = isIndianInstrument || alwaysShowSwara;

	// Calculate current Swara for the meter display
	const currentSwara = useMemo(() => {
		if (!detectedNote) return null;
		return getSwaraFromNote(detectedNote.noteName, detectedNote.octave, tonic);
	}, [detectedNote, tonic]);

	return (
		<div className="app-shell">
			<Header
				darkMode={darkMode}
				onToggleTheme={() => setDarkMode(!darkMode)}
				a4Freq={a4Freq}
				onOpenCalibration={() => setIsCalibrationOpen(true)}
				isListening={isListening}
				onOpenInstallModal={() => setIsInstallModalOpen(true)}
				isStandalone={isStandalone}
			/>

			{micError && (
				<div className="mic-error-banner" role="alert">
					<span className="error-icon">⚠️</span>
					<div className="error-text">
						<strong>Microphone Access Needed</strong>
						<p>{micError}</p>
					</div>
				</div>
			)}

			<main className="tuner-main-content">
				{/* Primary Ergonomic Mic Activation Button */}
				<div className="mic-control-bar">
					<button
						className={`main-mic-button ${isListening ? 'active-listening' : 'standby'}`}
						onClick={toggleMic}
						aria-pressed={isListening}
					>
						<span className="mic-pulse-ring" />
						<span className="mic-btn-icon">{isListening ? '⏹' : '🎙️'}</span>
						<span className="mic-btn-label">
							{isListening ? 'Stop Listening' : 'Start Microphone'}
						</span>
						<span className="mic-btn-sub">
							{isListening ? 'Tap to pause audio' : 'Press Space or Tap'}
						</span>
					</button>
				</div>

				{/* Primary High-Resolution Tuning Meter */}
				<TuningMeter
					detectedNote={detectedNote}
					detectedPitch={detectedPitch}
					cents={cents}
					clarity={clarity}
					tuningStatus={tuningStatus}
					isListening={isListening}
					targetNote={selectedTarget?.note}
					targetFreq={targetFreq}
					tolerance={tolerance}
					swara={showIndianPanel ? currentSwara : null}
				/>

				{/* Instrument & Preset Selector */}
				<InstrumentSelector
					selectedInstrument={selectedInstrumentId}
					onSelectInstrument={handleSelectInstrument}
					selectedPreset={selectedPreset}
					onSelectPreset={handleSelectPreset}
				/>

				{/* Target String / Peg / Drum Part Selector */}
				{selectedPreset && (
					<StringSelector
						instrument={currentInstrument}
						preset={selectedPreset}
						selectedTarget={selectedTarget}
						onSelectTarget={setSelectedTarget}
						a4Freq={a4Freq}
						onPlayReferenceTone={handlePlayReferenceTone}
						detectedNote={detectedNote}
					/>
				)}

				{/* Indian Classical Sargam & Tabla Gajra Balancer */}
				{showIndianPanel && (
					<IndianClassicalPanel
						tonic={tonic}
						onSelectTonic={setTonic}
						detectedPitch={detectedPitch}
						detectedNote={detectedNote}
						instrumentId={currentInstrument.id}
						onPlayDrone={handleToggleDrone}
						isPlayingDrone={isPlayingDrone}
					/>
				)}

				{/* Reference Tone Synthesizer & Tanpura Drone */}
				<ReferenceToneGenerator a4Freq={a4Freq} />
			</main>

			{/* Calibration & Audio Settings Modal */}
			<CalibrationModal
				isOpen={isCalibrationOpen}
				onClose={() => setIsCalibrationOpen(false)}
				a4Freq={a4Freq}
				onChangeA4={setA4Freq}
				devices={devices}
				selectedDeviceId={selectedDeviceId}
				onSelectDevice={selectDevice}
				noiseThreshold={noiseThreshold}
				onChangeNoiseThreshold={setNoiseThreshold}
				tolerance={tolerance}
				onChangeTolerance={setTolerance}
				useFlats={useFlats}
				onToggleFlats={setUseFlats}
				alwaysShowSwara={alwaysShowSwara}
				onToggleAlwaysShowSwara={setAlwaysShowSwara}
			/>

			{/* PWA Install Modal */}
			<InstallModal
				isOpen={isInstallModalOpen}
				onClose={() => setIsInstallModalOpen(false)}
				onInstallPrompt={handleInstallApp}
				hasNativePrompt={Boolean(nativeInstallPrompt)}
				isIOS={isIOS}
			/>

			<footer className="tuner-footer">
				<p>
					MultInstTuna Pro • Web Audio API & Parabolic Normalized Autocorrelation • Keyboard: Press{' '}
					<kbd>Space</kbd> to toggle microphone
				</p>
			</footer>
		</div>
	);
}

export default App;
