import type { PitchClass } from './types';

export function midiNote(octave: number, pitchClass: PitchClass): number {
  return 12 * (octave + 1) + pitchClass;
}

export function assignOctaves(pitchClasses: PitchClass[], baseOctave = 4): number[] {
  const result: number[] = [];
  let previousPitchClass = -1;
  let octave = baseOctave;

  for (const pitchClass of pitchClasses) {
    if (pitchClass <= previousPitchClass) octave++;
    result.push(midiNote(octave, pitchClass));
    previousPitchClass = pitchClass;
  }

  return result;
}
