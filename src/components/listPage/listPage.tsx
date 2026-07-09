import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AppContext from '../../state/context';
import { ListMode } from '../../state/types';
import NotesFinder from '../notesFinder/notesFinder';
import { RELATIVE_CHORDS } from '../../theory/data/chordTypes';
import { RELATIVE_SCALES } from '../../theory/data/scaleTypes';
import type { ChordCategory, RelativeChordDefinition, RelativeScaleDefinition, ScaleCategory } from '../../theory/types';

function groupBy<T, K extends string>(items: T[], keyOf: (item: T) => K): Map<K, T[]> {
  const groups = new Map<K, T[]>();
  for (const item of items) {
    const key = keyOf(item);
    const group = groups.get(key);
    if (group) group.push(item);
    else groups.set(key, [item]);
  }
  return groups;
}

function spaceCategoryName(category: string): string {
  return category.replace(/([a-z])([A-Z])/g, '$1 $2');
}

const scaleGroups = groupBy<RelativeScaleDefinition, ScaleCategory>(RELATIVE_SCALES, (s) => s.category);
const chordGroups = groupBy<RelativeChordDefinition, ChordCategory>(RELATIVE_CHORDS, (c) => c.category);

export default function () {
  const { state } = useContext(AppContext);
  const navigate = useNavigate();

  if (state.listMode === ListMode.Notes) {
    return <NotesFinder />;
  }

  return (
    <article className="list-page">
      <h2>{state.listMode}</h2>
      {state.listMode === ListMode.Scales
        ? [...scaleGroups.entries()].map(([category, scales]) => (
            <div key={category} className="list-group">
              <h3>{spaceCategoryName(category)}</h3>
              <ul>
                {scales.map((scale) => (
                  <li key={scale.id} onClick={() => navigate(`/scale/${scale.id}`)}>
                    {scale.name}
                  </li>
                ))}
              </ul>
            </div>
          ))
        : [...chordGroups.entries()].map(([category, chords]) => (
            <div key={category} className="list-group">
              <h3>{spaceCategoryName(category)}</h3>
              <ul>
                {chords.map((chord) => (
                  <li key={chord.id} onClick={() => navigate(`/chord/${chord.id}`)}>
                    {chord.name}
                  </li>
                ))}
              </ul>
            </div>
          ))}
    </article>
  );
}
