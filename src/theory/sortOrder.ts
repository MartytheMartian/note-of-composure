import { mod } from './notes';
import type { PitchClass } from './types';

export type ListSortOrder = 'root' | 'category';

function compareKeys(a: number[], b: number[]): number {
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return a[i] - b[i];
  }
  return 0;
}

export function sortRootedItems<T>(
  items: T[],
  order: ListSortOrder,
  anchorRoot: PitchClass,
  getRootPitchClass: (item: T) => PitchClass,
  getCategoryKeys: (item: T) => number[],
): T[] {
  return [...items].sort((a, b) => {
    const rootKey = mod(getRootPitchClass(a) - anchorRoot, 12) - mod(getRootPitchClass(b) - anchorRoot, 12);
    const categoryKey = compareKeys(getCategoryKeys(a), getCategoryKeys(b));
    return order === 'root' ? rootKey || categoryKey : categoryKey || rootKey;
  });
}
