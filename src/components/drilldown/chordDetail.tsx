import { useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { playChord, playNote } from '../../audio/audioEngine';
import AppContext from '../../state/context';
import { AppMode } from '../../state/types';
import { getAbsoluteChord, getRelativeScaleDegreeLabels } from '../../theory/absolute';
import { RELATIVE_CHORDS } from '../../theory/data/chordTypes';
import { RELATIVE_SCALES, scaleSortPriority } from '../../theory/data/scaleTypes';
import { mod, ROOTS, spellingToString, toCommonSpelling } from '../../theory/notes';
import { getScalesContainingChord } from '../../theory/relationshipIndex';
import { assignOctaves } from '../../theory/sequence';
import { sortRootedItems } from '../../theory/sortOrder';
import Piano from '../piano/piano';
import SortOrderSelect from '../sortOrderSelect/sortOrderSelect';

const scaleTypeIndexById = new Map(RELATIVE_SCALES.map((s, index) => [s.id, index]));

export default function () {
  const { chordId } = useParams<{ chordId: string }>();
  const navigate = useNavigate();
  const { state, dispatch } = useContext(AppContext);
  const chordType = RELATIVE_CHORDS.find((c) => c.id === chordId);

  if (!chordType) return <p>Chord not found.</p>;

  const isAbsolute = state.mode === AppMode.Absolute;
  const rootSpelling = ROOTS[state.rootPitchClass].spellings[0];
  const absoluteChord = isAbsolute ? getAbsoluteChord(rootSpelling, chordType) : undefined;
  const noteMidiNotes = absoluteChord ? assignOctaves(absoluteChord.notes.map((n) => n.pitchClass)) : undefined;

  const relationships = sortRootedItems(
    getScalesContainingChord(chordType.id, 0),
    state.scaleSortOrder,
    0,
    (rel) => rel.scaleRootPitchClass,
    (rel) => [scaleSortPriority(rel.scaleId), scaleTypeIndexById.get(rel.scaleId)!],
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
    <article className="chord-detail">
      <h2>{isAbsolute ? `${spellingToString(rootSpelling)} ${chordType.name}` : chordType.name}</h2>

      <span style={{ width: "75px" }}>Symbol</span>
      <span>{isAbsolute ? `${spellingToString(rootSpelling)}${chordType.symbol}` : chordType.symbol}</span>
      <br />
      <span style={{ width: "75px" }}>Category</span>
      <span>{chordType.category}</span>

      <h3>Notes</h3>
      <ul>
        {chordType.intervals.map((_, i) => (
          <li
            key={i}
            className={isAbsolute ? 'note-row is-playable' : 'note-row'}
            onClick={isAbsolute ? () => playNote(noteMidiNotes![i]) : undefined}
          >
            {isAbsolute ? `${spellingToString(toCommonSpelling(absoluteChord!.notes[i].spelling))} (${chordType.degreeLabels[i]})` : `(${chordType.degreeLabels[i]})`}
          </li>
        ))}
      </ul>

      {isAbsolute && (
        <>
          <button className="link-button" onClick={() => playChord(absoluteChord!.notes)}>
            ▶ Play Chord
          </button>
          <Piano notes={absoluteChord!.notes} onNotePress={playNote} />
        </>
      )}

      <div className="section-heading">
        <h3>Scales Containing This Chord</h3>
        <SortOrderSelect
          value={state.scaleSortOrder}
          onChange={(order) => dispatch({ type: 'SET_SCALE_SORT_ORDER', order })}
          categoryLabel="Category"
        />
      </div>
      <ul>
        {relationships.map((rel) => {
          const scaleType = RELATIVE_SCALES.find((s) => s.id === rel.scaleId)!;
          const chordDegreeOffset = mod(-rel.scaleRootPitchClass, 12);
          const degreeIndex = scaleType.intervals.indexOf(chordDegreeOffset);
          const degreeLabels = getRelativeScaleDegreeLabels(scaleType);

          if (isAbsolute) {
            const scaleRootPc = mod(state.rootPitchClass + rel.scaleRootPitchClass, 12);
            const scaleRootSpelling = ROOTS[scaleRootPc].spellings[0];
            return (
              <li
                key={`${rel.scaleId}-${rel.scaleRootPitchClass}`}
                onClick={() => {
                  dispatch({ type: 'SET_ROOT', rootPitchClass: scaleRootPc });
                  navigate(`/scale/${rel.scaleId}`);
                }}
              >
                {spellingToString(scaleRootSpelling)} {scaleType.name}
              </li>
            );
          }

          return (
            <li
              key={`${rel.scaleId}-${rel.scaleRootPitchClass}`}
              onClick={() => navigate(`/scale/${rel.scaleId}`)}
            >
              {scaleType.name} (degree {degreeLabels[degreeIndex]})
            </li>
          );
        })}
      </ul>
    </article>
  );
}
