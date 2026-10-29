import React from 'react';
import { getFrequencyFromNote } from '../utils/noteUtils';

export function StringSelector({
	instrument,
	preset,
	selectedTarget,
	onSelectTarget,
	a4Freq,
	onPlayReferenceTone,
	detectedNote,
}) {
	// If instrument has strings or parts
	const items = preset?.strings
		? preset.strings.map((note, idx) => ({
				id: `str-${idx}`,
				note,
				label: preset.labels ? preset.labels[idx] : `String ${idx + 1} (${note})`,
		  }))
		: preset?.parts
		? preset.parts.map((part, idx) => ({
				id: `part-${idx}`,
				note: part.note,
				label: `${part.name} (${part.note})`,
				desc: part.desc,
		  }))
		: [];

	if (items.length === 0) return null;

	return (
		<div className="target-selector-card">
			<div className="target-header-row">
				<span className="target-title">Target Notes / Tuning Points</span>
				<button
					type="button"
					className={`auto-mode-btn ${!selectedTarget ? 'active' : ''}`}
					onClick={() => onSelectTarget(null)}
				>
					✨ Auto Mode (Any Note)
				</button>
			</div>

			<div className="target-pills-grid">
				{items.map((item) => {
					const freq = getFrequencyFromNote(item.note, a4Freq);
					const isSelected = selectedTarget?.note === item.note;
					const isMatched = detectedNote?.name === item.note;

					return (
						<div
							key={item.id}
							className={`target-pill ${isSelected ? 'selected' : ''} ${isMatched ? 'matched' : ''}`}
							onClick={() => onSelectTarget(item)}
						>
							<div className="pill-top">
								<span className="pill-note">{item.note}</span>
								<button
									type="button"
									className="pill-sound-btn"
									title={`Play reference tone for ${item.note}`}
									onClick={(e) => {
										e.stopPropagation();
										if (onPlayReferenceTone) {
											onPlayReferenceTone(freq, item.note);
										}
									}}
								>
									🔊
								</button>
							</div>
							<span className="pill-label">{item.label}</span>
							<span className="pill-freq">{freq.toFixed(1)} Hz</span>
						</div>
					);
				})}
			</div>
		</div>
	);
}

export default StringSelector;

