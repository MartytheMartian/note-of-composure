import { defaultLetterSteps, spellNote, spellSequence } from './spelling';
import { pitchClassOfSpelling } from './notes';
import type {
  AbsoluteChord,
  AbsoluteNote,
  AbsoluteScale,
  NoteSpelling,
  RelativeChordDefinition,
  RelativeScaleDefinition,
} from './types';

function candidateLetterStepPatterns(length: number): number[][] {
  const excludableCount = 7 - length;
  if (excludableCount <= 0) return [defaultLetterSteps(Math.min(length, 7))];

  const excludable = [1, 2, 3, 4, 5, 6];
  const combos: number[][] = [];
  (function choose(start: number, chosen: number[]) {
    if (chosen.length === excludableCount) {
      combos.push([...chosen]);
      return;
    }
    for (let i = start; i < excludable.length; i++) {
      choose(i + 1, [...chosen, excludable[i]]);
    }
  })(0, []);

  return combos.map((excluded) => [0, 1, 2, 3, 4, 5, 6].filter((p) => p === 0 || !excluded.includes(p)));
}

function spellSequenceWithFallback(
  root: NoteSpelling,
  semitonesFromRoot: number[],
  preferredLetterSteps: number[],
): { spellings: NoteSpelling[]; letterSteps: number[] } {
  try {
    return { spellings: spellSequence(root, semitonesFromRoot, preferredLetterSteps), letterSteps: preferredLetterSteps };
  } catch {
    // fall through to search alternatives below
  }

  let best: { spellings: NoteSpelling[]; letterSteps: number[]; maxAbsAccidental: number } | undefined;
  for (const candidate of candidateLetterStepPatterns(semitonesFromRoot.length)) {
    try {
      const spellings = semitonesFromRoot.map((semitones, i) => spellNote(root, candidate[i], semitones));
      const maxAbsAccidental = Math.max(...spellings.map((s) => Math.abs(s.accidental)));
      if (!best || maxAbsAccidental < best.maxAbsAccidental) {
        best = { spellings, letterSteps: candidate, maxAbsAccidental };
      }
    } catch {
      // this candidate doesn't work either, try the next one
    }
  }

  if (!best) {
    throw new Error(`No valid letter spelling found for root ${root.letter}${root.accidental}`);
  }
  return best;
}

const MAJOR_DEGREE_REFERENCE = [0, 2, 4, 5, 7, 9, 11];

const ACCIDENTAL_PREFIX: Record<number, string> = {
  [-2]: 'bb',
  [-1]: 'b',
  [0]: '',
  [1]: '#',
  [2]: '##',
};

function degreeLabelForScaleTone(interval: number, letterStep: number): string {
  const reference = MAJOR_DEGREE_REFERENCE[letterStep];
  let diff = interval - reference;
  if (diff > 6) diff -= 12;
  if (diff < -6) diff += 12;
  const prefix = ACCIDENTAL_PREFIX[diff] ?? `(${diff > 0 ? '+' : ''}${diff})`;
  return `${prefix}${letterStep + 1}`;
}

export function getRelativeScaleDegreeLabels(scaleType: RelativeScaleDefinition): string[] {
  const letterSteps = scaleType.degreeLetterSteps ?? defaultLetterSteps(scaleType.intervals.length);
  return scaleType.intervals.map((interval, i) => degreeLabelForScaleTone(interval, letterSteps[i]));
}

export function getAbsoluteScale(root: NoteSpelling, scaleType: RelativeScaleDefinition): AbsoluteScale {
  const preferredLetterSteps = scaleType.degreeLetterSteps ?? defaultLetterSteps(scaleType.intervals.length);
  const { spellings, letterSteps } = spellSequenceWithFallback(root, scaleType.intervals, preferredLetterSteps);

  const notes: AbsoluteNote[] = spellings.map((spelling, i) => ({
    spelling,
    pitchClass: pitchClassOfSpelling(spelling),
    degreeLabel: degreeLabelForScaleTone(scaleType.intervals[i], letterSteps[i]),
  }));

  return {
    scaleId: scaleType.id,
    name: scaleType.name,
    root,
    notes,
    supportsDiatonicHarmonization: scaleType.supportsDiatonicHarmonization,
  };
}

export function getAbsoluteChord(root: NoteSpelling, chordType: RelativeChordDefinition): AbsoluteChord {
  const spellings = spellSequence(root, chordType.intervals, chordType.degreeLetterSteps);

  const notes: AbsoluteNote[] = spellings.map((spelling, i) => ({
    spelling,
    pitchClass: pitchClassOfSpelling(spelling),
    degreeLabel: chordType.degreeLabels[i],
  }));

  return {
    chordId: chordType.id,
    name: chordType.name,
    symbol: chordType.symbol,
    root,
    notes,
  };
}
