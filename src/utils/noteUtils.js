import { NOTE_NAMES_SHARP, NOTE_NAMES_FLAT, SWARAS, DEFAULT_A4_FREQ } from '../constants/notes';

/**
 * Calculates the exact frequency for a note string (e.g. 'A4', 'C#3', 'Eb2')
 * based on the reference A4 calibration.
 */
export function getFrequencyFromNote(noteStr, a4Freq = DEFAULT_A4_FREQ) {
	if (!noteStr || typeof noteStr !== 'string') return 0;

	// Parse note name and octave: e.g. "C#4", "Db3", "A0"
	const match = noteStr.trim().match(/^([A-Ga-g][#b]?)(-?\d+)$/);
	if (!match) return 0;

	const rawName = match[1].toUpperCase();
	const octave = parseInt(match[2], 10);

	let semitone = NOTE_NAMES_SHARP.indexOf(rawName);
	if (semitone === -1) {
		semitone = NOTE_NAMES_FLAT.indexOf(rawName);
	}
	if (semitone === -1) return 0;

	// MIDI note number: C4 is 60, A4 is 69
	const midi = (octave + 1) * 12 + semitone;
	return a4Freq * Math.pow(2, (midi - 69) / 12);
}

/**
 * Converts a detected pitch in Hertz to the nearest musical note,
 * including its octave, exact target frequency, and cents deviation.
 */
export function getNoteFromPitch(frequency, a4Freq = DEFAULT_A4_FREQ, useFlats = false) {
	if (!frequency || frequency <= 0 || !isFinite(frequency)) return null;

	// MIDI number as floating point
	const noteNumber = 12 * Math.log2(frequency / a4Freq) + 69;
	const roundedMidi = Math.round(noteNumber);
	const noteIndex = ((roundedMidi % 12) + 12) % 12;
	const octave = Math.floor(roundedMidi / 12) - 1;

	const noteNames = useFlats ? NOTE_NAMES_FLAT : NOTE_NAMES_SHARP;
	const noteName = noteNames[noteIndex];
	const fullName = `${noteName}${octave}`;
	const targetFrequency = a4Freq * Math.pow(2, (roundedMidi - 69) / 12);
	const cents = 1200 * Math.log2(frequency / targetFrequency);

	return {
		name: fullName,
		noteName,
		octave,
		midi: roundedMidi,
		frequency: targetFrequency,
		cents: Math.round(cents * 10) / 10,
	};
}

/**
 * Returns the cents difference between a detected frequency and a target frequency.
 * Positive cents = sharp (too high), Negative cents = flat (too low).
 */
export function getCentsDifference(freq, refFreq) {
	if (!freq || !refFreq || freq <= 0 || refFreq <= 0 || !isFinite(freq) || !isFinite(refFreq)) {
		return 0;
	}
	const cents = 1200 * Math.log2(freq / refFreq);
	return Math.round(cents * 10) / 10;
}

/**
 * Maps a musical note to its Indian Classical Swara (Sa, Re, Ga, Ma, Pa, Dha, Ni)
 * relative to the user's selected Tonic (Sa).
 */
export function getSwaraFromNote(noteName, octave = 4, tonic = 'C#') {
	if (!noteName) return null;

	const cleanNote = noteName.replace(/-?\d+$/, '');
	let noteIdx = NOTE_NAMES_SHARP.indexOf(cleanNote);
	if (noteIdx === -1) {
		noteIdx = NOTE_NAMES_FLAT.indexOf(cleanNote);
	}
	let tonicIdx = NOTE_NAMES_SHARP.indexOf(tonic);
	if (tonicIdx === -1) {
		tonicIdx = NOTE_NAMES_FLAT.indexOf(tonic);
	}

	if (noteIdx === -1 || tonicIdx === -1) return null;

	const semitoneDiff = ((noteIdx - tonicIdx) + 12) % 12;
	const swaraInfo = SWARAS[semitoneDiff] || SWARAS[0];

	// Determine Saptak (Octave): Mandra (Lower), Madhya (Middle), Taar (Higher)
	let saptak = 'Madhya (Middle)';
	let saptakSymbol = '';
	if (octave <= 2) {
		saptak = 'Ati-Mandra (Deep Bass)';
		saptakSymbol = '..';
	} else if (octave === 3) {
		saptak = 'Mandra (Lower)';
		saptakSymbol = '.';
	} else if (octave === 4) {
		saptak = 'Madhya (Middle)';
		saptakSymbol = '';
	} else if (octave === 5) {
		saptak = 'Taar (Upper)';
		saptakSymbol = "'";
	} else if (octave >= 6) {
		saptak = 'Ati-Taar (High)';
		saptakSymbol = "''";
	}

	return {
		...swaraInfo,
		displayName: `${swaraInfo.name}${saptakSymbol}`,
		shortWithSaptak: `${swaraInfo.short}${saptakSymbol}`,
		saptak,
		tonic,
	};
}

/**
 * Human-friendly tuning state helper.
 */
export function getTuningStatus(cents, tolerance = 3.5) {
	if (cents === null || cents === undefined || isNaN(cents)) return 'idle';
	if (Math.abs(cents) <= tolerance) return 'in-tune';
	return cents < 0 ? 'flat' : 'sharp';
}
