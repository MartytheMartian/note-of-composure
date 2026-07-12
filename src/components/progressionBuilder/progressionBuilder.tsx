import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { playChord, playChordProgression } from '../../audio/audioEngine';
import AppContext from '../../state/context';
import { AppMode } from '../../state/types';
import { getAbsoluteChord } from '../../theory/absolute';
import { RELATIVE_CHORDS } from '../../theory/data/chordTypes';
import { MAX_PROGRESSION_SLOTS, MIN_PROGRESSION_SLOTS, RELATIVE_PROGRESSIONS } from '../../theory/data/progressionTypes';
import { RELATIVE_SCALES, scaleSortPriority } from '../../theory/data/scaleTypes';
import { chromaticIntervalLabel, mod, ROOTS, spellingToString } from '../../theory/notes';
import { findScalesContainingNotes } from '../../theory/relationshipIndex';
import { sortRootedItems } from '../../theory/sortOrder';
import type { ChordCategory, RelativeChordDefinition } from '../../theory/types';
import InfoButton from '../common/infoButton/infoButton';
import SortOrderSelect from '../sortOrderSelect/sortOrderSelect';

const scaleTypeIndexById = new Map(RELATIVE_SCALES.map((s, index) => [s.id, index]));

function groupChordsByCategory(): Map<ChordCategory, RelativeChordDefinition[]> {
  const groups = new Map<ChordCategory, RelativeChordDefinition[]>();
  for (const chord of RELATIVE_CHORDS) {
    const group = groups.get(chord.category);
    if (group) group.push(chord);
    else groups.set(chord.category, [chord]);
  }
  return groups;
}

const chordGroups = groupChordsByCategory();

const KEY_TO_SLOT_INDEX: Record<string, number> = {
  '1': 0,
  '2': 1,
  '3': 2,
  '4': 3,
  '5': 4,
  '6': 5,
  '7': 6,
  '8': 7,
  '9': 8,
  '0': 9,
  '-': 10,
  '_': 10,
  '=': 11,
  '+': 11,
};

