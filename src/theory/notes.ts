import type { Accidental, Letter, NoteSpelling, PitchClass, RootDefinition } from './types';

export const LETTER_CYCLE: Letter[] = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

export const NATURAL_SEMITONES: Record<Letter, number> = {
  C: 0,
  D: 2,
  E: 4,
  F: 5,
  G: 7,
  A: 9,
  B: 11,
};

const ACCIDENTAL_SYMBOLS: Record<Accidental, string> = {
  [-2]: 'bb',
  [-1]: 'b',
  [0]: '',
  [1]: '#',
  [2]: 'x',
};

function mod(value: number, modulus: number): number {
  return ((value % modulus) + modulus) % modulus;
}

export function pitchClassOfSpelling(spelling: NoteSpelling): PitchClass {
  return mod(NATURAL_SEMITONES[spelling.letter] + spelling.accidental, 12);
}

export function spellingToString(spelling: NoteSpelling): string {
  return `${spelling.letter}${ACCIDENTAL_SYMBOLS[spelling.accidental]}`;
}

function letterIndexAfterSteps(fromLetter: Letter, steps: number): number {
  return mod(LETTER_CYCLE.indexOf(fromLetter) + steps, 7);
}

export const ROOTS: RootDefinition[] = Array.from({ length: 12 }, (_, pitchClass) => {
  const spellings: NoteSpelling[] = [];
  for (const letter of LETTER_CYCLE) {
    const natural = NATURAL_SEMITONES[letter];
    for (const accidental of [0, -1, 1] as Accidental[]) {
      if (mod(natural + accidental, 12) === pitchClass) {
        spellings.push({ letter, accidental });
      }
    }
  }

  spellings.sort((a, b) => {
    const rank = (s: NoteSpelling) => (s.accidental === 0 ? 0 : s.accidental === 1 ? 1 : 2);
    return rank(a) - rank(b);
  });
  return { pitchClass, spellings };
});

export { letterIndexAfterSteps, mod };
