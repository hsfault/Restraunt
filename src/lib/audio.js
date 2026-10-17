// Thermal-printer ticks synthesised with Web Audio. No audio files.
let ctx = null;
let noise = null;
let enabled = true;

export const isAudioEnabled = () => enabled;
export function setAudioEnabled(v) {
  enabled = v;
}

function ensure() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    noise = ctx.createBuffer(1, ctx.sampleRate * 0.25, ctx.sampleRate);
    const ch = noise.getChannelData(0);
    for (let i = 0; i < ch.length; i += 1) ch[i] = Math.random() * 2 - 1;
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

// Call from a user gesture so later ticks are allowed to play.
export function primeAudio() {
  ensure();
}

export function printTick(duration = 0.07) {
  if (!enabled) return;
  const ac = ensure();
  if (!ac) return;
  const t = ac.currentTime;
  const src = ac.createBufferSource();
  src.buffer = noise;
  const band = ac.createBiquadFilter();
  band.type = 'bandpass';
  band.frequency.value = 2400 + Math.random() * 1600;
  band.Q.value = 1.4;
  const gain = ac.createGain();
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(0.16, t + 0.006);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
  src.connect(band).connect(gain).connect(ac.destination);
  src.start(t, Math.random() * 0.1, duration + 0.02);
}

export function tearSound() {
  if (!enabled) return;
  const ac = ensure();
  if (!ac) return;
  const t = ac.currentTime;
  const src = ac.createBufferSource();
  src.buffer = noise;
  const hp = ac.createBiquadFilter();
  hp.type = 'highpass';
  hp.frequency.value = 1800;
  const gain = ac.createGain();
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(0.22, t + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
  src.connect(hp).connect(gain).connect(ac.destination);
  src.start(t, 0, 0.24);
}
