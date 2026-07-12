import { useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { playNote, playScaleAscending } from '../../audio/audioEngine';
import AppContext from '../../state/context';
import { AppMode } from '../../state/types';
import { getAbsoluteScale, getRelativeScaleDegreeLabels } from '../../theory/absolute';
import { RELATIVE_CHORDS } from '../../theory/data/chordTypes';
import { RELATIVE_SCALES } from '../../theory/data/scaleTypes';
import { mod, ROOTS, spellingToString } from '../../theory/notes';
import { getChordsInScale } from '../../theory/relationshipIndex';
import { assignOctaves } from '../../theory/sequence';
import { sortRootedItems } from '../../theory/sortOrder';
import Piano from '../piano/piano';
import SortOrderSelect from '../sortOrderSelect/sortOrderSelect';

const chordTypeIndexById = new Map(RELATIVE_CHORDS.map((c, index) => [c.id, index]));

export default function () {
  const { scaleId } = useParams<{ scaleId: string }>();
  const navigate = useNavigate();
  const { state, dispatch } = useContext(AppContext);
  const scaleType = RELATIVE_SCALES.find((s) => s.id === scaleId);

  if (!scaleType) return <p>Scale not found.</p>;

  const isAbsolute = state.mode === AppMode.Absolute;
  const rootSpelling = ROOTS[state.rootPitchClass].spellings[0];
  const absoluteScale = isAbsolute ? getAbsoluteScale(rootSpelling, scaleType) : undefined;
  const noteMidiNotes = absoluteScale ? assignOctaves(absoluteScale.notes.map((n) => n.pitchClass)) : undefined;
  const degreeLabels = getRelativeScaleDegreeLabels(scaleType);
  const relationships = sortRootedItems(
    getChordsInScale(scaleType.id, 0),
    state.chordSortOrder,
    0,
    (r) => r.chordRootPitchClass,
    (r) => [chordTypeIndexById.get(r.chordId)!],
  );

  useEffect(() => {
    if (!isAbsolute || !noteMidiNotes) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.target instanceof HTMLElement && ['SELECT', 'INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
      const index = Number(e.key) - 1;
      if (Number.isInteger(index) && index >= 0 && index < noteMidiNotes!.length) {
        playNote(noteMidiNotes![index]);
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAbsolute, noteMidiNotes]);

  return (
    <article className="scale-detail">
      <h2>{isAbsolute ? `${spellingToString(rootSpelling)} ${scaleType.name}` : scaleType.name}</h2>

      <span style={{ width: "75px" }}>Category</span>
      <span>{scaleType.category}</span>
      <br />
      <span style={{ width: "75px" }}>Steps</span>
      <span>{scaleType.stepPattern.join(" - ")}</span>

      <h3>Notes</h3>
      <ul>
        {scaleType.intervals.map((_, i) => (
          <li
            key={i}
            className={isAbsolute ? 'note-row is-playable' : 'note-row'}
            onClick={isAbsolute ? () => playNote(noteMidiNotes![i]) : undefined}
          >
            {isAbsolute ? `${spellingToString(absoluteScale!.notes[i].spelling)} (${degreeLabels[i]})` : `(${degreeLabels[i]})`}
          </li>
        ))}
      </ul>

      {
        isAbsolute && (
          <>
            <button className="link-button" onClick={() => playScaleAscending(absoluteScale!.notes)}>
              ▶ Play Scale
            </button>
            <Piano notes={absoluteScale!.notes} onNotePress={playNote} />
          </>
        )
      }

      <div className="section-heading">
        <h3>Diatonic Chords</h3>
        <SortOrderSelect
          value={state.chordSortOrder}
          onChange={(order) => dispatch({ type: 'SET_CHORD_SORT_ORDER', order })}
          categoryLabel="Family"
        />
      </div>
      <ul>
        {relationships
          .filter((r) => r.isDiatonic)
          .map((r) => {
            const chordType = RELATIVE_CHORDS.find((c) => c.id === r.chordId)!;
            const degreeIndex = scaleType.intervals.indexOf(r.chordRootPitchClass);
            const label = isAbsolute
              ? `${spellingToString(absoluteScale!.notes[degreeIndex].spelling)}${chordType.symbol}`
              : `${degreeLabels[degreeIndex]} ${chordType.name}`;
            return (
              <li
                key={`${r.chordId}-${r.chordRootPitchClass}`}
                onClick={() => {
                  if (isAbsolute) {
                    dispatch({ type: 'SET_ROOT', rootPitchClass: mod(state.rootPitchClass + r.chordRootPitchClass, 12) });
                  }
                  navigate(`/chord/${r.chordId}`);
                }}
              >
                {label}
              </li>
            );
          })}
      </ul>

      <h3>Other Chords That Fit This Scale</h3>
      <ul>
        {relationships
          .filter((r) => !r.isDiatonic)
          .map((r) => {
            const chordType = RELATIVE_CHORDS.find((c) => c.id === r.chordId)!;
            const degreeIndex = scaleType.intervals.indexOf(r.chordRootPitchClass);
            const label = isAbsolute
              ? `${spellingToString(absoluteScale!.notes[degreeIndex].spelling)}${chordType.symbol}`
              : `${degreeLabels[degreeIndex]} ${chordType.name}`;
            return (
              <li
                key={`${r.chordId}-${r.chordRootPitchClass}`}
                onClick={() => {
                  if (isAbsolute) {
                    dispatch({ type: 'SET_ROOT', rootPitchClass: mod(state.rootPitchClass + r.chordRootPitchClass, 12) });
                  }
                  navigate(`/chord/${r.chordId}`);
                }}
              >
                {label}
              </li>
            );
          })}
      </ul>
    </article >
  );
}
