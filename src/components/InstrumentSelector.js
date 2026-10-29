import React from 'react';
import { INSTRUMENTS } from '../constants/instruments';

export function InstrumentSelector({
	selectedInstrument,
	onSelectInstrument,
	selectedPreset,
	onSelectPreset,
}) {
	const currentInstrument =
		INSTRUMENTS.find((inst) => inst.id === selectedInstrument) || INSTRUMENTS[0];

	return (
		<div className="instrument-selector-card">
			{/* Quick 1-tap Instrument Selector Buttons */}
			<div className="instrument-quick-grid" role="tablist" aria-label="Instrument Selection">
				{INSTRUMENTS.map((inst) => {
					const isSelected = inst.id === selectedInstrument;
					return (
						<button
							key={inst.id}
							type="button"
							role="tab"
							aria-selected={isSelected}
							className={`inst-quick-btn ${isSelected ? 'active' : ''}`}
							onClick={() => onSelectInstrument(inst.id)}
						>
							<span className="inst-icon">{inst.icon}</span>
							<span className="inst-name">{inst.name}</span>
						</button>
					);
				})}
			</div>

			{/* Presets dropdown if current instrument has multiple presets */}
			{currentInstrument.presets && currentInstrument.presets.length > 0 && (
				<div className="instrument-picker-row">
					<div className="picker-select-wrap preset-wrap">
						<label htmlFor="instrument-preset-select" className="picker-label">
							Tuning Preset / Target
						</label>
						<select
							id="instrument-preset-select"
							value={selectedPreset?.id || currentInstrument.presets[0].id}
							onChange={(e) => {
								const preset = currentInstrument.presets.find((p) => p.id === e.target.value);
								if (preset) onSelectPreset(preset);
							}}
							className="preset-select"
						>
							{currentInstrument.presets.map((preset) => (
								<option key={preset.id} value={preset.id}>
									{preset.name}
								</option>
							))}
						</select>
					</div>
				</div>
			)}

			{/* Description badge */}
			{currentInstrument.description && (
				<p className="instrument-description">{currentInstrument.description}</p>
			)}
		</div>
	);
}

export default InstrumentSelector;
