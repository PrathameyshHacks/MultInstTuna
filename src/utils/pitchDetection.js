/**
 * Professional-grade Pitch Detection Engine.
 *
 * Implements a hybrid Normalized Square Difference / YIN-inspired pitch extractor
 * with parabolic sub-sample interpolation and transient attack rejection.
 * Optimized for string instruments (Guitar, Violin, Sitar, Tanpura)
 * and Indian percussive instruments (Tabla Dayan, Dagga, Pakhawaj).
 */

export class PitchSmoother {
	constructor(historySize = 5) {
		this.historySize = historySize;
		this.history = [];
		this.smoothedPitch = null;
	}

	add(pitch) {
		if (!pitch || pitch <= 0 || !isFinite(pitch)) {
			return null;
		}

		this.history.push(pitch);
		if (this.history.length > this.historySize) {
			this.history.shift();
		}

		// Calculate median of recent detections to reject wild transient spikes
		const sorted = [...this.history].sort((a, b) => a - b);
		const mid = Math.floor(sorted.length / 2);
		const median = sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;

		// Exponential smoothing for buttery visual stability
		if (this.smoothedPitch === null) {
			this.smoothedPitch = median;
		} else {
			// If median deviates wildly from previous smoothed pitch (new note played), reset smoother
			const ratio = median / this.smoothedPitch;
			if (ratio > 1.08 || ratio < 0.92) {
				this.smoothedPitch = median;
			} else {
				this.smoothedPitch = 0.35 * this.smoothedPitch + 0.65 * median;
			}
		}

		return this.smoothedPitch;
	}

	reset() {
		this.history = [];
		this.smoothedPitch = null;
	}
}

/**
 * Detects fundamental pitch from a time-domain Float32Array buffer.
 *
 * @param {Float32Array} buffer - Time domain audio data
 * @param {number} sampleRate - Context sample rate (e.g. 44100 or 48000)
 * @param {number} minFreq - Lower frequency bound in Hz (default 40 Hz for bass drums/Bayan)
 * @param {number} maxFreq - Upper frequency bound in Hz (default 1800 Hz)
 * @param {number} noiseThreshold - Minimum RMS audio energy to process
 * @param {number} clarityThreshold - Minimum autocorrelation harmonic clarity [0.0 .. 1.0]
 */
export function detectPitch(
	buffer,
	sampleRate = 44100,
	minFreq = 40,
	maxFreq = 1800,
	noiseThreshold = 0.012,
	clarityThreshold = 0.80
) {
	const SIZE = buffer.length;
	if (!SIZE) return null;

	// 1. Calculate RMS energy
	let sumSquares = 0;
	for (let i = 0; i < SIZE; i++) {
		const val = buffer[i];
		sumSquares += val * val;
	}
	const rms = Math.sqrt(sumSquares / SIZE);
	if (rms < noiseThreshold) {
		return null; // Room noise / silence gate
	}

	// 2. Define search window in samples (lags)
	const minLag = Math.max(2, Math.floor(sampleRate / maxFreq));
	const maxLag = Math.min(SIZE - 2, Math.floor(sampleRate / minFreq));

	if (maxLag <= minLag) return null;

	// 3. Precompute cumulative energy for O(1) energy windowing
	const cumsum = new Float32Array(SIZE + 1);
	for (let i = 0; i < SIZE; i++) {
		cumsum[i + 1] = cumsum[i] + buffer[i] * buffer[i];
	}

	// 4. Compute Normalized Autocorrelation
	const rVals = new Float32Array(maxLag + 2);
	let maxVal = -1;
	let bestLag = -1;

	for (let lag = minLag; lag <= maxLag; lag++) {
		let sum = 0;
		const len = SIZE - lag;
		for (let i = 0; i < len; i += 2) {
			// Unroll loop by 2 for faster audio processing
			sum += buffer[i] * buffer[i + lag] + buffer[i + 1] * buffer[i + 1 + lag];
		}
		const energy1 = cumsum[len];
		const energy2 = cumsum[SIZE] - cumsum[lag];
		const norm = Math.sqrt(energy1 * energy2);
		const r = norm > 1e-6 ? sum / norm : 0;
		rVals[lag] = r;

		if (r > maxVal) {
			maxVal = r;
			bestLag = lag;
		}
	}

	// 5. Find the FIRST prominent peak that exceeds clarity threshold
	// (Prevents octave-doubling where harmonic 2 looks stronger than fundamental)
	let detectedLag = -1;
	let peakClarity = 0;

	// Peak detection threshold (adaptive: higher of fixed threshold or 85% of peak)
	const effectiveThreshold = Math.max(clarityThreshold, maxVal * 0.85);

	for (let lag = minLag + 1; lag < maxLag; lag++) {
		if (rVals[lag] >= effectiveThreshold) {
			if (rVals[lag] > rVals[lag - 1] && rVals[lag] >= rVals[lag + 1]) {
				detectedLag = lag;
				peakClarity = rVals[lag];
				break;
			}
		}
	}

	// Fallback to highest peak if it satisfies basic threshold
	if (detectedLag === -1 && maxVal >= clarityThreshold) {
		detectedLag = bestLag;
		peakClarity = maxVal;
	}

	if (detectedLag === -1) {
		return null;
	}

	// 6. High-precision sub-sample interpolation (Parabolic)
	let refinedLag = detectedLag;
	const y1 = rVals[detectedLag - 1] || 0;
	const y2 = rVals[detectedLag];
	const y3 = rVals[detectedLag + 1] || 0;
	const a = (y1 + y3 - 2 * y2) / 2;
	const b = (y3 - y1) / 2;

	if (a < 0) {
		const offset = -b / (2 * a);
		if (Math.abs(offset) <= 1) {
			refinedLag = detectedLag + offset;
		}
	}

	const pitch = sampleRate / refinedLag;
	if (pitch < minFreq || pitch > maxFreq) {
		return null;
	}

	return {
		pitch,
		clarity: Math.min(1.0, Math.max(0.0, peakClarity)),
		rms,
	};
}
