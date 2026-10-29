import React from 'react';
import { STANDARD_CALIBRATIONS, MIN_A4_FREQ, MAX_A4_FREQ } from '../constants/notes';

export function CalibrationModal({
	isOpen,
	onClose,
	a4Freq,
	onChangeA4,
	devices,
	selectedDeviceId,
	onSelectDevice,
	noiseThreshold,
	onChangeNoiseThreshold,
	tolerance,
	onChangeTolerance,
	useFlats,
	onToggleFlats,
	alwaysShowSwara,
	onToggleAlwaysShowSwara,
}) {
	if (!isOpen) return null;

	return (
		<div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
			<div className="modal-content" onClick={(e) => e.stopPropagation()}>
				<div className="modal-header">
					<h2>⚙️ Tuner Settings & Calibration</h2>
					<button className="modal-close-btn" onClick={onClose} aria-label="Close settings">
						✕
					</button>
				</div>

				<div className="modal-body">
					{/* Calibration Section */}
					<section className="settings-section">
						<div className="section-title-wrap">
							<span className="section-icon">🎯</span>
							<label htmlFor="a4-input" className="section-title">
								A4 Concert Pitch Calibration
							</label>
						</div>
						<p className="settings-desc">
							Default is 440 Hz standard concert pitch. Adjust for 432 Hz natural frequency or
							orchestral calibration.
						</p>

						<div className="a4-control-row">
							<input
								id="a4-slider"
								type="range"
								min={MIN_A4_FREQ}
								max={MAX_A4_FREQ}
								step="1"
								value={a4Freq}
								onChange={(e) => onChangeA4(parseInt(e.target.value, 10))}
								className="slider-input"
							/>
							<div className="a4-num-display">
								<input
									id="a4-input"
									type="number"
									min={MIN_A4_FREQ}
									max={MAX_A4_FREQ}
									value={a4Freq}
									onChange={(e) => {
										const val = parseInt(e.target.value, 10);
										if (val >= MIN_A4_FREQ && val <= MAX_A4_FREQ) {
											onChangeA4(val);
										}
									}}
									className="num-input"
								/>
								<span className="unit">Hz</span>
							</div>
						</div>

						{/* Quick Preset Buttons */}
						<div className="quick-presets">
							{STANDARD_CALIBRATIONS.map((preset) => (
								<button
									key={preset.value}
									className={`preset-pill ${a4Freq === preset.value ? 'active' : ''}`}
									onClick={() => onChangeA4(preset.value)}
								>
									{preset.value} Hz
								</button>
							))}
						</div>
					</section>

					{/* Microphone Device Selection */}
					<section className="settings-section">
						<div className="section-title-wrap">
							<span className="section-icon">🎙️</span>
							<label htmlFor="mic-device-select" className="section-title">
								Microphone Input Device
							</label>
						</div>
						{devices && devices.length > 0 ? (
							<select
								id="mic-device-select"
								value={selectedDeviceId || ''}
								onChange={(e) => onSelectDevice(e.target.value)}
								className="settings-select"
							>
								<option value="">Default Audio Input</option>
								{devices.map((device, idx) => (
									<option key={device.deviceId || idx} value={device.deviceId}>
										{device.label || `Microphone ${idx + 1}`}
									</option>
								))}
							</select>
						) : (
							<p className="settings-note">
								Using system default microphone. Connect USB audio interfaces or external mics to
								select them here.
							</p>
						)}
					</section>

					{/* Noise Gate Sensitivity */}
					<section className="settings-section">
						<div className="section-title-wrap">
							<span className="section-icon">🔊</span>
							<label htmlFor="noise-slider" className="section-title">
								Noise Gate Threshold
							</label>
						</div>
						<p className="settings-desc">
							Increase in noisy environments to filter room murmur and air conditioning rumble.
						</p>
						<div className="slider-row">
							<input
								id="noise-slider"
								type="range"
								min="0.005"
								max="0.04"
								step="0.002"
								value={noiseThreshold}
								onChange={(e) => onChangeNoiseThreshold(parseFloat(e.target.value))}
								className="slider-input"
							/>
							<span className="slider-label">
								{noiseThreshold <= 0.01
									? 'High Sensitivity'
									: noiseThreshold <= 0.02
									? 'Standard'
									: 'Aggressive Filter'}
							</span>
						</div>
					</section>

					{/* In-Tune Precision Tolerance */}
					<section className="settings-section">
						<div className="section-title-wrap">
							<span className="section-icon">📏</span>
							<span className="section-title">Tuning Precision Tolerance</span>
						</div>
						<div className="tolerance-options">
							{[
								{ label: 'Strict (±2.0¢)', value: 2.0, desc: 'Professional string / vocal' },
								{ label: 'Standard (±3.5¢)', value: 3.5, desc: 'General instrument' },
								{ label: 'Relaxed (±5.0¢)', value: 5.0, desc: 'Acoustic / Stage use' },
							].map((tol) => (
								<button
									key={tol.value}
									className={`tolerance-btn ${tolerance === tol.value ? 'active' : ''}`}
									onClick={() => onChangeTolerance(tol.value)}
								>
									<strong>{tol.label}</strong>
									<small>{tol.desc}</small>
								</button>
							))}
						</div>
					</section>

					{/* Display Options */}
					<section className="settings-section">
						<div className="section-title-wrap">
							<span className="section-icon">🎛️</span>
							<span className="section-title">Display Preferences</span>
						</div>
						<div className="toggles-list">
							<label className="toggle-row">
								<span>Notation Accidentals</span>
								<div className="toggle-switch-wrap">
									<button
										type="button"
										className={`toggle-option ${!useFlats ? 'active' : ''}`}
										onClick={() => onToggleFlats(false)}
									>
										♯ Sharps
									</button>
									<button
										type="button"
										className={`toggle-option ${useFlats ? 'active' : ''}`}
										onClick={() => onToggleFlats(true)}
									>
										♭ Flats
									</button>
								</div>
							</label>

							<label className="toggle-row">
								<span>Always Show Indian Swara (सा, रे, ग)</span>
								<input
									type="checkbox"
									checked={alwaysShowSwara}
									onChange={(e) => onToggleAlwaysShowSwara(e.target.checked)}
									className="checkbox-input"
								/>
							</label>
						</div>
					</section>
				</div>

				<div className="modal-footer">
					<button className="primary-modal-btn" onClick={onClose}>
						Done
					</button>
				</div>
			</div>
		</div>
	);
}

export default CalibrationModal;

