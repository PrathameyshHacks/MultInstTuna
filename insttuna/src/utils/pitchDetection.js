export function detectPitch(buffer, sampleRate = 44100) {
	const SIZE = buffer.length;

	// Compute RMS and check for silence
	let rms = 0;
	for (let i = 0; i < SIZE; i++) {
		const val = buffer[i];
		rms += val * val;
	}
	rms = Math.sqrt(rms / SIZE);
	if (rms < 0.01) return null; // silence or low input

	// Trim buffer to ignore quiet portions
	let r1 = 0, r2 = SIZE - 1, threshold = 0.2;
	for (let i = 0; i < SIZE / 2; i++) {
		if (Math.abs(buffer[i]) < threshold) {
			r1 = i;
			break;
		}
	}
	for (let i = 1; i < SIZE / 2; i++) {
		if (Math.abs(buffer[SIZE - i]) < threshold) {
			r2 = SIZE - i;
			break;
		}
	}
	buffer = buffer.slice(r1, r2);
	const newSize = buffer.length;

	// Autocorrelation
	const c = new Array(newSize).fill(0);
	for (let i = 0; i < newSize; i++) {
		for (let j = 0; j < newSize - i; j++) {
			c[i] += buffer[j] * buffer[j + i];
		}
	}

	// Find the first reasonable dip (skipping zero-lag peak)
	let d = 0;
	while (d < newSize - 1 && c[d] > c[d + 1]) d++;

	// Find peak after that
	let maxval = -1;
	let maxpos = -1;
	for (let i = d; i < newSize; i++) {
		if (c[i] > maxval) {
			maxval = c[i];
			maxpos = i;
		}
	}

	if (maxpos === -1) return null;

	// Optional: Parabolic interpolation for better precision
	const x1 = c[maxpos - 1] || 0;
	const x2 = c[maxpos];
	const x3 = c[maxpos + 1] || 0;

	const a = (x1 + x3 - 2 * x2) / 2;
	const b = (x3 - x1) / 2;

	let T0 = maxpos;
	if (a !== 0) {
		T0 = maxpos - b / (2 * a); // refine estimate
	}

	const pitch = sampleRate / T0;
	if (pitch < 50 || pitch > 2000) return null; // reject out-of-range values

	return pitch;
}
