import { ChordCategory, type RelativeChordDefinition } from '../types';

function chord(
  id: string,
  name: string,
  symbol: string,
  category: ChordCategory,
  intervals: number[],
  degreeLabels: string[],
  degreeLetterSteps: number[],
): RelativeChordDefinition {
  return { id, name, symbol, category, intervals, degreeLabels, degreeLetterSteps };
}

export const RELATIVE_CHORDS: RelativeChordDefinition[] = [
  chord('major', 'Major', '', ChordCategory.Triad, [0, 4, 7], ['1', '3', '5'], [0, 2, 4]),
  chord('minor', 'Minor', 'm', ChordCategory.Triad, [0, 3, 7], ['1', 'b3', '5'], [0, 2, 4]),
  chord('diminished', 'Diminished', 'dim', ChordCategory.Triad, [0, 3, 6], ['1', 'b3', 'b5'], [0, 2, 4]),
  chord('augmented', 'Augmented', 'aug', ChordCategory.Triad, [0, 4, 8], ['1', '3', '#5'], [0, 2, 4]),
  chord('sus2', 'Suspended 2nd', 'sus2', ChordCategory.Sus, [0, 2, 7], ['1', '2', '5'], [0, 1, 4]),
  chord('sus4', 'Suspended 4th', 'sus4', ChordCategory.Sus, [0, 5, 7], ['1', '4', '5'], [0, 3, 4]),
  chord('7sus4', 'Dominant 7 Suspended 4th', '7sus4', ChordCategory.Sus, [0, 5, 7, 10], ['1', '4', '5', 'b7'], [0, 3, 4, 6]),
  chord('major6', 'Major 6th', '6', ChordCategory.Sixth, [0, 4, 7, 9], ['1', '3', '5', '6'], [0, 2, 4, 5]),
  chord('minor6', 'Minor 6th', 'm6', ChordCategory.Sixth, [0, 3, 7, 9], ['1', 'b3', '5', '6'], [0, 2, 4, 5]),
  chord('six-nine', 'Six-Nine', '6/9', ChordCategory.Sixth, [0, 4, 7, 9, 2], ['1', '3', '5', '6', '9'], [0, 2, 4, 5, 1]),
  chord('add9', 'Add 9', 'add9', ChordCategory.Add, [0, 4, 7, 2], ['1', '3', '5', '9'], [0, 2, 4, 1]),
  chord('minor-add9', 'Minor Add 9', 'm(add9)', ChordCategory.Add, [0, 3, 7, 2], ['1', 'b3', '5', '9'], [0, 2, 4, 1]),
  chord('major7', 'Major 7th', 'maj7', ChordCategory.Seventh, [0, 4, 7, 11], ['1', '3', '5', '7'], [0, 2, 4, 6]),
  chord('dominant7', 'Dominant 7th', '7', ChordCategory.Seventh, [0, 4, 7, 10], ['1', '3', '5', 'b7'], [0, 2, 4, 6]),
  chord('minor7', 'Minor 7th', 'm7', ChordCategory.Seventh, [0, 3, 7, 10], ['1', 'b3', '5', 'b7'], [0, 2, 4, 6]),
  chord('minor-major7', 'Minor Major 7th', 'm(maj7)', ChordCategory.Seventh, [0, 3, 7, 11], ['1', 'b3', '5', '7'], [0, 2, 4, 6]),
  chord('half-diminished7', 'Half-Diminished 7th', 'm7b5', ChordCategory.Seventh, [0, 3, 6, 10], ['1', 'b3', 'b5', 'b7'], [0, 2, 4, 6]),
  chord('diminished7', 'Diminished 7th', 'dim7', ChordCategory.Seventh, [0, 3, 6, 9], ['1', 'b3', 'b5', 'bb7'], [0, 2, 4, 6]),
  chord('augmented7', 'Augmented 7th', '7#5', ChordCategory.Seventh, [0, 4, 8, 10], ['1', '3', '#5', 'b7'], [0, 2, 4, 6]),
  chord('augmented-major7', 'Augmented Major 7th', 'maj7#5', ChordCategory.Seventh, [0, 4, 8, 11], ['1', '3', '#5', '7'], [0, 2, 4, 6]),
  chord('major9', 'Major 9th', 'maj9', ChordCategory.Extended, [0, 4, 7, 11, 2], ['1', '3', '5', '7', '9'], [0, 2, 4, 6, 1]),
  chord('dominant9', 'Dominant 9th', '9', ChordCategory.Extended, [0, 4, 7, 10, 2], ['1', '3', '5', 'b7', '9'], [0, 2, 4, 6, 1]),
  chord('minor9', 'Minor 9th', 'm9', ChordCategory.Extended, [0, 3, 7, 10, 2], ['1', 'b3', '5', 'b7', '9'], [0, 2, 4, 6, 1]),
  chord('dominant11', 'Dominant 11th', '11', ChordCategory.Extended, [0, 4, 7, 10, 2, 5], ['1', '3', '5', 'b7', '9', '11'], [0, 2, 4, 6, 1, 3]),
  chord('minor11', 'Minor 11th', 'm11', ChordCategory.Extended, [0, 3, 7, 10, 2, 5], ['1', 'b3', '5', 'b7', '9', '11'], [0, 2, 4, 6, 1, 3]),
  chord('major13', 'Major 13th', 'maj13', ChordCategory.Extended, [0, 4, 7, 11, 2, 9], ['1', '3', '5', '7', '9', '13'], [0, 2, 4, 6, 1, 5]),
  chord('dominant13', 'Dominant 13th', '13', ChordCategory.Extended, [0, 4, 7, 10, 2, 9], ['1', '3', '5', 'b7', '9', '13'], [0, 2, 4, 6, 1, 5]),
  chord('minor13', 'Minor 13th', 'm13', ChordCategory.Extended, [0, 3, 7, 10, 2, 9], ['1', 'b3', '5', 'b7', '9', '13'], [0, 2, 4, 6, 1, 5]),
  chord('dominant7-flat9', 'Dominant 7 Flat 9', '7b9', ChordCategory.Altered, [0, 4, 7, 10, 1], ['1', '3', '5', 'b7', 'b9'], [0, 2, 4, 6, 1]),
  chord('dominant7-sharp9', 'Dominant 7 Sharp 9', '7#9', ChordCategory.Altered, [0, 4, 7, 10, 3], ['1', '3', '5', 'b7', '#9'], [0, 2, 4, 6, 1]),
  chord('dominant7-sharp11', 'Dominant 7 Sharp 11', '7#11', ChordCategory.Altered, [0, 4, 7, 10, 2, 6], ['1', '3', '5', 'b7', '9', '#11'], [0, 2, 4, 6, 1, 3]),
  chord('altered', 'Altered Dominant', '7alt', ChordCategory.Altered, [0, 4, 8, 10, 1, 3], ['1', '3', '#5', 'b7', 'b9', '#9'], [0, 2, 4, 6, 1, 1]),
];
