import { LETTER_CYCLE, NATURAL_SEMITONES, letterIndexAfterSteps, mod, pitchClassOfSpelling } from './notes';
import type { Accidental, NoteSpelling } from './types';

export function spellNote(root: NoteSpelling, letterSteps: number, semitonesFromRoot: number): NoteSpelling {
  const targetPitchClass = mod(pitchClassOfSpelling(root) + semitonesFromRoot, 12);
  const letterIndex = letterIndexAfterSteps(root.letter, letterSteps);
  const letter = LETTER_CYCLE[letterIndex];
  const naturalSemitone = NATURAL_SEMITONES[letter];

  let accidental = targetPitchClass - naturalSemitone;
  if (accidental > 6) accidental -= 12;
  if (accidental < -6) accidental += 12;

  if (accidental < -2 || accidental > 2) {
    throw new Error(
      `spellNote: no reasonable spelling for root ${root.letter}${root.accidental}, letterSteps ${letterSteps}, semitones ${semitonesFromRoot} (computed accidental ${accidental})`,
    );
  }

  return { letter, accidental: accidental as Accidental };
}

export function spellSequence(root: NoteSpelling, semitonesFromRoot: number[], letterSteps: number[]): NoteSpelling[] {
  return semitonesFromRoot.map((semitones, i) => spellNote(root, letterSteps[i], semitones));
}

export function defaultLetterSteps(length: number): number[] {
  return Array.from({ length }, (_, i) => i);
}
