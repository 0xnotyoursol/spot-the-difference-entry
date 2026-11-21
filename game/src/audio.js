// Tiny WebAudio bleeps — no sound files, nothing to load. The context is
// created on the first user gesture (browsers block audio before one), and
// every call is a no-op until then, or while muted.
export function createAudio() {
  let context = null;
  let muted = false;

  function ensure() {
    if (context !== null) return context;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return null;
    context = new AudioContext();
    return context;
  }

  function tone(frequency, startAt, duration, type, volume) {
    const ctx = ensure();
    if (ctx === null || muted) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = frequency;
    gain.gain.setValueAtTime(0, ctx.currentTime + startAt);
    gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + startAt + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startAt + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime + startAt);
    osc.stop(ctx.currentTime + startAt + duration + 0.05);
  }

  return {
    unlock() {
      ensure();
    },
    toggleMute() {
      muted = !muted;
      return muted;
    },
    get muted() {
      return muted;
    },
    click() {
      tone(520, 0, 0.08, 'sine', 0.08);
    },
    found() {
      tone(660, 0, 0.12, 'sine', 0.14);
      tone(880, 0.09, 0.18, 'sine', 0.14);
    },
    miss() {
      tone(160, 0, 0.22, 'sawtooth', 0.07);
    },
    roundClear() {
      tone(523, 0, 0.14, 'triangle', 0.14);
      tone(659, 0.12, 0.14, 'triangle', 0.14);
      tone(784, 0.24, 0.22, 'triangle', 0.14);
    },
    win() {
      [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.13, 0.25, 'triangle', 0.14));
    },
    hint() {
      tone(440, 0, 0.1, 'sine', 0.1);
      tone(587, 0.08, 0.14, 'sine', 0.1);
    },
  };
}
