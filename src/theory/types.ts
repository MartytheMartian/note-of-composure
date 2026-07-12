export type Letter = 'C' | 'D' | 'E' | 'F' | 'G' | 'A' | 'B';

export type Accidental = -2 | -1 | 0 | 1 | 2;

export interface NoteSpelling {
  letter: Letter;
  accidental: Accidental;
}

export type PitchClass = number;

export const ScaleCategory = {
  MajorFamily: 'Major Family',
  MinorFamily: 'Minor Family',
  HarmonicMajorFamily: 'Harmonic Major Family',
  Pentatonic: 'Pentatonic',
  Blues: 'Blues',
  Symmetric: 'Symmetric',
  Bebop: 'Bebop',
  Other: 'Other',
} as const;
export type ScaleCategory = (typeof ScaleCategory)[keyof typeof ScaleCategory];

export const ChordCategory = {
  Triad: 'Triad',
  Sixth: 'Sixth',
  Seventh: 'Seventh',
  Sus: 'Sus',
  Add: 'Add',
  Extended: 'Extended',
  Altered: 'Altered',
} as const;
export type ChordCategory = (typeof ChordCategory)[keyof typeof ChordCategory];

export interface RelativeScaleDefinition {
  id: string;
  name: string;
  category: ScaleCategory;
  intervals: number[];
  stepPattern: ('W' | 'H' | 'W+H')[];
  degreeLetterSteps?: number[];
  supportsDiatonicHarmonization: boolean;
}

export interface RelativeChordDefinition {
  id: string;
  name: string;
  symbol: string;
  category: ChordCategory;
  intervals: number[];
  degreeLabels: string[];
  degreeLetterSteps: number[];
}

export interface RootDefinition {
  pitchClass: PitchClass;
  spellings: NoteSpelling[];
}

export interface MusicLibrary {
  roots: RootDefinition[];
  relativeScales: RelativeScaleDefinition[];
  relativeChords: RelativeChordDefinition[];
}

export interface AbsoluteNote {
  spelling: NoteSpelling;
  pitchClass: PitchClass;
  degreeLabel: string;
}

export interface AbsoluteScale {
  scaleId: string;
  name: string;
  root: NoteSpelling;
  notes: AbsoluteNote[];
  supportsDiatonicHarmonization: boolean;
}

export interface AbsoluteChord {
  chordId: string;
  name: string;
  symbol: string;
  root: NoteSpelling;
  notes: AbsoluteNote[];
}
