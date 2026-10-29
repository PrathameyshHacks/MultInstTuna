import React from 'react';

export function TuningMeter({
	detectedNote,
	detectedPitch,
	cents,
	clarity,
	tuningStatus,
	isListening,
	targetNote,
	targetFreq,
	tolerance = 3.5,
	swara,
}) {
	// Clamp cents to [-50, 50] for gauge needle
	const clampedCents = Math.max(-50, Math.min(50, cents || 0));

	// Convert cents to angle (-48 deg to +48 deg)
	const needleAngle = (clampedCents / 50) * 48;

	// In-tune boolean
	const isInTune = tuningStatus === 'in-tune';

	// Generate LED meter segments: 21 dots (-50 to +50 cents, step 5)
	const ledCount = 21;
	const midIndex = Math.floor(ledCount / 2); // index 10 is 0 cents
	const activeIndex = detectedNote ? Math.round(midIndex + (clampedCents / 50) * midIndex) : -1;

	return (
		<div className={`tuner-meter-card ${tuningStatus}`} role="region" aria-label="Tuning Meter">
			{/* Target comparison pill if a target note is active */}
			{targetNote && (
				<div className="target-note-badge">
					<span className="badge-label">TARGET:</span>
					<strong className="badge-val">{targetNote}</strong>
					{targetFreq && <span className="badge-freq">({targetFreq.toFixed(1)} Hz)</span>}
				</div>
			)}

			{/* Main Note & Frequency Display */}
			<div className="tuner-center-display">
				<div className={`main-note ${tuningStatus}`}>
					{detectedNote ? detectedNote.name : '---'}
				</div>

				{swara && (
					<div className="swara-accent-pill">
						<span className="devanagari">{swara.devanagari}</span>
						<span className="roman">{swara.name}</span>
					</div>
				)}

				<div className="frequency-readout">
					{detectedPitch ? (
						<span>
							<strong>{detectedPitch.toFixed(1)}</strong> <small>Hz</small>
						</span>
					) : (
						<span className="placeholder-text">Play a note to begin</span>
					)}
				</div>
			</div>

			{/* SVG Curved Gauge Meter with Needle */}
			<div className="analog-meter-container">
				<svg
					className="gauge-svg"
					viewBox="0 0 300 160"
					preserveAspectRatio="xMidYMid meet"
					aria-hidden="true"
				>
					<defs>
						{/* Radial glow for in-tune state */}
						<filter id="glow-green" x="-20%" y="-20%" width="140%" height="140%">
							<feGaussianBlur stdDeviation="4" result="blur" />
							<feComposite in="SourceGraphic" in2="blur" operator="over" />
						</filter>
						{/* Gauge gradient */}
						<linearGradient id="arc-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
							<stop offset="0%" stopColor="#ef4444" />
							<stop offset="25%" stopColor="#f59e0b" />
							<stop offset="46%" stopColor="#10b981" />
							<stop offset="54%" stopColor="#10b981" />
							<stop offset="75%" stopColor="#f59e0b" />
							<stop offset="100%" stopColor="#ef4444" />
						</linearGradient>
					</defs>

					{/* Background Gauge Arc */}
					<path
						d="M 30 140 A 120 120 0 0 1 270 140"
						fill="none"
						stroke="rgba(150, 150, 150, 0.18)"
						strokeWidth="14"
						strokeLinecap="round"
					/>

					{/* Colored Zone Arc */}
					<path
						d="M 30 140 A 120 120 0 0 1 270 140"
						fill="none"
						stroke="url(#arc-gradient)"
						strokeWidth="6"
						strokeLinecap="round"
						opacity="0.9"
					/>

					{/* Center In-Tune Sweet Spot Arc */}
					<path
						d="M 137 22 A 120 120 0 0 1 163 22"
						fill="none"
						stroke="#10b981"
						strokeWidth="10"
						strokeLinecap="round"
						filter={isInTune ? 'url(#glow-green)' : 'none'}
					/>

					{/* Scale Tick Marks */}
					{[
						{ deg: -48, label: '-50' },
						{ deg: -36, label: '-30' },
						{ deg: -24, label: '-20' },
						{ deg: -12, label: '-10' },
						{ deg: 0, label: '0', center: true },
						{ deg: 12, label: '+10' },
						{ deg: 24, label: '+20' },
						{ deg: 36, label: '+30' },
						{ deg: 48, label: '+50' },
					].map((tick) => {
						const rad = ((tick.deg - 90) * Math.PI) / 180;
						const r1 = 125;
						const r2 = tick.center ? 104 : 112;
						const x1 = 150 + r1 * Math.cos(rad);
						const y1 = 140 + r1 * Math.sin(rad);
						const x2 = 150 + r2 * Math.cos(rad);
						const y2 = 140 + r2 * Math.sin(rad);

						return (
							<g key={tick.deg}>
								<line
									x1={x1}
									y1={y1}
									x2={x2}
									y2={y2}
									stroke={tick.center ? '#10b981' : 'var(--gauge-tick-color, #888)'}
									strokeWidth={tick.center ? 3 : 1.5}
								/>
							</g>
						);
					})}

					{/* Center Pivot Indicator */}
					<circle cx="150" cy="140" r="8" fill="var(--needle-color, #1f2937)" />
					<circle cx="150" cy="140" r="3" fill="#ffffff" />

					{/* Dynamic Pointer / Needle */}
					<g
						transform={`rotate(${needleAngle} 150 140)`}
						style={{
							transition: 'transform 0.09s cubic-bezier(0.2, 0.9, 0.3, 1)',
						}}
					>
						<line
							x1="150"
							y1="140"
							x2="150"
							y2="20"
							stroke={
								isInTune
									? '#10b981'
									: tuningStatus === 'flat'
									? '#f59e0b'
									: tuningStatus === 'sharp'
									? '#ef4444'
									: 'var(--needle-color, #1f2937)'
							}
							strokeWidth="3.5"
							strokeLinecap="round"
							filter={isInTune ? 'url(#glow-green)' : 'none'}
						/>
						{/* Needle Tip Arrow */}
						<polygon
							points="147,20 153,20 150,14"
							fill={
								isInTune
									? '#10b981'
									: tuningStatus === 'flat'
									? '#f59e0b'
									: tuningStatus === 'sharp'
									? '#ef4444'
									: 'var(--needle-color, #1f2937)'
							}
						/>
					</g>
				</svg>

				{/* Cents Scale Labels */}
				<div className="gauge-scale-labels">
					<span>-50¢</span>
					<span>-25¢</span>
					<span className="scale-center-zero">0</span>
					<span>+25¢</span>
					<span>+50¢</span>
				</div>
			</div>

			{/* Digital Strobe LED Bar */}
			<div className="strobe-led-bar" title="Strobe Alignment Display">
				{Array.from({ length: ledCount }).map((_, i) => {
					const isCenter = i === midIndex;
					const isActive = i === activeIndex;
					let ledClass = 'led-dot';

					if (isActive) {
						ledClass += isCenter ? ' active-center' : i < midIndex ? ' active-flat' : ' active-sharp';
					} else if (isCenter) {
						ledClass += ' center-idle';
					}

					return <span key={i} className={ledClass} />;
				})}
			</div>

			{/* Numeric Cents Deviation */}
			<div className="cents-deviation-box">
				{detectedNote ? (
					<span className={`cents-value ${tuningStatus}`}>
						{cents > 0 ? `+${cents}` : cents} <span className="cents-unit">cents</span>
					</span>
				) : (
					<span className="cents-waiting">
						{isListening ? 'Awaiting acoustic signal...' : 'Press Start Microphone'}
					</span>
				)}
			</div>

			{/* Actionable Guidance Tag */}
			<div className="tuning-guidance-container">
				{tuningStatus === 'in-tune' && (
					<div className="guide-badge in-tune">
						<span className="guide-icon">🎯</span>
						<strong>PERFECTLY IN TUNE! (±{tolerance}¢)</strong>
					</div>
				)}
				{tuningStatus === 'flat' && (
					<div className="guide-badge flat">
						<span className="guide-icon">▲</span>
						<strong>TUNE UP (Pitch is Too Flat)</strong>
					</div>
				)}
				{tuningStatus === 'sharp' && (
					<div className="guide-badge sharp">
						<span className="guide-icon">▼</span>
						<strong>TUNE DOWN (Pitch is Too Sharp)</strong>
					</div>
				)}
				{(tuningStatus === 'listening' || tuningStatus === 'idle') && (
					<div className="guide-badge neutral">
						<span className="guide-icon">{isListening ? '🎙️' : '🔇'}</span>
						<span>{isListening ? 'Listening for musical tone...' : 'Microphone is inactive'}</span>
					</div>
				)}
			</div>

			{/* Signal Clarity Confidence Bar */}
			{clarity > 0 && (
				<div className="clarity-bar-wrap" title={`Harmonic Clarity: ${clarity}%`}>
					<span className="clarity-label">Clarity:</span>
					<div className="clarity-track">
						<div
							className="clarity-fill"
							style={{
								width: `${clarity}%`,
								backgroundColor: clarity > 85 ? '#10b981' : clarity > 65 ? '#f59e0b' : '#ef4444',
							}}
						/>
					</div>
					<span className="clarity-percent">{clarity}%</span>
				</div>
			)}
		</div>
	);
}

export default TuningMeter;

