import { RELATIVE_PROGRESSIONS } from '../theory/data/progressionTypes';
import type { PitchClass, ProgressionSlotDefinition } from '../theory/types';

export const AppMode = {
  Relative: 'Relative',
  Absolute: 'Absolute',
} as const;
export type AppMode = (typeof AppMode)[keyof typeof AppMode];

export const ListMode = {
  Scales: 'Scales',
  Chords: 'Chords',
  Notes: 'Notes',
  Progressions: 'Progressions',
} as const;
export type ListMode = (typeof ListMode)[keyof typeof ListMode];

export const ListSortOrder = {
  Root: 'root',
  Category: 'category',
} as const;
export type ListSortOrder = (typeof ListSortOrder)[keyof typeof ListSortOrder];

export interface AppState {
  mode: AppMode;
  rootPitchClass: PitchClass;
  listMode: ListMode;
  lastPath: string;
  scaleSortOrder: ListSortOrder;
  chordSortOrder: ListSortOrder;
  progression: ProgressionSlotDefinition[];
}

export type AppAction =
  | { type: 'SET_MODE'; mode: AppMode }
  | { type: 'SET_ROOT'; rootPitchClass: PitchClass }
  | { type: 'SET_LIST_MODE'; listMode: ListMode }
  | { type: 'SET_LAST_PATH'; path: string }
  | { type: 'SET_SCALE_SORT_ORDER'; order: ListSortOrder }
  | { type: 'SET_CHORD_SORT_ORDER'; order: ListSortOrder }
  | { type: 'SET_PROGRESSION_SLOT'; index: number; slot: ProgressionSlotDefinition }
  | { type: 'SET_PROGRESSION'; slots: ProgressionSlotDefinition[] }
  | { type: 'ADD_PROGRESSION_SLOT' }
  | { type: 'REMOVE_PROGRESSION_SLOT'; index: number }
  | { type: 'HYDRATE'; state: AppState };

export const DEFAULT_APP_STATE: AppState = {
  mode: AppMode.Absolute,
  rootPitchClass: 0,
  listMode: ListMode.Scales,
  lastPath: '/',
  scaleSortOrder: ListSortOrder.Root,
  chordSortOrder: ListSortOrder.Root,
  progression: RELATIVE_PROGRESSIONS[0].slots,
};
