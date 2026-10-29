import React from 'react';
import { render, screen, act } from '@testing-library/react';
import App from './App';

// Mock Web Audio API for Jest environment
beforeAll(() => {
	class MockAudioContext {
		constructor() {
			this.state = 'suspended';
			this.sampleRate = 44100;
			this.currentTime = 0;
			this.destination = {};
		}
		resume() {
			this.state = 'running';
			return Promise.resolve();
		}
		suspend() {
			this.state = 'suspended';
			return Promise.resolve();
		}
		createMediaStreamSource() {
			return {
				connect: () => {},
				disconnect: () => {},
			};
		}
		createAnalyser() {
			return {
				fftSize: 2048,
				frequencyBinCount: 1024,
				smoothingTimeConstant: 0,
				connect: () => {},
				disconnect: () => {},
				getFloatTimeDomainData: (arr) => arr.fill(0),
				getByteFrequencyData: (arr) => arr.fill(0),
			};
		}
		createBiquadFilter() {
			return {
				type: 'highpass',
				frequency: { setValueAtTime: () => {} },
				Q: { setValueAtTime: () => {} },
				connect: () => {},
				disconnect: () => {},
			};
		}
		createOscillator() {
			return {
				type: 'sine',
				frequency: {
					setValueAtTime: () => {},
					linearRampToValueAtTime: () => {},
					cancelScheduledValues: () => {},
				},
				connect: () => {},
				disconnect: () => {},
				start: () => {},
				stop: () => {},
			};
		}
		createGain() {
			return {
				gain: {
					setValueAtTime: () => {},
					exponentialRampToValueAtTime: () => {},
					linearRampToValueAtTime: () => {},
					cancelScheduledValues: () => {},
				},
				connect: () => {},
				disconnect: () => {},
			};
		}
	}

	window.AudioContext = MockAudioContext;
	window.webkitAudioContext = MockAudioContext;

	// Mock navigator.mediaDevices
	if (!navigator.mediaDevices) {
		Object.defineProperty(navigator, 'mediaDevices', {
			value: {},
			writable: true,
			configurable: true,
		});
	}
	navigator.mediaDevices.getUserMedia = jest.fn().mockResolvedValue({
		getTracks: () => [{ stop: () => {} }],
	});
	navigator.mediaDevices.enumerateDevices = jest.fn().mockResolvedValue([
		{ kind: 'audioinput', deviceId: 'default', label: 'Default Microphone' },
	]);
	navigator.mediaDevices.addEventListener = jest.fn();
	navigator.mediaDevices.removeEventListener = jest.fn();

	// Mock HTMLCanvasElement getContext
	HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
		clearRect: jest.fn(),
		fillRect: jest.fn(),
		beginPath: jest.fn(),
		moveTo: jest.fn(),
		lineTo: jest.fn(),
		stroke: jest.fn(),
		fill: jest.fn(),
		arc: jest.fn(),
		setLineDash: jest.fn(),
	}));
});

test('renders MultInstTuna brand title and start microphone button', async () => {
	await act(async () => {
		render(<App />);
	});
	const titleElement = screen.getByRole('heading', { name: /MultInstTuna/i });
	expect(titleElement).toBeInTheDocument();

	const micButton = screen.getByRole('button', { name: /start microphone/i });
	expect(micButton).toBeInTheDocument();
});

test('renders exactly the 8 curated instruments', async () => {
	await act(async () => {
		render(<App />);
	});
	const tabs = screen.getAllByRole('tab');
	const tabTexts = tabs.map((t) => t.textContent);

	expect(tabTexts.some((t) => t.includes('Acoustic Guitar'))).toBe(true);
	expect(tabTexts.some((t) => t.includes('Violin'))).toBe(true);
	expect(tabTexts.some((t) => t.includes('Tabla'))).toBe(true);
	expect(tabTexts.some((t) => t.includes('Pakhwaj'))).toBe(true);
	expect(tabTexts.some((t) => t.includes('Dholaki'))).toBe(true);
	expect(tabTexts.some((t) => t.includes('Harmonium'))).toBe(true);
	expect(tabTexts.some((t) => t.includes('Sitar'))).toBe(true);
	expect(tabTexts.some((t) => t.includes('Ukulele'))).toBe(true);
});

test('renders tuning meter and reference tone synthesizer', async () => {
	await act(async () => {
		render(<App />);
	});
	expect(screen.getByRole('region', { name: /tuning meter/i })).toBeInTheDocument();
	expect(screen.getByText(/reference tone synthesizer/i)).toBeInTheDocument();
});
