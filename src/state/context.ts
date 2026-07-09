import { createContext } from 'react';
import { DEFAULT_APP_STATE, type AppAction, type AppState } from './types';

type AppContextProps = {
  state: AppState;
  dispatch: (action: AppAction) => void;
};

const AppContext = createContext<AppContextProps>({
  state: DEFAULT_APP_STATE,
  dispatch: () => {},
});

export default AppContext;
