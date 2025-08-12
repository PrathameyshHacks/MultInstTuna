export function detectPitch(buffer, sampleRate = 44100) {
    const SIZE = buffer.length;

    let rms = 0;
    for (let i = 0; i < SIZE; i++) {
        rms += buffer[i] * buffer[i];
    }
    rms = Math.sqrt(rms / SIZE);
    if (rms < 0.001) return null;

    const maxAmp = Math.max(...buffer.map(Math.abs));
    if (maxAmp > 0) {
        buffer = buffer.map((v) => v / maxAmp);
    }

    for (let i = 0; i < buffer.length; i++) {
        buffer[i] *= 0.5 * (1 - Math.cos((2 * Math.PI * i) / (buffer.length - 1)));
    }

    const c = new Array(SIZE).fill(0);
    for (let i = 0; i < SIZE; i++) {
        for (let j = 0; j < SIZE - i; j++) {
            c[i] += buffer[j] * buffer[j + i];
        }
    }

    let d = 0;
    while (d < SIZE - 1 && c[d] > c[d + 1]) d++;

    let maxval = -1;
    let maxpos = -1;
    for (let i = d; i < SIZE; i++) {
        if (c[i] > maxval) {
            maxval = c[i];
            maxpos = i;
        }
    }

    if (maxpos === -1) return null;

    const x1 = c[maxpos - 1] || 0;
    const x2 = c[maxpos];
    const x3 = c[maxpos + 1] || 0;

    const a = (x1 + x3 - 2 * x2) / 2;
    const b = (x3 - x1) / 2;

    let T0 = maxpos;
    if (a !== 0) {
        T0 = maxpos - b / (2 * a);
    }

    const pitch = sampleRate / T0;
    if (pitch < 50 || pitch > 2000) return null;

    return pitch;
}
