/**
 * Musical note constants, frequencies, and Indian Classical Swara mappings.
 */

export const DEFAULT_A4_FREQ = 440;
export const MIN_A4_FREQ = 415;
export const MAX_A4_FREQ = 466;

export const STANDARD_CALIBRATIONS = [
	{ label: 'Standard Concert (A4 = 440 Hz)', value: 440 },
	{ label: 'Verdi / Natural (A4 = 432 Hz)', value: 432 },
	{ label: 'European Orchestral (A4 = 442 Hz)', value: 442 },
	{ label: 'High Brilliance (A4 = 444 Hz)', value: 444 },
	{ label: 'Baroque Pitch (A4 = 415 Hz)', value: 415 },
];

export const NOTE_NAMES_SHARP = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
export const NOTE_NAMES_FLAT = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

export const SWARAS = [
	{ name: 'Sa', short: 'S', devanagari: 'सा', type: 'Achala (Fixed)', semitone: 0 },
	{ name: 'komal Re', short: 'r', devanagari: 'रे॒', type: 'Komal', semitone: 1 },
	{ name: 'shuddha Re', short: 'R', devanagari: 'रे', type: 'Shuddha', semitone: 2 },
	{ name: 'komal Ga', short: 'g', devanagari: 'ग॒', type: 'Komal', semitone: 3 },
	{ name: 'shuddha Ga', short: 'G', devanagari: 'ग', type: 'Shuddha', semitone: 4 },
	{ name: 'shuddha Ma', short: 'm', devanagari: 'म', type: 'Shuddha', semitone: 5 },
	{ name: 'teevra Ma', short: 'M', devanagari: 'म॑', type: 'Teevra', semitone: 6 },
	{ name: 'Pa', short: 'P', devanagari: 'प', type: 'Achala (Fixed)', semitone: 7 },
	{ name: 'komal Dha', short: 'd', devanagari: 'ध॒', type: 'Komal', semitone: 8 },
	{ name: 'shuddha Dha', short: 'D', devanagari: 'ध', type: 'Shuddha', semitone: 9 },
	{ name: 'komal Ni', short: 'n', devanagari: 'नि॒', type: 'Komal', semitone: 10 },
	{ name: 'shuddha Ni', short: 'N', devanagari: 'नि', type: 'Shuddha', semitone: 11 },
];

export const TONIC_OPTIONS = [
	{ value: 'C', label: 'C (1st Black: C# - 1st White)' },
	{ value: 'C#', label: 'C# (Pehli Kali / 1st Black)' },
	{ value: 'D', label: 'D (2nd White)' },
	{ value: 'D#', label: 'D# (Dusri Kali / 2nd Black)' },
	{ value: 'E', label: 'E (3rd White)' },
	{ value: 'F', label: 'F (4th White)' },
	{ value: 'F#', label: 'F# (Tisri Kali / 3rd Black)' },
	{ value: 'G', label: 'G (5th White)' },
	{ value: 'G#', label: 'G# (Chauthi Kali / 4th Black)' },
	{ value: 'A', label: 'A (6th White)' },
	{ value: 'A#', label: 'A# (Panchvi Kali / 5th Black)' },
	{ value: 'B', label: 'B (7th White)' },
];

