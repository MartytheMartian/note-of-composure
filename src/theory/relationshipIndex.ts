import { getAbsoluteChord, getAbsoluteScale } from './absolute';
import { RELATIVE_CHORDS } from './data/chordTypes';
import { RELATIVE_SCALES } from './data/scaleTypes';
import { diatonicHarmonization } from './harmonize';
import { mod, ROOTS } from './notes';
import { isSubset, toBitmask } from './subsetMatch';
import type { PitchClass } from './types';

export interface ScaleChordRelationship {
  chordId: string;
  chordRootPitchClass: PitchClass;
  isDiatonic: boolean;
  diatonicDegreeIndex?: number;
  isSeventhChord: boolean;
}

export interface ChordScaleRelationship {
  scaleId: string;
  scaleRootPitchClass: PitchClass;
  isDiatonic: boolean;
  diatonicDegreeIndex?: number;
}

interface ScaleInstance {
  scaleId: string;
  rootPitchClass: PitchClass;
  mask: number;
  diatonicTriadTags: Map<string, number>;
  diatonicSeventhTags: Map<string, number>;
}

interface ChordInstance {
  chordId: string;
  rootPitchClass: PitchClass;
  mask: number;
}

let scaleInstances: ScaleInstance[] | undefined;
let chordInstances: ChordInstance[] | undefined;

function buildIndex(): { scales: ScaleInstance[]; chords: ChordInstance[] } {
  if (scaleInstances && chordInstances) {
    return { scales: scaleInstances, chords: chordInstances };
  }

  scaleInstances = RELATIVE_SCALES.flatMap((scaleType) => {
    const harmonization = diatonicHarmonization(scaleType);

    return Array.from({ length: 12 }, (_, rootPitchClass): ScaleInstance => {
      const rootSpelling = ROOTS[rootPitchClass].spellings[0];
      const absolute = getAbsoluteScale(rootSpelling, scaleType);
      const mask = toBitmask(absolute.notes.map((n) => n.pitchClass));

      const diatonicTriadTags = new Map<string, number>();
      const diatonicSeventhTags = new Map<string, number>();
      for (const degree of harmonization) {
        const chordRoot = mod(rootPitchClass + scaleType.intervals[degree.degreeIndex], 12);
        if (degree.triadChordId) diatonicTriadTags.set(`${degree.triadChordId}|${chordRoot}`, degree.degreeIndex);
        if (degree.seventhChordId) diatonicSeventhTags.set(`${degree.seventhChordId}|${chordRoot}`, degree.degreeIndex);
      }

      return { scaleId: scaleType.id, rootPitchClass, mask, diatonicTriadTags, diatonicSeventhTags };
    });
  });

  chordInstances = RELATIVE_CHORDS.flatMap((chordType) =>
    Array.from({ length: 12 }, (_, rootPitchClass): ChordInstance => {
      const rootSpelling = ROOTS[rootPitchClass].spellings[0];
      const absolute = getAbsoluteChord(rootSpelling, chordType);
      const mask = toBitmask(absolute.notes.map((n) => n.pitchClass));
      return { chordId: chordType.id, rootPitchClass, mask };
    }),
  );

  return { scales: scaleInstances, chords: chordInstances };
}

export function getChordsInScale(scaleId: string, rootPitchClass: PitchClass): ScaleChordRelationship[] {
  const { scales, chords } = buildIndex();
  const scale = scales.find((s) => s.scaleId === scaleId && s.rootPitchClass === rootPitchClass);
  if (!scale) return [];

  return chords
    .filter((chord) => isSubset(chord.mask, scale.mask))
    .map((chord) => {
      const key = `${chord.chordId}|${chord.rootPitchClass}`;
      const triadDegree = scale.diatonicTriadTags.get(key);
      const seventhDegree = scale.diatonicSeventhTags.get(key);
      const degree = triadDegree ?? seventhDegree;
      return {
        chordId: chord.chordId,
        chordRootPitchClass: chord.rootPitchClass,
        isDiatonic: degree !== undefined,
        diatonicDegreeIndex: degree,
        isSeventhChord: seventhDegree !== undefined,
      };
    });
}

export interface NoteMatch {
  id: string;
  rootPitchClass: PitchClass;
}

export function findScalesContainingNotes(pitchClasses: PitchClass[]): NoteMatch[] {
  const { scales } = buildIndex();
  const selectedMask = toBitmask(pitchClasses);
  return scales.filter((s) => isSubset(selectedMask, s.mask)).map((s) => ({ id: s.scaleId, rootPitchClass: s.rootPitchClass }));
}

export function findChordsContainingNotes(pitchClasses: PitchClass[]): NoteMatch[] {
  const { chords } = buildIndex();
  const selectedMask = toBitmask(pitchClasses);
  return chords.filter((c) => isSubset(selectedMask, c.mask)).map((c) => ({ id: c.chordId, rootPitchClass: c.rootPitchClass }));
}

export function getScalesContainingChord(chordId: string, rootPitchClass: PitchClass): ChordScaleRelationship[] {
  const { scales, chords } = buildIndex();
  const chord = chords.find((c) => c.chordId === chordId && c.rootPitchClass === rootPitchClass);
  if (!chord) return [];

  return scales
    .filter((scale) => isSubset(chord.mask, scale.mask))
    .map((scale) => {
      const key = `${chord.chordId}|${chord.rootPitchClass}`;
      const triadDegree = scale.diatonicTriadTags.get(key);
      const seventhDegree = scale.diatonicSeventhTags.get(key);
      const degree = triadDegree ?? seventhDegree;
      return {
        scaleId: scale.scaleId,
        scaleRootPitchClass: scale.rootPitchClass,
        isDiatonic: degree !== undefined,
        diatonicDegreeIndex: degree,
      };
    });
}
