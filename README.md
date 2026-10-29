# 🎶 MultInstTuna

> Professional Multi-Instrument & Indian Classical Tuner (React + PWA)

**MultInstTuna** is a high-precision, production-grade Progressive Web Application (PWA) designed for musicians to tune acoustic instruments in real-time. It features dedicated tuning engines for **Western strings** (Guitar, Bass, Violin, Viola, Cello, Ukulele, Banjo, Mandolin) and **Indian classical instruments** (Tabla, Pakhawaj, Tanpura, Sitar, Harmonium, Dholki, Mridangam, Bansuri), alongside a universal chromatic tuner.

---

## ✨ Features

- **High-Precision Pitch Detection**:
  - Hybrid Normalized Autocorrelation with sub-sample Parabolic Interpolation ($< 0.1\text{ cent}$ resolution).
  - Percussive transient attack rejection and circular median filtering for stable note detection on acoustic drums and plucked strings.
  - Subsonic 35 Hz high-pass biquad filter removing room rumble and AC hum.
- **Dedicated Indian Classical Support**:
  - **Sargam & Shruti Alignment**: Real-time conversion to Indian Swaras (सा, रे॒, रे, ग॒, ग, म, म॑, प, ध॒, ध, नि॒, नि) with Saptak identification (Mandra, Madhya, Taar).
  - **Customizable Tonic (Sa)**: Selectable Sa from C through B (Pehli Kali C#, Dusri Kali D#, Tisri Kali F#, etc.).
  - **Tabla / Pakhawaj Gajra Rim Tension Balancer**: Interactive 8-point circular rim balancer to check and equalize drum rim tension with hammer guidance.
  - **Acoustic Tanpura Drone**: Built-in harmonic synthesizer generating continuous rich drone overtones for any selected tonic.
- **Advanced Western String Tuner**:
  - Support for Guitar (Standard, Drop D, DADGAD, Open D, Open G, Half Step Down), 4 & 5-String Bass, Violin (Standard & Carnatic), Viola, Cello, and Ukuleles.
  - Auto-detection mode and targeted single-string lock mode.
- **Interactive Pro-Audio Tuning Meter**:
  - SVG Curved Analog Gauge with physics damping and center zero lock.
  - Digital Strobe 21-LED array for visual strobe tuning.
  - Frequency display (precise to 0.1 Hz) and cents deviation display ($-50\text{ to }+50\text{ cents}$).
  - Signal clarity confidence meter.
- **Reference Tone Synthesizer**:
  - Sine, Triangle, Tanpura Drone, and Sawtooth waveforms across octaves 1 through 6.
  - One-tap audio reference playback for individual string pills.
- **Pitch Stability & Note History Graph**:
  - Live canvas graph displaying pitch drift and vibrato sustain curve over time.
  - History strip listing recent distinct notes tuned.
- **Live Audio Visualizer**:
  - Real-time Oscilloscope (time-domain waveform) and 64-band FFT Spectrum analyzer.
- **Concert Pitch Calibration & Audio Settings**:
  - Adjustable A4 reference frequency ($415\text{ to }466\text{ Hz}$) with presets for 440 Hz Standard, 432 Hz Verdi, 442 Hz European, and 415 Hz Baroque.
  - Input microphone device enumeration and selection for USB audio interfaces.
  - Noise gate threshold slider and strict/standard/relaxed tuning tolerance settings.
  - Accidental preference (Sharps ♯ vs. Flats ♭).
- **PWA & Mobile Ready**:
  - Offline caching via Stale-While-Revalidate Service Worker.
  - Automatic Mobile Screen WakeLock preventing display dimming during active sessions.
  - Responsive design, dark mode default, and touch targets exceeding 48px.
  - Keyboard accessibility (Press <kbd>Space</kbd> to toggle microphone).

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- npm

### Installation

```bash
git clone https://github.com/your-username/insttuna.git
cd insttuna
npm install
```

### Development Server

```bash
npm start
```
Open [http://localhost:3000](http://localhost:3000) to view the application in your browser.

### Production Build

```bash
npm run build
```
Creates an optimized, production-ready PWA bundle in the `build/` directory.

### Running Tests

```bash
npm test -- --watchAll=false
```

---

## 📁 Architecture & Folder Structure

```
src/
├── components/
│   ├── AudioVisualizer.js          # Live waveform & FFT spectrum canvas
│   ├── CalibrationModal.js         # A4 calibration, mic device, noise gate modal
│   ├── Header.js                   # Header, PWA install prompt, theme toggle
│   ├── HistoryGraph.js             # Real-time pitch stability curve & note history
│   ├── IndianClassicalPanel.js     # Swara display, Tabla Gajra balancer & drone
│   ├── InstrumentSelector.js       # Categorized instruments & presets
│   ├── ReferenceToneGenerator.js   # Multi-waveform audio tone synthesizer
│   ├── StringSelector.js           # Target string / drum part selector
│   └── TuningMeter.js              # High-resolution analog needle & strobe meter
├── constants/
│   ├── instruments.js              # Instrument definitions and tuning presets
│   └── notes.js                    # Note names, A4 bounds, Swara mappings
├── hooks/
│   ├── useMicrophone.js            # AudioContext & device selection hook
│   ├── usePitchDetection.js        # Optimized detection loop with median filter
│   └── useWakeLock.js              # Mobile screen wake lock with tab re-acquisition
├── services/
│   └── audioSynthesizer.js         # Web Audio API tone synthesis engine
├── utils/
│   ├── noteUtils.js                # Note, frequency, cents, and Swara math
│   ├── pitchDetection.js           # Hybrid autocorrelation & parabolic interpolation
│   └── serviceWorkerRegistration.js# PWA service worker registration
├── App.js                          # Root application orchestrator
├── App.css                         # Polished responsive pro-audio styling
├── index.js                        # Entry point
└── index.css                       # Base resets
```

---

## 🔒 Security & Permissions

Microphone input capture requires either:
1. `https://` secure context on mobile or remote devices, or
2. `http://localhost` / `http://127.0.0.1` during local development.

---

## 📄 License

MIT
