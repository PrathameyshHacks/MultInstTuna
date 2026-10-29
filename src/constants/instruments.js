/**
 * Curated instrument definitions and tuning presets.
 * Exclusively supports: Acoustic Guitar, Violin, Tabla, Pakhawaj, Dholaki, Harmonium, Sitar & Ukulele.
 */

export const INSTRUMENTS = [
	{
		id: 'guitar',
		name: 'Acoustic Guitar',
		icon: '🎸',
		type: 'string',
		description: 'Standard and popular alternate tunings for 6-string acoustic guitar.',
		presets: [
			{
				id: 'guitar-standard',
				name: 'Standard (E-A-D-G-B-E)',
				strings: ['E2', 'A2', 'D3', 'G3', 'B3', 'E4'],
				labels: ['6th (E2)', '5th (A2)', '4th (D3)', '3rd (G3)', '2nd (B3)', '1st (E4)'],
			},
			{
				id: 'guitar-drop-d',
				name: 'Drop D (D-A-D-G-B-E)',
				strings: ['D2', 'A2', 'D3', 'G3', 'B3', 'E4'],
				labels: ['6th (D2)', '5th (A2)', '4th (D3)', '3rd (G3)', '2nd (B3)', '1st (E4)'],
			},
			{
				id: 'guitar-dadgad',
				name: 'DADGAD (Celtic / Fingerstyle)',
				strings: ['D2', 'A2', 'D3', 'G3', 'A3', 'D4'],
				labels: ['6th (D2)', '5th (A2)', '4th (D3)', '3rd (G3)', '2nd (A3)', '1st (D4)'],
			},
			{
				id: 'guitar-open-d',
				name: 'Open D (D-A-D-F#-A-D)',
				strings: ['D2', 'A2', 'D3', 'F#3', 'A3', 'D4'],
				labels: ['6th (D2)', '5th (A2)', '4th (D3)', '3rd (F#3)', '2nd (A3)', '1st (D4)'],
			},
			{
				id: 'guitar-open-g',
				name: 'Open G (D-G-D-G-B-D)',
				strings: ['D2', 'G2', 'D3', 'G3', 'B3', 'D4'],
				labels: ['6th (D2)', '5th (G2)', '4th (D3)', '3rd (G3)', '2nd (B3)', '1st (D4)'],
			},
			{
				id: 'guitar-half-step-down',
				name: 'Half Step Down (Eb-Ab-Db-Gb-Bb-Eb)',
				strings: ['D#2', 'G#2', 'C#3', 'F#3', 'A#3', 'D#4'],
				labels: ['6th (Eb2)', '5th (Ab2)', '4th (Db3)', '3rd (Gb3)', '2nd (Bb3)', '1st (Eb4)'],
			},
		],
	},
	{
		id: 'violin',
		name: 'Violin',
		icon: '🎻',
		type: 'string',
		description: 'Standard orchestral and Indian classical violin tunings.',
		presets: [
			{
				id: 'violin-western',
				name: 'Standard Orchestral (G-D-A-E)',
				strings: ['G3', 'D4', 'A4', 'E5'],
				labels: ['4th (G3)', '3rd (D4)', '2nd (A4)', '1st (E5)'],
			},
			{
				id: 'violin-carnatic-csharp',
				name: 'Indian Classical (Pa-Sa-Pa-Sa in C#)',
				strings: ['G#3', 'C#4', 'G#4', 'C#5'],
				labels: ['Mandra Pa (G#3)', 'Madhya Sa (C#4)', 'Madhya Pa (G#4)', 'Taar Sa (C#5)'],
			},
			{
				id: 'violin-carnatic-d',
				name: 'Indian Classical (Pa-Sa-Pa-Sa in D)',
				strings: ['A3', 'D4', 'A4', 'D5'],
				labels: ['Mandra Pa (A3)', 'Madhya Sa (D4)', 'Madhya Pa (A4)', 'Taar Sa (D5)'],
			},
		],
	},
	{
		id: 'tabla',
		name: 'Tabla',
		icon: '🪘',
		type: 'indian-percussion',
		description: 'Fine-tune Dayan rim & syahi and Dagga/Bayan bass pitch.',
		tonics: ['C', 'C#', 'D', 'D#', 'E', 'B'],
		defaultTonic: 'C#',
		presets: [
			{
				id: 'tabla-csharp',
				name: 'C# Dayan (Pehli Kali - Standard)',
				tonic: 'C#',
				parts: [
					{ name: 'Dayan (Tonic Sa)', note: 'C#4', octave: 4, desc: 'Chanti / Kinar / Sur' },
					{ name: 'Dayan (Lower Octave Sa)', note: 'C#3', octave: 3, desc: 'Large Dayan fundamental' },
					{ name: 'Dagga/Bayan (Bass Pa)', note: 'G#2', octave: 2, desc: 'Bass modulation' },
					{ name: 'Dagga/Bayan (Bass Sa)', note: 'C#2', octave: 2, desc: 'Bass fundamental' },
				],
			},
			{
				id: 'tabla-d',
				name: 'D Dayan (2nd White)',
				tonic: 'D',
				parts: [
					{ name: 'Dayan (Tonic Sa)', note: 'D4', octave: 4, desc: 'Chanti / Kinar' },
					{ name: 'Dagga/Bayan (Bass Pa)', note: 'A2', octave: 2, desc: 'Bass tone' },
					{ name: 'Dagga/Bayan (Bass Sa)', note: 'D2', octave: 2, desc: 'Bass resonance' },
				],
			},
			{
				id: 'tabla-dsharp',
				name: 'D# Dayan (Dusri Kali)',
				tonic: 'D#',
				parts: [
					{ name: 'Dayan (Tonic Sa)', note: 'D#4', octave: 4, desc: 'Chanti / Kinar' },
					{ name: 'Dagga/Bayan (Bass Pa)', note: 'A#2', octave: 2, desc: 'Bass tone' },
				],
			},
			{
				id: 'tabla-c',
				name: 'C Dayan (1st White / Safed 1)',
				tonic: 'C',
				parts: [
					{ name: 'Dayan (Tonic Sa)', note: 'C4', octave: 4, desc: 'Chanti / Kinar' },
					{ name: 'Dagga/Bayan (Bass Pa)', note: 'G2', octave: 2, desc: 'Bass tone' },
				],
			},
			{
				id: 'tabla-b',
				name: 'B Dayan (Mandra / Low)',
				tonic: 'B',
				parts: [
					{ name: 'Dayan (Tonic Sa)', note: 'B3', octave: 3, desc: 'Heavy / large Dayan' },
					{ name: 'Dagga/Bayan (Bass Pa)', note: 'F#2', octave: 2, desc: 'Bass tone' },
				],
			},
		],
	},
	{
		id: 'pakhawaj',
		name: 'Pakhwaj',
		icon: '🥁',
		type: 'indian-percussion',
		description: 'Dhrupad barrel drum tuning for Dayan (treble) and Kharaj (dough bass).',
		tonics: ['G', 'G#', 'A', 'A#', 'B', 'C'],
		defaultTonic: 'A',
		presets: [
			{
				id: 'pakhawaj-a',
				name: 'A Pakhwaj (Dhrupad Standard)',
				tonic: 'A',
				parts: [
					{ name: 'Dayan (Treble Sa)', note: 'A3', octave: 3, desc: 'Syahi / Chanti' },
					{ name: 'Kharaj (Bass Sa)', note: 'A1', octave: 1, desc: 'Flour/dough coated bass' },
					{ name: 'Kharaj (Bass Pa)', note: 'E2', octave: 2, desc: 'Bass overtone resonance' },
				],
			},
			{
				id: 'pakhawaj-gsharp',
				name: 'G# Pakhwaj (Deep Tuning)',
				tonic: 'G#',
				parts: [
					{ name: 'Dayan (Treble Sa)', note: 'G#3', octave: 3, desc: 'Syahi / Chanti' },
					{ name: 'Kharaj (Bass Sa)', note: 'G#1', octave: 1, desc: 'Deep bass flour head' },
				],
			},
			{
				id: 'pakhawaj-b',
				name: 'B Pakhwaj (Crisp High)',
				tonic: 'B',
				parts: [
					{ name: 'Dayan (Treble Sa)', note: 'B3', octave: 3, desc: 'Syahi / Chanti' },
					{ name: 'Kharaj (Bass Sa)', note: 'B1', octave: 1, desc: 'Deep bass flour head' },
				],
			},
		],
	},
	{
		id: 'dholki',
		name: 'Dholaki',
		icon: '🪘',
		type: 'indian-percussion',
		description: 'Dual-headed folk and devotional Indian drum.',
		defaultTonic: 'C#',
		presets: [
			{
				id: 'dholki-standard',
				name: 'Standard Tuning (C#)',
				tonic: 'C#',
				parts: [
					{ name: 'Mada / Kinar (Treble)', note: 'C#4', octave: 4, desc: 'High crisp rim sound' },
					{ name: 'Dha / Bass (Bayi)', note: 'G#2', octave: 2, desc: 'Deep dholaki bass' },
				],
			},
			{
				id: 'dholki-d',
				name: 'High Tuning (D)',
				tonic: 'D',
				parts: [
					{ name: 'Mada / Kinar (Treble)', note: 'D4', octave: 4, desc: 'High crisp rim sound' },
					{ name: 'Dha / Bass (Bayi)', note: 'A2', octave: 2, desc: 'Dholaki bass resonance' },
				],
			},
		],
	},
	{
		id: 'harmonium',
		name: 'Harmonium',
		icon: '🎹',
		type: 'keys',
		description: 'Free-reed keyboard standard across Indian classical vocal and devotional music.',
		tonics: ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'],
		defaultTonic: 'C#',
		presets: [
			{
				id: 'harmonium-sur-csharp',
				name: 'C# Pehli Kali (Male Vocal standard)',
				tonic: 'C#',
				parts: [
					{ name: 'Mandra Sa', note: 'C#3', octave: 3, desc: 'Lower octave anchor' },
					{ name: 'Madhya Sa (Tonic)', note: 'C#4', octave: 4, desc: 'Middle octave Sa' },
					{ name: 'Madhya Pa', note: 'G#4', octave: 4, desc: 'Middle octave Pa' },
					{ name: 'Taar Sa', note: 'C#5', octave: 5, desc: 'Upper octave Sa' },
				],
			},
			{
				id: 'harmonium-sur-gsharp',
				name: 'G# Chauthi Kali (Female Vocal standard)',
				tonic: 'G#',
				parts: [
					{ name: 'Mandra Sa', note: 'G#3', octave: 3, desc: 'Lower octave anchor' },
					{ name: 'Madhya Sa (Tonic)', note: 'G#4', octave: 4, desc: 'Middle octave Sa' },
					{ name: 'Madhya Pa', note: 'D#5', octave: 5, desc: 'Middle octave Pa' },
					{ name: 'Taar Sa', note: 'G#5', octave: 5, desc: 'Upper octave Sa' },
				],
			},
		],
	},
	{
		id: 'sitar',
		name: 'Sitar',
		icon: '🪕',
		type: 'string',
		description: 'Long-necked Indian lute with melody, jod, and chikari strings.',
		defaultTonic: 'C#',
		presets: [
			{
				id: 'sitar-ravi-shankar',
				name: 'Kharaj Pancham (Ravi Shankar Style)',
				tonic: 'C#',
				strings: ['F#3', 'C#3', 'G#2', 'C#2', 'G#3', 'C#4', 'C#4'],
				labels: [
					'1st: Baj (Ma F#3)',
					'2nd: Jod (Sa C#3)',
					'3rd: Pancham (Pa G#2)',
					'4th: Kharaj (Sa C#2)',
					'5th: Pa Chikari (G#3)',
					'6th: Sa Chikari (C#4)',
					'7th: High Sa (C#4)',
				],
			},
			{
				id: 'sitar-vilayat-khan',
				name: 'Gandhar Pancham (Vilayat Khan Style)',
				tonic: 'C#',
				strings: ['F#3', 'C#3', 'G#2', 'C#2', 'F3', 'C#4'],
				labels: [
					'1st: Baj (Ma F#3)',
					'2nd: Jod (Sa C#3)',
					'3rd: Pancham (Pa G#2)',
					'4th: Kharaj (Sa C#2)',
					'5th: Ga Chikari (F3)',
					'6th: Sa Chikari (C#4)',
				],
			},
		],
	},
	{
		id: 'ukulele',
		name: 'Ukulele',
		icon: '🪕',
		type: 'string',
		description: 'Standard 4-string Hawaiian ukulele tunings.',
		presets: [
			{
				id: 'ukulele-standard',
				name: 'Standard High G (G-C-E-A)',
				strings: ['G4', 'C4', 'E4', 'A4'],
				labels: ['4th (G4)', '3rd (C4)', '2nd (E4)', '1st (A4)'],
			},
			{
				id: 'ukulele-low-g',
				name: 'Low G Tuning (G-C-E-A)',
				strings: ['G3', 'C4', 'E4', 'A4'],
				labels: ['4th (G3 Low)', '3rd (C4)', '2nd (E4)', '1st (A4)'],
			},
			{
				id: 'ukulele-baritone',
				name: 'Baritone (D-G-B-E)',
				strings: ['D3', 'G3', 'B3', 'E4'],
				labels: ['4th (D3)', '3rd (G3)', '2nd (B3)', '1st (E4)'],
			},
		],
	},
];
