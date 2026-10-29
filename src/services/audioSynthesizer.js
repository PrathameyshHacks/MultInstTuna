/**
 * Web Audio API Reference Tone Synthesizer.
 * Generates continuous or timed reference pitch tones for ear-tuning,
 * vocal warmup, and acoustic instrument pitch calibration.
 */

class AudioSynthesizer {
	constructor() {
		this.audioCtx = null;
		this.oscillator = null;
		this.gainNode = null;
		this.harmonicNodes = [];
		this.isPlaying = false;
		this.currentFrequency = 440;
		this.currentWaveform = 'sine';
		this.volume = 0.25;
	}

	getAudioContext() {
		if (!this.audioCtx || this.audioCtx.state === 'closed') {
			const AudioContextClass = window.AudioContext || window.webkitAudioContext;
			this.audioCtx = new AudioContextClass();
		}
		if (this.audioCtx.state === 'suspended') {
			this.audioCtx.resume().catch(() => {});
		}
		return this.audioCtx;
	}

	start(frequency = 440, waveform = 'sine', volume = 0.25) {
		this.stop();

		const ctx = this.getAudioContext();
		const now = ctx.currentTime;
		this.currentFrequency = frequency;
		this.currentWaveform = waveform;
		this.volume = volume;

		// Master gain with smooth attack to prevent pop
		this.gainNode = ctx.createGain();
		this.gainNode.gain.setValueAtTime(0.0001, now);
		this.gainNode.gain.exponentialRampToValueAtTime(Math.max(0.0001, volume), now + 0.05);
		this.gainNode.connect(ctx.destination);

		if (waveform === 'drone') {
			// Indian Classical Tanpura-style rich acoustic drone
			// Stacks fundamental + 2nd harmonic + 3rd harmonic (Pancham) + subtle detuning
			const harmonics = [
				{ mult: 1, gain: 0.6 },
				{ mult: 2, gain: 0.3 },
				{ mult: 3, gain: 0.15 },
				{ mult: 4, gain: 0.08 },
			];

			this.harmonicNodes = harmonics.map((h) => {
				const osc = ctx.createOscillator();
				const hGain = ctx.createGain();
				osc.type = 'triangle';
				osc.frequency.setValueAtTime(frequency * h.mult, now);
				hGain.gain.setValueAtTime(h.gain, now);

				osc.connect(hGain);
				hGain.connect(this.gainNode);
				osc.start(now);
				return osc;
			});
		} else {
			// Standard waveforms (sine, triangle, sawtooth)
			this.oscillator = ctx.createOscillator();
			this.oscillator.type = waveform;
			this.oscillator.frequency.setValueAtTime(frequency, now);
			this.oscillator.connect(this.gainNode);
			this.oscillator.start(now);
		}

		this.isPlaying = true;
	}

	setFrequency(frequency) {
		if (!this.isPlaying || !this.audioCtx) return;
		this.currentFrequency = frequency;
		const now = this.audioCtx.currentTime;

		if (this.oscillator) {
			this.oscillator.frequency.cancelScheduledValues(now);
			this.oscillator.frequency.linearRampToValueAtTime(frequency, now + 0.04);
		}

		if (this.harmonicNodes.length > 0) {
			const mults = [1, 2, 3, 4];
			this.harmonicNodes.forEach((osc, idx) => {
				const m = mults[idx] || 1;
				osc.frequency.cancelScheduledValues(now);
				osc.frequency.linearRampToValueAtTime(frequency * m, now + 0.04);
			});
		}
	}

	setVolume(volume) {
		this.volume = volume;
		if (this.gainNode && this.audioCtx) {
			const now = this.audioCtx.currentTime;
			this.gainNode.gain.cancelScheduledValues(now);
			this.gainNode.gain.linearRampToValueAtTime(Math.max(0.0001, volume), now + 0.03);
		}
	}

	stop() {
		if (!this.isPlaying) return;

		if (this.gainNode && this.audioCtx) {
			const now = this.audioCtx.currentTime;
			this.gainNode.gain.cancelScheduledValues(now);
			// Smooth fade out
			this.gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

			setTimeout(() => {
				if (this.oscillator) {
					try {
						this.oscillator.stop();
						this.oscillator.disconnect();
					} catch (e) {}
					this.oscillator = null;
				}
				if (this.harmonicNodes.length > 0) {
					this.harmonicNodes.forEach((node) => {
						try {
							node.stop();
							node.disconnect();
						} catch (e) {}
					});
					this.harmonicNodes = [];
				}
			}, 60);
		}

		this.isPlaying = false;
	}
}

export const toneSynth = new AudioSynthesizer();
export default toneSynth;

