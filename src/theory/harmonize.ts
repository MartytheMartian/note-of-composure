import { RELATIVE_CHORDS } from './data/chordTypes';
import { ChordCategory, type RelativeScaleDefinition } from './types';

const TERTIAN_CHORDS = RELATIVE_CHORDS.filter(
  (c) => c.category === ChordCategory.Triad || c.category === ChordCategory.Seventh,
);

export interface DiatonicDegreeHarmonization {
  degreeIndex: number;
  triadChordId?: string;
  seventhChordId?: string;
}

function stackedTonesAbsolute(scaleIntervals: number[], startDegree: number, count: number): number[] {
  const length = scaleIntervals.length;
  return Array.from({ length: count }, (_, k) => {
    const rawIndex = startDegree + k * 2;
    const octaves = Math.floor(rawIndex / length);
    return scaleIntervals[rawIndex % length] + octaves * 12;
  });
}

function intervalsEqual(a: number[], b: number[]): boolean {
  return a.length === b.length && a.every((v, i) => v === b[i]);
}

export function diatonicHarmonization(scaleType: RelativeScaleDefinition): DiatonicDegreeHarmonization[] {
  if (!scaleType.supportsDiatonicHarmonization) return [];

  const length = scaleType.intervals.length;
  return Array.from({ length }, (_, degreeIndex) => {
    const triadTones = stackedTonesAbsolute(scaleType.intervals, degreeIndex, 3);
    const seventhTones = stackedTonesAbsolute(scaleType.intervals, degreeIndex, 4);
    const triadIntervals = triadTones.map((v) => v - triadTones[0]);
    const seventhIntervals = seventhTones.map((v) => v - seventhTones[0]);

    const triadMatch = TERTIAN_CHORDS.find((c) => intervalsEqual(c.intervals, triadIntervals));
    const seventhMatch = TERTIAN_CHORDS.find((c) => intervalsEqual(c.intervals, seventhIntervals));

    return {
      degreeIndex,
      triadChordId: triadMatch?.id,
      seventhChordId: seventhMatch?.id,
    };
  });
}
