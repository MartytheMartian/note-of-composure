import { ScaleCategory, type RelativeScaleDefinition } from '../types';

function mod12(value: number): number {
  return ((value % 12) + 12) % 12;
}

function computeStepPattern(intervals: number[]): ('W' | 'H' | 'W+H')[] {
  return intervals.map((interval, i) => {
    const next = i + 1 < intervals.length ? intervals[i + 1] : 12;
    const gap = next - interval;
    if (gap === 1) return 'H';
    if (gap === 2) return 'W';
    return 'W+H';
  });
}

function rotateIntervals(parentIntervals: number[], degreeIndex: number): number[] {
  const n = parentIntervals.length;
  const base = parentIntervals[degreeIndex];
  return Array.from({ length: n }, (_, j) => mod12(parentIntervals[(degreeIndex + j) % n] - base));
}

interface DeriveModesOptions {
  parentIntervals: number[];
  idPrefix: string;
  names: string[];
  category: ScaleCategory;
}

function deriveModes({ parentIntervals, idPrefix, names, category }: DeriveModesOptions): RelativeScaleDefinition[] {
  return names.map((name, degreeIndex) => {
    const intervals = rotateIntervals(parentIntervals, degreeIndex);
    return {
      id: `${idPrefix}-${degreeIndex}`,
      name,
      category,
      intervals,
      stepPattern: computeStepPattern(intervals),
      supportsDiatonicHarmonization: true,
    };
  });
}

const MAJOR_PARENT = [0, 2, 4, 5, 7, 9, 11];
const HARMONIC_MINOR_PARENT = [0, 2, 3, 5, 7, 8, 11];
const MELODIC_MINOR_PARENT = [0, 2, 3, 5, 7, 9, 11];
const HARMONIC_MAJOR_PARENT = [0, 2, 4, 5, 7, 8, 11];

const majorModes = deriveModes({
  parentIntervals: MAJOR_PARENT,
  idPrefix: 'major-mode',
  category: ScaleCategory.MajorFamily,
  names: ['Major (Ionian)', 'Dorian', 'Phrygian', 'Lydian', 'Mixolydian', 'Minor (Aeolian)', 'Locrian'],
});

export const MAJOR_SCALE_ID = majorModes[0].id;
export const MINOR_SCALE_ID = majorModes[5].id;

export function scaleSortPriority(scaleId: string): number {
  if (scaleId === MAJOR_SCALE_ID) return 0;
  if (scaleId === MINOR_SCALE_ID) return 1;
  return 2;
}

const harmonicMinorModes = deriveModes({
  parentIntervals: HARMONIC_MINOR_PARENT,
  idPrefix: 'harmonic-minor-mode',
  category: ScaleCategory.MinorFamily,
  names: [
    'Harmonic Minor',
    'Locrian Natural 6',
    'Ionian Augmented',
    'Dorian #4',
    'Phrygian Dominant',
    'Lydian #2',
    'Super Locrian bb7',
  ],
});

const melodicMinorModes = deriveModes({
  parentIntervals: MELODIC_MINOR_PARENT,
  idPrefix: 'melodic-minor-mode',
  category: ScaleCategory.MinorFamily,
  names: [
    'Melodic Minor',
    'Dorian b2',
    'Lydian Augmented',
    'Lydian Dominant',
    'Mixolydian b6',
    'Locrian Natural 2',
    'Altered Scale (Super Locrian)',
  ],
});

const harmonicMajorModes = deriveModes({
  parentIntervals: HARMONIC_MAJOR_PARENT,
  idPrefix: 'harmonic-major-mode',
  category: ScaleCategory.HarmonicMajorFamily,
  names: [
    'Harmonic Major',
    'Dorian b5',
    'Phrygian b4',
    'Lydian Minor',
    'Mixolydian b2',
    'Lydian Augmented #2',
    'Locrian bb7',
  ],
});

const OTHER_SCALES: RelativeScaleDefinition[] = [
  {
    id: 'major-pentatonic',
    name: 'Major Pentatonic',
    category: ScaleCategory.Pentatonic,
    intervals: [0, 2, 4, 7, 9],
    degreeLetterSteps: [0, 1, 2, 4, 5],
    stepPattern: computeStepPattern([0, 2, 4, 7, 9]),
    supportsDiatonicHarmonization: false,
  },
  {
    id: 'minor-pentatonic',
    name: 'Minor Pentatonic',
    category: ScaleCategory.Pentatonic,
    intervals: [0, 3, 5, 7, 10],
    degreeLetterSteps: [0, 2, 3, 4, 6],
    stepPattern: computeStepPattern([0, 3, 5, 7, 10]),
    supportsDiatonicHarmonization: false,
  },
  {
    id: 'blues',
    name: 'Blues',
    category: ScaleCategory.Blues,
    intervals: [0, 3, 5, 6, 7, 10],
    degreeLetterSteps: [0, 2, 3, 3, 4, 6],
    stepPattern: computeStepPattern([0, 3, 5, 6, 7, 10]),
    supportsDiatonicHarmonization: false,
  },
  {
    id: 'whole-tone',
    name: 'Whole Tone',
    category: ScaleCategory.Symmetric,
    intervals: [0, 2, 4, 6, 8, 10],
    degreeLetterSteps: [0, 1, 2, 3, 4, 5],
    stepPattern: computeStepPattern([0, 2, 4, 6, 8, 10]),
    supportsDiatonicHarmonization: false,
  },
  {
    id: 'diminished-whole-half',
    name: 'Diminished (Whole-Half)',
    category: ScaleCategory.Symmetric,
    intervals: [0, 2, 3, 5, 6, 8, 9, 11],
    degreeLetterSteps: [0, 1, 2, 3, 4, 5, 5, 6],
    stepPattern: computeStepPattern([0, 2, 3, 5, 6, 8, 9, 11]),
    supportsDiatonicHarmonization: false,
  },
  {
    id: 'diminished-half-whole',
    name: 'Diminished (Half-Whole)',
    category: ScaleCategory.Symmetric,
    intervals: [0, 1, 3, 4, 6, 7, 9, 10],
    degreeLetterSteps: [0, 1, 1, 2, 3, 4, 5, 6],
    stepPattern: computeStepPattern([0, 1, 3, 4, 6, 7, 9, 10]),
    supportsDiatonicHarmonization: false,
  },
  {
    id: 'bebop-dominant',
    name: 'Bebop Dominant',
    category: ScaleCategory.Bebop,
    intervals: [0, 2, 4, 5, 7, 9, 10, 11],
    degreeLetterSteps: [0, 1, 2, 3, 4, 5, 6, 6],
    stepPattern: computeStepPattern([0, 2, 4, 5, 7, 9, 10, 11]),
    supportsDiatonicHarmonization: false,
  },
  {
    id: 'bebop-major',
    name: 'Bebop Major',
    category: ScaleCategory.Bebop,
    intervals: [0, 2, 4, 5, 7, 8, 9, 11],
    degreeLetterSteps: [0, 1, 2, 3, 4, 4, 5, 6],
    stepPattern: computeStepPattern([0, 2, 4, 5, 7, 8, 9, 11]),
    supportsDiatonicHarmonization: false,
  },
];

export const RELATIVE_SCALES: RelativeScaleDefinition[] = [
  ...majorModes,
  ...harmonicMinorModes,
  ...melodicMinorModes,
  ...harmonicMajorModes,
  ...OTHER_SCALES,
];
