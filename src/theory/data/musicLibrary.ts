import { ROOTS } from '../notes';
import type { MusicLibrary } from '../types';
import { RELATIVE_CHORDS } from './chordTypes';
import { RELATIVE_SCALES } from './scaleTypes';

export const MUSIC_LIBRARY: MusicLibrary = {
  roots: ROOTS,
  relativeScales: RELATIVE_SCALES,
  relativeChords: RELATIVE_CHORDS,
};
