import { useContext } from 'react';
import AppContext from '../../state/context';
import { AppMode } from '../../state/types';
import { ROOTS, spellingToString } from '../../theory/notes';

const RELATIVE_VALUE = 'relative';

export default function () {
  const { state, dispatch } = useContext(AppContext);

  return (
    <select
      className="select-control"
      value={state.mode === AppMode.Relative ? RELATIVE_VALUE : state.rootPitchClass}
      onChange={(e) => {
        if (e.target.value === RELATIVE_VALUE) {
          dispatch({ type: 'SET_MODE', mode: AppMode.Relative });
          return;
        }
        dispatch({ type: 'SET_MODE', mode: AppMode.Absolute });
        dispatch({ type: 'SET_ROOT', rootPitchClass: Number(e.target.value) });
      }}
    >
      <option value={RELATIVE_VALUE}>Relative</option>
      {ROOTS.map((root) => (
        <option key={root.pitchClass} value={root.pitchClass}>
          {spellingToString(root.spellings[0])}
        </option>
      ))}
    </select>
  );
}
