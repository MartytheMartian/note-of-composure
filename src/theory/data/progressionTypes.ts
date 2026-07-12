import type { ProgressionSlotDefinition, RelativeProgressionDefinition } from '../types';

export const MIN_PROGRESSION_SLOTS = 1;
export const MAX_PROGRESSION_SLOTS = 12;

function slot(chordId: string, rootOffset: number): ProgressionSlotDefinition {
  return { chordId, rootOffset };
}

function progression(id: string, name: string, slots: ProgressionSlotDefinition[]): RelativeProgressionDefinition {
  return { id, name, slots };
}

export const RELATIVE_PROGRESSIONS: RelativeProgressionDefinition[] = [
  progression('classic-cadence', 'I-IV-V-I (Classic Cadence)', [
    slot('major', 0),
    slot('major', 5),
    slot('major', 7),
    slot('major', 0),
  ]),
  progression('pop-progression', 'I-V-vi-IV (Pop Progression)', [
    slot('major', 0),
    slot('major', 7),
    slot('minor', 9),
    slot('major', 5),
  ]),
  progression('axis-progression', 'vi-IV-I-V (Axis Progression)', [
    slot('minor', 9),
    slot('major', 5),
    slot('major', 0),
    slot('major', 7),
  ]),
  progression('doo-wop', 'I-vi-IV-V (Doo-Wop Progression)', [
    slot('major', 0),
    slot('minor', 9),
    slot('major', 5),
    slot('major', 7),
  ]),
  progression('jazz-turnaround', 'ii-V-I-vi (Jazz Turnaround)', [
    slot('minor7', 2),
    slot('dominant7', 7),
    slot('major7', 0),
    slot('minor7', 9),
  ]),
  progression('andalusian-cadence', 'i-VII-VI-V (Andalusian Cadence)', [
    slot('minor', 0),
    slot('major', 10),
    slot('major', 8),
    slot('major', 7),
  ]),
  progression('twelve-bar-blues', 'I-I-I-I-IV-IV-I-I-V-IV-I-V (12-Bar Blues)', [
    slot('major', 0),
    slot('major', 0),
    slot('major', 0),
    slot('major', 0),
    slot('major', 5),
    slot('major', 5),
    slot('major', 0),
    slot('major', 0),
    slot('major', 7),
    slot('major', 5),
    slot('major', 0),
    slot('major', 7),
  ]),
  progression('i-iv-v', 'I-IV-V', [slot('major', 0), slot('major', 5), slot('major', 7)]),
  progression('i-v-vi-iii-iv-i-ii-v', 'I-V-vi-iii-IV-I-ii-V', [
    slot('major', 0),
    slot('major', 7),
    slot('minor', 9),
    slot('minor', 4),
    slot('major', 5),
    slot('major', 0),
    slot('minor', 2),
    slot('major', 7),
  ]),
  progression('i-v-vi-v-iv-ii-v-i', 'I-V-vi-V-IV-ii-V-I', [
    slot('major', 0),
    slot('major', 7),
    slot('minor', 9),
    slot('major', 7),
    slot('major', 5),
    slot('minor', 2),
    slot('major', 7),
    slot('major', 0),
  ]),
  progression('i-vi-ii-v', 'I-vi-ii-V', [slot('major', 0), slot('minor', 9), slot('minor', 2), slot('major', 7)]),
  progression('i-iv-i-v', 'I-IV-I-V', [slot('major', 0), slot('major', 5), slot('major', 0), slot('major', 7)]),
  progression('i-vi-iii-vii', 'i-VI-III-VII', [
    slot('minor', 0),
    slot('major', 8),
    slot('major', 3),
    slot('major', 10),
  ]),
  progression('i-iv-vi-v', 'i-iv-VI-V', [slot('minor', 0), slot('minor', 5), slot('major', 8), slot('major', 7)]),
  progression('i-ii-iv-v', 'I-ii-IV-V', [slot('major', 0), slot('minor', 2), slot('major', 5), slot('major', 7)]),
  progression('i-ii-v-i', 'I-ii-V-I', [slot('major', 0), slot('minor', 2), slot('major', 7), slot('major', 0)]),
  progression('ii-v-i', 'ii-V-I', [slot('minor', 2), slot('major', 7), slot('major', 0)]),
  progression('ii-v-vi', 'ii-V-vi', [slot('minor', 2), slot('major', 7), slot('minor', 9)]),
  progression('i-iv-vi-v-2', 'I-IV-vi-V', [slot('major', 0), slot('major', 5), slot('minor', 9), slot('major', 7)]),
  progression('i-v-iv-i', 'I-V-IV-I', [slot('major', 0), slot('major', 7), slot('major', 5), slot('major', 0)]),
  progression('i-iv-v-iv', 'I-IV-V-IV', [slot('major', 0), slot('major', 5), slot('major', 7), slot('major', 5)]),
  progression('i-v-i', 'I-V-I', [slot('major', 0), slot('major', 7), slot('major', 0)]),
  progression('i-v-vi', 'I-V-vi', [slot('major', 0), slot('major', 7), slot('minor', 9)]),
  progression('i-vi-iv-i', 'I-vi-IV-I', [slot('major', 0), slot('minor', 9), slot('major', 5), slot('major', 0)]),
  progression('i-iv-iii-vi', 'I-IV-iii-vi', [
    slot('major', 0),
    slot('major', 5),
    slot('minor', 4),
    slot('minor', 9),
  ]),
  progression('i-iv-iii-iv', 'I-IV-iii-IV', [slot('major', 0), slot('major', 5), slot('minor', 4), slot('major', 5)]),
  progression('i-v-iv-iii', 'I-V-IV-iii', [slot('major', 0), slot('major', 7), slot('major', 5), slot('minor', 4)]),
  progression('vi-iv-v-i', 'vi-IV-V-I', [slot('minor', 9), slot('major', 5), slot('major', 7), slot('major', 0)]),
  progression('vi-ii-v-i', 'vi-ii-V-I', [slot('minor', 9), slot('minor', 2), slot('major', 7), slot('major', 0)]),
  progression('vi-iv-v', 'vi-IV-V', [slot('minor', 9), slot('major', 5), slot('major', 7)]),
  progression('i-iii-iv-v', 'I-iii-IV-V', [slot('major', 0), slot('minor', 4), slot('major', 5), slot('major', 7)]),
  progression('i-iii-vi-iv', 'I-iii-vi-IV', [
    slot('major', 0),
    slot('minor', 4),
    slot('minor', 9),
    slot('major', 5),
  ]),
  progression('i-iii-iv-v-2', 'I-III-IV-V', [slot('major', 0), slot('major', 4), slot('major', 5), slot('major', 7)]),
  progression('i-ii-iii-iv', 'I-ii-iii-IV', [
    slot('major', 0),
    slot('minor', 2),
    slot('minor', 4),
    slot('major', 5),
  ]),
  progression('i-iv-ii-v', 'I-IV-ii-V', [slot('major', 0), slot('major', 5), slot('minor', 2), slot('major', 7)]),
  progression('i-v-iv-v', 'I-V-IV-V', [slot('major', 0), slot('major', 7), slot('major', 5), slot('major', 7)]),
  progression('i-iv-v-vi', 'I-IV-V-vi', [slot('major', 0), slot('major', 5), slot('major', 7), slot('minor', 9)]),
  progression('i-v-iv-vi', 'I-V-IV-vi', [slot('major', 0), slot('major', 7), slot('major', 5), slot('minor', 9)]),
  progression('vi-iv-ii-v', 'vi-IV-ii-V', [slot('minor', 9), slot('major', 5), slot('minor', 2), slot('major', 7)]),
  progression('ii-iv-v-i', 'ii-IV-V-I', [slot('minor', 2), slot('major', 5), slot('major', 7), slot('major', 0)]),
  progression('iii-vi-ii-v', 'iii-vi-ii-V', [
    slot('minor', 4),
    slot('minor', 9),
    slot('minor', 2),
    slot('major', 7),
  ]),
  progression('i-v-iv-v-2', 'I-v-IV-V', [slot('major', 0), slot('minor', 7), slot('major', 5), slot('major', 7)]),
  progression('i-vi-iv-v', 'i-VI-iv-V', [slot('minor', 0), slot('major', 8), slot('minor', 5), slot('major', 7)]),
  progression('i-iv-iii-vii', 'i-iv-III-VII', [
    slot('minor', 0),
    slot('minor', 5),
    slot('major', 3),
    slot('major', 10),
  ]),
  progression('i-vii-vi-iii', 'i-VII-VI-III', [
    slot('minor', 0),
    slot('major', 10),
    slot('major', 8),
    slot('major', 3),
  ]),
  progression('i-vi-vii-i', 'i-VI-VII-i', [slot('minor', 0), slot('major', 8), slot('major', 10), slot('minor', 0)]),
];
