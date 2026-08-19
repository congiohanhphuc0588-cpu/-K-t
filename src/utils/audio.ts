// Web Audio API sound generator for educational quiz
// Zero external asset dependencies, instant playback, customizable volume

let audioCtx: AudioContext | null = null;
let isSoundEnabled = true;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function setSoundEnabled(enabled: boolean) {
  isSoundEnabled = enabled;
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('dia_li_10_sound_enabled', enabled ? 'true' : 'false');
  }
}

export function getSoundEnabled(): boolean {
  if (typeof localStorage !== 'undefined') {
    const stored = localStorage.getItem('dia_li_10_sound_enabled');
    if (stored !== null) {
      isSoundEnabled = stored === 'true';
    }
  }
  return isSoundEnabled;
}

// 1. Play Correct Sound (Pleasant, bright upward 3-tone chime)
export function playCorrectSound() {
  if (!isSoundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const notes = [523.25, 659.25, 783.99]; // C5, E5, G5 major triad

  notes.forEach((freq, index) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now + index * 0.08);

    gain.gain.setValueAtTime(0, now + index * 0.08);
    gain.gain.linearRampToValueAtTime(0.2, now + index * 0.08 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.08 + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + index * 0.08);
    osc.stop(now + index * 0.08 + 0.36);
  });
}

// 2. Play Incorrect Sound (Gentle, soft lower dual-tone)
export function playIncorrectSound() {
  if (!isSoundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const tones = [260, 207.65]; // C4 down to G#3

  tones.forEach((freq, index) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now + index * 0.12);

    gain.gain.setValueAtTime(0, now + index * 0.12);
    gain.gain.linearRampToValueAtTime(0.18, now + index * 0.12 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.12 + 0.28);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + index * 0.12);
    osc.stop(now + index * 0.12 + 0.3);
  });
}

// 3. Play Click / Select Sound (Short crisp tap)
export function playClickSound() {
  if (!isSoundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(600, now);
  osc.frequency.exponentialRampToValueAtTime(400, now + 0.04);

  gain.gain.setValueAtTime(0.08, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.05);
}

// 4. Play Victory / Completion Fanfare
export function playVictorySound() {
  if (!isSoundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const chord = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 arpeggio

  chord.forEach((freq, index) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now + index * 0.1);

    gain.gain.setValueAtTime(0, now + index * 0.1);
    gain.gain.linearRampToValueAtTime(0.25, now + index * 0.1 + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.1 + 0.6);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + index * 0.1);
    osc.stop(now + index * 0.1 + 0.65);
  });
}
