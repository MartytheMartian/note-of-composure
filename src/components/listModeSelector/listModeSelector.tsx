import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AppContext from '../../state/context';
import { ListMode } from '../../state/types';

export default function () {
  const { state, dispatch } = useContext(AppContext);
  const navigate = useNavigate();

  return (
    <select
      className="select-control"
      value={state.listMode}
      onChange={(e) => {
        dispatch({ type: 'SET_LIST_MODE', listMode: e.target.value as ListMode });
        navigate('/');
      }}
    >
      <option value={ListMode.Scales}>Scales</option>
      <option value={ListMode.Chords}>Chords</option>
      <option value={ListMode.Notes}>Notes</option>
      <option value={ListMode.Progressions}>Progressions</option>
    </select>
  );
}
