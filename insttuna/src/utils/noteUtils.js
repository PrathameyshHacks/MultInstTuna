const A4 = 440;
const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export function getNoteFromPitch(frequency) {
	const noteNumber = 12 * (Math.log2(frequency / A4)) + 69;
	const rounded = Math.round(noteNumber);
	const noteIndex = (rounded % 12 + 12) % 12;
	const noteName = noteNames[noteIndex];
	const noteFreq = A4 * Math.pow(2, (rounded - 69) / 12);

	return { name: noteName, frequency: noteFreq };
}

export function getCentsDifference(freq, refFreq) {
	return 1200 * Math.log2(freq / refFreq);
}
