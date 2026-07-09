import { assignOctaves, midiNote } from '../../theory/sequence';
import type { AbsoluteNote } from '../../theory/types';
import PianoKey from './pianoKey';

type PianoProps = {
  notes: AbsoluteNote[];
  onNotePress?: (midi: number) => void;
};

const OCTAVE_RANGE = [4, 5];
const WHITE_PITCH_CLASSES = new Set([0, 2, 4, 5, 7, 9, 11]);
const WHITE_KEY_WIDTH_PERCENT = 100 / 14;
const BLACK_KEY_WIDTH_PERCENT = 4.5;

interface KeyDescriptor {
  midi: number;
  pitchClass: number;
  isBlack: boolean;
  precedingWhiteCount: number;
}

function buildKeys(): KeyDescriptor[] {
  const keys: KeyDescriptor[] = [];
  let whiteCount = 0;
  for (const octave of OCTAVE_RANGE) {
    for (let pc = 0; pc < 12; pc++) {
      const isBlack = !WHITE_PITCH_CLASSES.has(pc);
      keys.push({ midi: midiNote(octave, pc), pitchClass: pc, isBlack, precedingWhiteCount: whiteCount });
      if (!isBlack) whiteCount++;
    }
  }
  return keys;
}

const KEYS = buildKeys();

export default function (p: PianoProps) {
  const rootPitchClass = p.notes[0]?.pitchClass;
  const activeMidiNotes = new Set(assignOctaves(p.notes.map((n) => n.pitchClass)));

  const whiteKeys = KEYS.filter((k) => !k.isBlack);
  const blackKeys = KEYS.filter((k) => k.isBlack);

  return (
    <div className="piano">
      {whiteKeys.map((key) => (
        <PianoKey
          key={key.midi}
          isBlack={false}
          isActive={activeMidiNotes.has(key.midi)}
          isRoot={key.pitchClass === rootPitchClass && activeMidiNotes.has(key.midi)}
          onPress={() => p.onNotePress?.(key.midi)}
        />
      ))}
      {blackKeys.map((key) => (
        <PianoKey
          key={key.midi}
          isBlack
          isActive={activeMidiNotes.has(key.midi)}
          isRoot={key.pitchClass === rootPitchClass && activeMidiNotes.has(key.midi)}
          leftPercent={key.precedingWhiteCount * WHITE_KEY_WIDTH_PERCENT - BLACK_KEY_WIDTH_PERCENT / 2}
          onPress={() => p.onNotePress?.(key.midi)}
        />
      ))}
    </div>
  );
}
