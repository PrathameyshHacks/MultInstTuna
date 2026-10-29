import {
	getFrequencyFromNote,
	getNoteFromPitch,
	getCentsDifference,
	getSwaraFromNote,
	getTuningStatus,
} from './noteUtils';

describe('noteUtils mathematical accuracy', () => {
	test('getFrequencyFromNote calculates standard A4 = 440 Hz', () => {
		expect(getFrequencyFromNote('A4', 440)).toBeCloseTo(440, 2);
		expect(getFrequencyFromNote('C4', 440)).toBeCloseTo(261.63, 1);
		expect(getFrequencyFromNote('E2', 440)).toBeCloseTo(82.41, 1);
	});

	test('getFrequencyFromNote with custom A4 = 432 Hz', () => {
		expect(getFrequencyFromNote('A4', 432)).toBeCloseTo(432, 2);
	});

	test('getNoteFromPitch maps frequency accurately', () => {
		const resA4 = getNoteFromPitch(440, 440);
		expect(resA4.name).toBe('A4');
		expect(resA4.cents).toBeCloseTo(0, 1);

		const resCSharp = getNoteFromPitch(138.59, 440);
		expect(resCSharp.name).toBe('C#3');
	});

	test('getCentsDifference returns positive for sharp, negative for flat', () => {
		// Half semitone (50 cents) sharp
		const freqSharp = 440 * Math.pow(2, 50 / 1200);
		expect(getCentsDifference(freqSharp, 440)).toBeCloseTo(50, 0);

		// Half semitone (50 cents) flat
		const freqFlat = 440 * Math.pow(2, -50 / 1200);
		expect(getCentsDifference(freqFlat, 440)).toBeCloseTo(-50, 0);
	});

	test('getSwaraFromNote maps Indian Classical Swaras correctly for tonic C#', () => {
		// When Tonic (Sa) is C#:
		// C# is Sa
		const swaraSa = getSwaraFromNote('C#', 4, 'C#');
		expect(swaraSa.name).toBe('Sa');
		expect(swaraSa.devanagari).toBe('सा');

		// D is komal Re
		const swaraReKomal = getSwaraFromNote('D', 4, 'C#');
		expect(swaraReKomal.name).toBe('komal Re');

		// D# is shuddha Re
		const swaraReShuddha = getSwaraFromNote('D#', 4, 'C#');
		expect(swaraReShuddha.name).toBe('shuddha Re');

		// G# is Pa
		const swaraPa = getSwaraFromNote('G#', 4, 'C#');
		expect(swaraPa.name).toBe('Pa');
		expect(swaraPa.devanagari).toBe('प');
	});

	test('getTuningStatus determines within tolerance', () => {
		expect(getTuningStatus(0, 3.5)).toBe('in-tune');
		expect(getTuningStatus(2.1, 3.5)).toBe('in-tune');
		expect(getTuningStatus(-3.0, 3.5)).toBe('in-tune');
		expect(getTuningStatus(-5.2, 3.5)).toBe('flat');
		expect(getTuningStatus(6.0, 3.5)).toBe('sharp');
	});
});

