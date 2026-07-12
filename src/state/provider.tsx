import { useEffect, useReducer, type ReactNode } from 'react';
import AppContext from './context';
import { savePersistedState, loadPersistedState } from './persistence';
import type { AppAction, AppState } from './types';
import { MAX_PROGRESSION_SLOTS, MIN_PROGRESSION_SLOTS } from '../theory/data/progressionTypes';

type AppProviderProps = {
  children: ReactNode;
};

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_MODE':
      return { ...state, mode: action.mode };
    case 'SET_ROOT':
      return { ...state, rootPitchClass: action.rootPitchClass };
    case 'SET_LIST_MODE':
      return { ...state, listMode: action.listMode };
    case 'SET_LAST_PATH':
      return { ...state, lastPath: action.path };
    case 'SET_SCALE_SORT_ORDER':
      return { ...state, scaleSortOrder: action.order };
    case 'SET_CHORD_SORT_ORDER':
      return { ...state, chordSortOrder: action.order };
    case 'SET_PROGRESSION_SLOT': {
      const slots = [...state.progression];
      slots[action.index] = action.slot;
      return { ...state, progression: slots };
    }
    case 'SET_PROGRESSION':
      return { ...state, progression: action.slots };
    case 'ADD_PROGRESSION_SLOT':
      if (state.progression.length >= MAX_PROGRESSION_SLOTS) return state;
      return { ...state, progression: [...state.progression, { chordId: 'major', rootOffset: 0 }] };
    case 'REMOVE_PROGRESSION_SLOT':
      if (state.progression.length <= MIN_PROGRESSION_SLOTS) return state;
      return { ...state, progression: state.progression.filter((_, i) => i !== action.index) };
    case 'HYDRATE':
      return action.state;
    default:
      return state;
  }
}

export default function (p: AppProviderProps) {
  const [state, dispatch] = useReducer(reducer, undefined, loadPersistedState);

  useEffect(() => {
    savePersistedState(state);
  }, [state]);

  return <AppContext.Provider value={{ state, dispatch }}>{p.children}</AppContext.Provider>;
}
