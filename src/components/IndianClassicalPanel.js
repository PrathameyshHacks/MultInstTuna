import React, { useState } from 'react';
import { TONIC_OPTIONS, SWARAS } from '../constants/notes';
import { getSwaraFromNote } from '../utils/noteUtils';

export function IndianClassicalPanel({
	tonic,
	onSelectTonic,
	detectedPitch,
	detectedNote,
	instrumentId,
	onPlayDrone,
	isPlayingDrone,
}) {
	// Circular Gajra Lug balancing state for Tabla / Pakhawaj
	const [lugPoints, setLugPoints] = useState([
		{ id: 1, name: 'North (Top)', cents: null, note: null },
		{ id: 2, name: 'North-East', cents: null, note: null },
		{ id: 3, name: 'East (Right)', cents: null, note: null },
		{ id: 4, name: 'South-East', cents: null, note: null },
		{ id: 5, name: 'South (Bottom)', cents: null, note: null },
		{ id: 6, name: 'South-West', cents: null, note: null },
		{ id: 7, name: 'West (Left)', cents: null, note: null },
		{ id: 8, name: 'North-West', cents: null, note: null },
	]);
	const [activeLugIndex, setActiveLugIndex] = useState(0);

	const isPercussion = ['tabla', 'pakhawaj', 'dholki', 'mridangam'].includes(instrumentId);

	// Get current swara based on detected note
	const swara = detectedNote ? getSwaraFromNote(detectedNote.noteName, detectedNote.octave, tonic) : null;

	const recordCurrentPitchToLug = (index) => {
		if (!detectedNote) return;
		setLugPoints((prev) => {
			const next = [...prev];
			next[index] = {
				...next[index],
				cents: detectedNote.cents,
				note: detectedNote.name,
				freq: detectedPitch,
			};
			return next;
		});
		// Advance to next lug
		setActiveLugIndex((index + 1) % 8);
	};

	const resetLugTension = () => {
		setLugPoints((prev) =>
			prev.map((lug) => ({ ...lug, cents: null, note: null, freq: null }))
		);
		setActiveLugIndex(0);
	};

	return (
		<div className="indian-panel-card">
			<div className="indian-panel-header">
				<div className="title-wrap">
					<span className="panel-badge">🇮🇳 Indian Classical</span>
					<h3 className="panel-title">Sargam & Shruti Alignment</h3>
				</div>

				<div className="tonic-picker-wrap">
					<label htmlFor="tonic-select">Tonic (Sa):</label>
					<select
						id="tonic-select"
						value={tonic}
						onChange={(e) => onSelectTonic(e.target.value)}
						className="tonic-select"
					>
						{TONIC_OPTIONS.map((opt) => (
							<option key={opt.value} value={opt.value}>
								{opt.label}
							</option>
						))}
					</select>
				</div>
			</div>

			{/* Current Swara Highlight Banner */}
			<div className="swara-display-card">
				<div className="swara-main-box">
					<span className="swara-devanagari">{swara ? swara.devanagari : 'सा'}</span>
					<span className="swara-roman">{swara ? swara.name : 'Sa (Tonic)'}</span>
				</div>
				<div className="swara-details-box">
					<div className="detail-row">
						<span className="detail-label">Type:</span>
						<span className="detail-value">{swara ? swara.type : 'Achala (Fixed)'}</span>
					</div>
					<div className="detail-row">
						<span className="detail-label">Saptak (Octave):</span>
						<span className="detail-value">{swara ? swara.saptak : 'Madhya Saptak'}</span>
					</div>
					<div className="detail-row">
						<span className="detail-label">Tonic Reference:</span>
						<span className="detail-value">Sa = {tonic}</span>
					</div>
				</div>

				{/* Tanpura Drone shortcut */}
				<button
					type="button"
					className={`drone-toggle-btn ${isPlayingDrone ? 'active' : ''}`}
					onClick={onPlayDrone}
					title="Toggle background Tanpura acoustic drone"
				>
					{isPlayingDrone ? '⏹ Stop Drone' : `🪕 Play ${tonic} Drone`}
				</button>
			</div>

			{/* Tabla / Pakhawaj Gajra Rim Lug Tension Balancer */}
			{isPercussion && (
				<div className="gajra-balancer-section">
					<div className="gajra-header">
						<h4>🪘 Gajra Rim Tension Balancer</h4>
						<button type="button" className="gajra-reset-btn" onClick={resetLugTension}>
							Reset Rim Points
						</button>
					</div>
					<p className="gajra-desc">
						Tap the rim (Kinar / Chanti) around the 8 Gajra braid points with your hammer.
						Record each point to ensure uniform drum tension all around.
					</p>

					<div className="gajra-circle-container">
						<div className="gajra-ring">
							{lugPoints.map((lug, idx) => {
								const angle = (idx * 360) / 8 - 90;
								const rad = (angle * Math.PI) / 180;
								// Radius 88px inside 220px container
								const x = Math.round(110 + 85 * Math.cos(rad));
								const y = Math.round(110 + 85 * Math.sin(rad));

								let statusClass = 'empty';
								if (lug.cents !== null) {
									statusClass = Math.abs(lug.cents) <= 4 ? 'in-tune' : lug.cents < 0 ? 'flat' : 'sharp';
								}
								const isActive = activeLugIndex === idx;

								return (
									<button
										key={lug.id}
										type="button"
										className={`lug-node ${statusClass} ${isActive ? 'active-lug' : ''}`}
										style={{ left: `${x}px`, top: `${y}px` }}
										onClick={() => recordCurrentPitchToLug(idx)}
										title={`${lug.name}: ${
											lug.cents !== null
												? `${lug.cents > 0 ? '+' : ''}${lug.cents}¢ (${lug.note})`
												: 'Click to record current pitch'
										}`}
									>
										<span className="lug-num">{lug.id}</span>
										{lug.cents !== null && (
											<span className="lug-cents">
												{lug.cents > 0 ? `+${lug.cents}` : lug.cents}
											</span>
										)}
									</button>
								);
							})}

							{/* Center Drum Skin Display */}
							<div className="drum-center-hub">
								<span className="drum-label">Syahi / Gab</span>
								{detectedPitch ? (
									<span className="drum-live-pitch">{detectedPitch.toFixed(1)} Hz</span>
								) : (
									<span className="drum-hint">Tap Rim</span>
								)}
								<button
									type="button"
									className="record-lug-btn"
									onClick={() => recordCurrentPitchToLug(activeLugIndex)}
									disabled={!detectedNote}
								>
									Record Pt {activeLugIndex + 1}
								</button>
							</div>
						</div>
					</div>

					{/* Hammer Adjustment Guidance */}
					{lugPoints[activeLugIndex]?.cents !== null && (
						<div className="hammer-advice-box">
							{Math.abs(lugPoints[activeLugIndex].cents) <= 4 ? (
								<span className="advice in-tune">
									✅ Point {activeLugIndex + 1} is uniformly balanced!
								</span>
							) : lugPoints[activeLugIndex].cents < -4 ? (
								<span className="advice flat">
									🔨 Point {activeLugIndex + 1} is {lugPoints[activeLugIndex].cents}¢ flat: Tap
									hammer downward on the Gajra rim to raise pitch.
								</span>
							) : (
								<span className="advice sharp">
									🔨 Point {activeLugIndex + 1} is +{lugPoints[activeLugIndex].cents}¢ sharp: Tap
									hammer upward beneath the Gajra braid to lower pitch.
								</span>
							)}
						</div>
					)}
				</div>
			)}

			{/* Sargam Scale Reference Strip */}
			<div className="sargam-strip">
				<span className="sargam-strip-label">Sargam Scale:</span>
				<div className="sargam-pills-row">
					{SWARAS.map((s) => {
						const isCurrent = swara?.semitone === s.semitone;
						return (
							<span key={s.short} className={`sargam-mini-pill ${isCurrent ? 'active' : ''}`}>
								<strong>{s.devanagari}</strong>
								<small>{s.short}</small>
							</span>
						);
					})}
				</div>
			</div>
		</div>
	);
}

export default IndianClassicalPanel;

