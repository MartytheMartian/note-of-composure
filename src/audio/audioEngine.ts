import { assignOctaves } from '../theory/sequence';
import type { AbsoluteNote } from '../theory/types';

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

export function playChord(notes: AbsoluteNote[]): void {
  const ctx = getAudioContext();
  const midiNotes = assignOctaves(notes.map((n) => n.pitchClass));
  const startTime = ctx.currentTime;
  midiNotes.forEach((midi) => playTone(ctx, midi, startTime, 1.2));
}
