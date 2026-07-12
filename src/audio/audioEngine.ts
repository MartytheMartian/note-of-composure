import { assignOctaves, midiNote } from '../theory/sequence';
import type { AbsoluteNote, PitchClass } from '../theory/types';

let audioContext: AudioContext | undefined;

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
  return audioContext;
}

function midiToFrequency(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

function playTone(ctx: AudioContext, midi: number, startTime: number, duration: number): void {
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();

  oscillator.type = 'triangle';
  oscillator.frequency.value = midiToFrequency(midi);

  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(0.3, startTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

  oscillator.connect(gain);
  gain.connect(ctx.destination);
  oscillator.start(startTime);
  oscillator.stop(startTime + duration + 0.05);
}

export function playNote(midi: number): void {
  const ctx = getAudioContext();
  playTone(ctx, midi, ctx.currentTime, 0.6);
}

export function playScaleAscending(notes: AbsoluteNote[]): void {
  const ctx = getAudioContext();
  const midiNotes = assignOctaves(notes.map((n) => n.pitchClass));
  const resolvedMidiNotes = [...midiNotes, midiNotes[0] + 12];
  const noteDuration = 0.28;
  resolvedMidiNotes.forEach((midi, i) => playTone(ctx, midi, ctx.currentTime + i * noteDuration, noteDuration * 1.5));
}

function anchorAboveRoot(midiNotes: number[], rootMidi: number): number[] {
  return midiNotes[0] < rootMidi ? midiNotes.map((midi) => midi + 12) : midiNotes;
}

export function playChord(notes: AbsoluteNote[], rootPitchClass?: PitchClass): void {
  const ctx = getAudioContext();
  let midiNotes = assignOctaves(notes.map((n) => n.pitchClass));
  if (rootPitchClass !== undefined) {
    midiNotes = anchorAboveRoot(midiNotes, midiNote(4, rootPitchClass));
  }
  const startTime = ctx.currentTime;
  midiNotes.forEach((midi) => playTone(ctx, midi, startTime, 1.2));
}

export function playChordProgression(chords: AbsoluteNote[][], rootPitchClass: PitchClass): number {
  const ctx = getAudioContext();
  const chordDuration = 1.0;
  const rootMidi = midiNote(4, rootPitchClass);

  chords.forEach((notes, i) => {
    const midiNotes = anchorAboveRoot(assignOctaves(notes.map((n) => n.pitchClass)), rootMidi);
    const startTime = ctx.currentTime + i * chordDuration;
    midiNotes.forEach((midi) => playTone(ctx, midi, startTime, chordDuration * 1.1));
  });

  return chords.length * chordDuration;
}
