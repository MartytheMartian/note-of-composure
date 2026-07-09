import { useContext, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppContext from '../../state/context';
import { AppMode } from '../../state/types';
import { RELATIVE_CHORDS } from '../../theory/data/chordTypes';
import { RELATIVE_SCALES, scaleSortPriority } from '../../theory/data/scaleTypes';
import { ROOTS, spellingToString } from '../../theory/notes';
import { findChordsContainingNotes, findScalesContainingNotes } from '../../theory/relationshipIndex';
import { sortRootedItems } from '../../theory/sortOrder';
import type { PitchClass, RelativeChordDefinition, RelativeScaleDefinition } from '../../theory/types';
import SortOrderSelect from '../sortOrderSelect/sortOrderSelect';

const scaleTypeById = new Map(RELATIVE_SCALES.map((s, index) => [s.id, { def: s, index }]));
const chordTypeById = new Map(RELATIVE_CHORDS.map((c, index) => [c.id, { def: c, index }]));

interface ResolvedMatch<T> {
  def: T;
  rootPitchClass: PitchClass;
  index: number;
}

export default function () {
  const { state, dispatch } = useContext(AppContext);
  const navigate = useNavigate();
  const [selected, setSelected] = useState<Set<PitchClass>>(new Set());

  function toggleNote(pitchClass: PitchClass) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(pitchClass)) next.delete(pitchClass);
      else next.add(pitchClass);
      return next;
    });
  }

  const selectedPitchClasses = useMemo(() => [...selected], [selected]);
  const hasEnoughNotes = selectedPitchClasses.length >= 2;
  const anchorRoot = state.mode === AppMode.Absolute ? state.rootPitchClass : 0;

  const matchingScales = useMemo<ResolvedMatch<RelativeScaleDefinition>[]>(() => {
    if (!hasEnoughNotes) return [];
    const matches = findScalesContainingNotes(selectedPitchClasses).map((m) => {
      const { def, index } = scaleTypeById.get(m.id)!;
      return { def, index, rootPitchClass: m.rootPitchClass };
    });
    return sortRootedItems(
      matches,
      state.scaleSortOrder,
      anchorRoot,
      (m) => m.rootPitchClass,
      (m) => [scaleSortPriority(m.def.id), m.index],
    );
  }, [selectedPitchClasses, hasEnoughNotes, state.scaleSortOrder, anchorRoot]);

  const matchingChords = useMemo<ResolvedMatch<RelativeChordDefinition>[]>(() => {
    if (!hasEnoughNotes) return [];
    const matches = findChordsContainingNotes(selectedPitchClasses).map((m) => {
      const { def, index } = chordTypeById.get(m.id)!;
      return { def, index, rootPitchClass: m.rootPitchClass };
    });
    return sortRootedItems(
      matches,
      state.chordSortOrder,
      anchorRoot,
      (m) => m.rootPitchClass,
      (m) => [m.index],
    );
  }, [selectedPitchClasses, hasEnoughNotes, state.chordSortOrder, anchorRoot]);

  function selectMatch(rootPitchClass: PitchClass, path: string) {
    dispatch({ type: 'SET_MODE', mode: AppMode.Absolute });
    dispatch({ type: 'SET_ROOT', rootPitchClass });
    navigate(path);
  }

  return (
    <article className="list-page">
      <h2>Notes</h2>
      <ul className="note-picker">
        {ROOTS.map((root) => (
          <li key={root.pitchClass}>
            <button
              type="button"
              className={selected.has(root.pitchClass) ? 'is-selected' : ''}
              onClick={() => toggleNote(root.pitchClass)}
            >
              {spellingToString(root.spellings[0])}
            </button>
          </li>
        ))}
      </ul>

      <div className="list-group">
        <div className="section-heading">
          <h3>Scales</h3>
          <SortOrderSelect
            value={state.scaleSortOrder}
            onChange={(order) => dispatch({ type: 'SET_SCALE_SORT_ORDER', order })}
            categoryLabel="Category"
          />
        </div>
        {hasEnoughNotes ? (
          <ul>
            {matchingScales.map(({ def, rootPitchClass }) => (
              <li
                key={`${def.id}-${rootPitchClass}`}
                onClick={() => selectMatch(rootPitchClass, `/scale/${def.id}`)}
              >
                {spellingToString(ROOTS[rootPitchClass].spellings[0])} {def.name}
              </li>
            ))}
          </ul>
        ) : (
          <p>Select at least two notes to see matching scales.</p>
        )}
      </div>

      <div className="list-group">
        <div className="section-heading">
          <h3>Chords</h3>
          <SortOrderSelect
            value={state.chordSortOrder}
            onChange={(order) => dispatch({ type: 'SET_CHORD_SORT_ORDER', order })}
            categoryLabel="Family"
          />
        </div>
        {hasEnoughNotes ? (
          <ul>
            {matchingChords.map(({ def, rootPitchClass }) => (
              <li
                key={`${def.id}-${rootPitchClass}`}
                onClick={() => selectMatch(rootPitchClass, `/chord/${def.id}`)}
              >
                {spellingToString(ROOTS[rootPitchClass].spellings[0])} {def.name}
              </li>
            ))}
          </ul>
        ) : (
          <p>Select at least two notes to see matching chords.</p>
        )}
      </div>
    </article>
  );
}