export default function () {
  const { state, dispatch } = useContext(AppContext);
  const navigate = useNavigate();
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const isAbsolute = state.mode === AppMode.Absolute;
  const progressionRootPc = isAbsolute ? state.rootPitchClass : 0;

  const resolvedSlots = state.progression.map((slot) => {
    const chordType = RELATIVE_CHORDS.find((c) => c.id === slot.chordId)!;
    const chordRootPc = mod(progressionRootPc + slot.rootOffset, 12);
    const rootSpelling = ROOTS[chordRootPc].spellings[0];
    return { slot, chordType, rootSpelling, absoluteChord: getAbsoluteChord(rootSpelling, chordType) };
  });

  const unionPitchClasses = [...new Set(resolvedSlots.flatMap((r) => r.absoluteChord.notes.map((n) => n.pitchClass)))];
  const scaleMatches = sortRootedItems(
    findScalesContainingNotes(unionPitchClasses).map((m) => ({ ...m, index: scaleTypeIndexById.get(m.id)! })),
    state.scaleSortOrder,
    0,
    (m) => m.rootPitchClass,
    (m) => [scaleSortPriority(m.id), m.index],
  );

  useEffect(() => {
    if (!isAbsolute) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.target instanceof HTMLElement && ['SELECT', 'INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
      const index = KEY_TO_SLOT_INDEX[e.key];
      if (index !== undefined && index < resolvedSlots.length) {
        playChord(resolvedSlots[index].absoluteChord.notes, progressionRootPc);
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAbsolute, resolvedSlots]);

  function toggleEditing(index: number) {
    setEditingIndex(editingIndex === index ? null : index);
  }

  function removeSlot(index: number) {
    dispatch({ type: 'REMOVE_PROGRESSION_SLOT', index });
    if (editingIndex === index) setEditingIndex(null);
    else if (editingIndex !== null && index < editingIndex) setEditingIndex(editingIndex - 1);
  }

  function updateEditingSlot(partial: Partial<{ chordId: string; rootOffset: number }>) {
    if (editingIndex === null) return;
    dispatch({
      type: 'SET_PROGRESSION_SLOT',
      index: editingIndex,
      slot: { ...state.progression[editingIndex], ...partial },
    });
  }

  return (
    <article className="list-page">
      <div className="page-heading">
        <h2>Progressions</h2>
        <InfoButton title="Progressions">
          <p>
            Click any chord in the progression to open its editor, where you can choose the chord's root and quality
            from the two dropdowns, play the chord by itself to check that it sounds right, or remove it from the
            progression entirely.
          </p>
          <p>Below the progression, every scale that contains all of its chords is listed for you to explore.</p>
          <p>
            Further down, a library of common chord progressions lets you load a ready-made preset.
          </p>
        </InfoButton>
      </div>

      <div className="list-group">
        <h3>Progression</h3>
        <ul>
          {resolvedSlots.map(({ slot, chordType, rootSpelling }, i) => (
            <li key={i} onClick={() => toggleEditing(i)}>
              {isAbsolute
                ? `${spellingToString(rootSpelling)}${chordType.symbol}`
                : `${chromaticIntervalLabel(slot.rootOffset)} ${chordType.name}`}
            </li>
          ))}
        </ul>

        <button
          className="link-button"
          disabled={state.progression.length >= MAX_PROGRESSION_SLOTS}
          onClick={() => dispatch({ type: 'ADD_PROGRESSION_SLOT' })}
        >
          + Add Chord
        </button>

        <button
          className="link-button"
          disabled={!isAbsolute}
          onClick={() => playChordProgression(resolvedSlots.map((r) => r.absoluteChord.notes), progressionRootPc)}
        >
          ▶ Play Progression
        </button>
      </div>

      {editingIndex !== null && (
        <div className="list-group">
          <h3>Edit Chord</h3>
          <select
            className="select-control"
            style={{ marginRight: "5px" }}
            value={state.progression[editingIndex].rootOffset}
            onChange={(e) => updateEditingSlot({ rootOffset: Number(e.target.value) })}
          >
            {Array.from({ length: 12 }, (_, offset) => (
              <option key={offset} value={offset}>
                {isAbsolute
                  ? spellingToString(ROOTS[mod(progressionRootPc + offset, 12)].spellings[0])
                  : chromaticIntervalLabel(offset)}
              </option>
            ))}
          </select>

          <select
            className="select-control"
            style={{ marginRight: "5px" }}
            value={state.progression[editingIndex].chordId}
            onChange={(e) => updateEditingSlot({ chordId: e.target.value })}
          >
            {[...chordGroups.entries()].map(([category, chords]) => (
              <optgroup key={category} label={category}>
                {chords.map((chord) => (
                  <option key={chord.id} value={chord.id}>
                    {chord.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>

          <button className="link-button" onClick={() => setEditingIndex(null)}>
            Done
          </button>

          <button
            className="link-button"
            disabled={!isAbsolute}
            onClick={() => playChord(resolvedSlots[editingIndex].absoluteChord.notes, progressionRootPc)}
          >
            ▶ Play Chord
          </button>

          <button
            className="link-button"
            disabled={state.progression.length <= MIN_PROGRESSION_SLOTS}
            onClick={() => removeSlot(editingIndex)}
          >
            Remove Chord
          </button>
        </div>
      )}

      <div className="list-group">
        <div className="section-heading">
          <h3>Scales Containing This Progression</h3>
          <SortOrderSelect
            value={state.scaleSortOrder}
            onChange={(order) => dispatch({ type: 'SET_SCALE_SORT_ORDER', order })}
            categoryLabel="Category"
          />
        </div>
        {scaleMatches.length > 0 ? (
          <ul>
            {scaleMatches.map((m) => {
              const scaleType = RELATIVE_SCALES.find((s) => s.id === m.id)!;
              if (isAbsolute) {
                return (
                  <li
                    key={`${m.id}-${m.rootPitchClass}`}
                    onClick={() => {
                      dispatch({ type: 'SET_ROOT', rootPitchClass: m.rootPitchClass });
                      navigate(`/scale/${m.id}`);
                    }}
                  >
                    {spellingToString(ROOTS[m.rootPitchClass].spellings[0])} {scaleType.name}
                  </li>
                );
              }
              return (
                <li key={`${m.id}-${m.rootPitchClass}`} onClick={() => navigate(`/scale/${m.id}`)}>
                  {chromaticIntervalLabel(m.rootPitchClass)} {scaleType.name}
                </li>
              );
            })}
          </ul>
        ) : (
          <p>No scales contain every chord in this progression.</p>
        )}
      </div>

      <div className="list-group">
        <h3>Common Progressions</h3>
        <ul>
          {RELATIVE_PROGRESSIONS.map((p) => (
            <li key={p.id} onClick={() => dispatch({ type: 'SET_PROGRESSION', slots: [...p.slots] })}>
              {p.name}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
