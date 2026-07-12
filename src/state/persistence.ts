import { AppMode, DEFAULT_APP_STATE, ListMode, ListSortOrder, type AppState } from './types';

const STORAGE_KEY = 'note-of-composure:v1';

export function loadPersistedState(): AppState {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return DEFAULT_APP_STATE;

  try {
    const parsed = JSON.parse(raw);
    if (!Object.values(AppMode).includes(parsed.mode)) return DEFAULT_APP_STATE;
    return {
      mode: parsed.mode,
      rootPitchClass: typeof parsed.rootPitchClass === 'number' ? parsed.rootPitchClass : 0,
      listMode: Object.values(ListMode).includes(parsed.listMode) ? parsed.listMode : ListMode.Scales,
      lastPath: typeof parsed.lastPath === 'string' ? parsed.lastPath : '/',
      scaleSortOrder: Object.values(ListSortOrder).includes(parsed.scaleSortOrder) ? parsed.scaleSortOrder : ListSortOrder.Root,
      chordSortOrder: Object.values(ListSortOrder).includes(parsed.chordSortOrder) ? parsed.chordSortOrder : ListSortOrder.Root,
    };
  } catch {
    return DEFAULT_APP_STATE;
  }
}

export function savePersistedState(state: AppState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
