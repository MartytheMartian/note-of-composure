import type { PitchClass } from './types';

export function toBitmask(pitchClasses: PitchClass[]): number {
  return pitchClasses.reduce((mask, pc) => mask | (1 << pc), 0);
}

export function isSubset(subMask: number, superMask: number): boolean {
  return (subMask & superMask) === subMask;
}
