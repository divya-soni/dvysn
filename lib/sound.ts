/**
 * Every sound on the site, synthesised in the browser with the Web Audio API,
 * so there are no audio files to load. Sounds only ever follow something the
 * visitor did, and browsers refuse audio before a first click or key press.
 */

const STORAGE_KEY = "sound";
const VOLUME = 0.7;

let muted = false;
let loaded = false;
const listeners = new Set<() => void>();

let ctx: AudioContext | null = null;
let out: GainNode | null = null;
let noise: AudioBuffer | null = null;

export function isMuted() {
  if (!loaded && typeof window !== "undefined") {
    loaded = true;
    try {
      muted = localStorage.getItem(STORAGE_KEY) === "off";
    } catch {}
  }
  return muted;
}

export function setMuted(next: boolean) {
  muted = next;
  loaded = true;
  try {
    localStorage.setItem(STORAGE_KEY, next ? "off" : "on");
  } catch {}
  // cut anything still ringing, such as the long power-on
  if (ctx && out) out.gain.setTargetAtTime(next ? 0 : VOLUME, ctx.currentTime, 0.01);
  listeners.forEach((l) => l());
}

export function subscribeSound(listener: () => void) {
  const onStorage = (e: StorageEvent) => {
    if (e.key !== STORAGE_KEY) return;
    muted = e.newValue === "off";
    listener();
  };
  listeners.add(listener);
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function engine() {
  if (typeof window === "undefined" || isMuted() || !("AudioContext" in window)) return null;
  const activation = (navigator as Navigator & { userActivation?: { hasBeenActive: boolean } }).userActivation;
  if (activation && !activation.hasBeenActive) return null;
  if (!ctx || !out || !noise) {
    ctx = new AudioContext();
    out = ctx.createGain();
    out.gain.value = VOLUME;
    out.connect(ctx.destination);
    noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const data = noise.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  }
  if (ctx.state === "suspended") void ctx.resume();
  return { ctx, out, noise, now: ctx.currentTime };
}

type Engine = NonNullable<ReturnType<typeof engine>>;

function envelope(e: Engine, t: number, dur: number, gain: number, attack: number) {
  const amp = e.ctx.createGain();
  amp.gain.setValueAtTime(0.0001, t);
  amp.gain.exponentialRampToValueAtTime(gain, t + attack);
  amp.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  amp.connect(e.out);
  return amp;
}

type ToneOpts = { wave?: OscillatorType; to?: number; gain?: number; attack?: number };

function tone(e: Engine, at: number, freq: number, dur: number, { wave = "sine", to, gain = 0.2, attack = 0.003 }: ToneOpts = {}) {
  const t = e.now + at;
  const osc = e.ctx.createOscillator();
  osc.type = wave;
  osc.frequency.setValueAtTime(freq, t);
  if (to) osc.frequency.exponentialRampToValueAtTime(to, t + dur);
  osc.connect(envelope(e, t, dur, gain, attack));
  osc.start(t);
  osc.stop(t + dur + 0.02);
}

type BurstOpts = { filter?: BiquadFilterType; q?: number; to?: number; gain?: number; attack?: number };

function burst(e: Engine, at: number, freq: number, dur: number, { filter = "bandpass", q = 1, to, gain = 0.2, attack = 0.002 }: BurstOpts = {}) {
  const t = e.now + at;
  const src = e.ctx.createBufferSource();
  src.buffer = e.noise;
  const shape = e.ctx.createBiquadFilter();
  shape.type = filter;
  shape.Q.value = q;
  shape.frequency.setValueAtTime(freq, t);
  if (to) shape.frequency.exponentialRampToValueAtTime(to, t + dur);
  src.connect(shape).connect(envelope(e, t, dur, gain, attack));
  src.start(t, Math.random() * 0.6, dur + 0.02);
}

/** Short uneven strokes of noise, like a pencil moving over paper. */
function scribble(e: Engine, start: number, dur: number, gain: number) {
  let at = start;
  while (at < start + dur) {
    const len = 0.035 + Math.random() * 0.05;
    burst(e, at, 2600 + Math.random() * 1800, len, { q: 1.4, gain: gain * (0.5 + Math.random() * 0.5), attack: 0.006 });
    at += len * (0.7 + Math.random() * 0.5);
  }
}

const lastPlayed = new Map<string, number>();

function play(draw: (e: Engine) => void, name?: string, gapMs = 30) {
  if (name) {
    const now = performance.now();
    if (now - (lastPlayed.get(name) ?? -Infinity) < gapMs) return;
    lastPlayed.set(name, now);
  }
  const e = engine();
  if (e) draw(e);
}

export const sound = {
  /** the lamp switching */
  lamp: () =>
    play((e) => {
      burst(e, 0, 3400, 0.014, { q: 0.7, gain: 0.35 });
      tone(e, 0, 1100, 0.03, { wave: "square", to: 600, gain: 0.05 });
      burst(e, 0.055, 2400, 0.012, { q: 0.7, gain: 0.22 });
    }),
  /** beads of the lamp's pull chain */
  chain: () =>
    play(
      (e) => {
        [0, 0.035, 0.075, 0.125].forEach((at, i) => burst(e, at, 6200 - i * 500, 0.012, { q: 2.5, gain: 0.16 - i * 0.03 }));
      },
      "chain",
      200,
    ),
  /** the robot's key; it tightens as you wind */
  ratchet: (turns = 1) =>
    play((e) => {
      for (let i = 0; i < 3; i++) {
        burst(e, i * 0.05, 2300 + turns * 130, 0.01, { q: 3, gain: 0.24 });
        tone(e, i * 0.05, 820 + turns * 50, 0.018, { wave: "triangle", gain: 0.07 });
      }
    }),
  /** a tin foot on the path */
  step: (left: boolean) =>
    play((e) => {
      tone(e, 0, left ? 205 : 175, 0.07, { wave: "triangle", to: 110, gain: 0.16 });
      burst(e, 0, 950, 0.022, { q: 1.2, gain: 0.08 });
    }),
  /** the robot reaching the end of its path */
  tonk: () =>
    play((e) => {
      tone(e, 0, 320, 0.18, { wave: "triangle", to: 180, gain: 0.2 });
      tone(e, 0, 640, 0.1, { gain: 0.05 });
    }),
  /** typewriter keys */
  type: (keys = 1) =>
    play((e) => {
      let at = 0;
      for (let i = 0; i < keys; i++) {
        burst(e, at, 3000 + Math.random() * 900, 0.018, { q: 0.9, gain: 0.2 });
        tone(e, at, 240, 0.014, { wave: "square", gain: 0.03 });
        at += 0.055 + Math.random() * 0.045;
      }
    }),
  /** the typewriter's carriage bell */
  bell: () =>
    play((e) => {
      tone(e, 0, 1760, 0.5, { gain: 0.12 });
      tone(e, 0, 3520, 0.22, { gain: 0.04 });
    }),
  /** a sheet of paper moving */
  paper: () =>
    play(
      (e) => {
        burst(e, 0, 1800, 0.22, { q: 0.8, to: 3400, gain: 0.13, attack: 0.05 });
      },
      "paper",
      120,
    ),
  /** one detent of a dial or timeline */
  tick: () =>
    play(
      (e) => {
        burst(e, 0, 4000, 0.007, { q: 2, gain: 0.2 });
        tone(e, 0, 1800, 0.01, { wave: "triangle", gain: 0.04 });
      },
      "tick",
      25,
    ),
  promote: () =>
    play((e) => {
      tone(e, 0, 150, 0.1, { wave: "triangle", to: 95, gain: 0.2 });
      burst(e, 0, 1400, 0.03, { gain: 0.14 });
      tone(e, 0.03, 520, 0.09, { to: 780, gain: 0.07 });
    }),
  rollback: () =>
    play((e) => {
      tone(e, 0, 150, 0.1, { wave: "triangle", to: 95, gain: 0.2 });
      burst(e, 0, 1400, 0.03, { gain: 0.14 });
      tone(e, 0.03, 520, 0.09, { to: 330, gain: 0.07 });
    }),
  pop: () =>
    play((e) => {
      tone(e, 0, 420, 0.08, { to: 780, gain: 0.16 });
    }),
  whoosh: () =>
    play((e) => {
      burst(e, 0, 1200, 0.2, { q: 0.7, to: 300, gain: 0.12, attack: 0.03 });
    }),
  thud: () =>
    play((e) => {
      tone(e, 0, 110, 0.12, { wave: "triangle", to: 70, gain: 0.22 });
    }),
  /** glass, for Mira's lens */
  tink: () =>
    play(
      (e) => {
        tone(e, 0, 2400, 0.09, { gain: 0.08 });
      },
      "tink",
      120,
    ),
  /** the robot arriving at the sign */
  chime: () =>
    play((e) => {
      tone(e, 0, 660, 0.35, { gain: 0.14 });
      tone(e, 0.12, 880, 0.45, { gain: 0.14 });
    }),
  /** a pencil sketching a drawing in */
  scratch: () => play((e) => scribble(e, 0, 1.1, 0.05), "scratch", 500),
  /** relays speeding up, a rising hum, then a soft chord */
  powerOn: () =>
    play((e) => {
      let at = 0;
      for (let gap = 0.22; at < 1.05; gap *= 0.82) {
        burst(e, at, 3600, 0.01, { q: 2, gain: 0.16 });
        at += gap;
      }
      tone(e, 0, 55, 1.25, { wave: "sawtooth", to: 220, gain: 0.035, attack: 0.25 });
      tone(e, 0, 110, 1.25, { wave: "triangle", to: 440, gain: 0.09, attack: 0.25 });
      scribble(e, 0.1, 1, 0.04);
      [440, 659.25, 880].forEach((f, i) => tone(e, 1.2 + i * 0.06, f, 1.5, { gain: 0.1 - i * 0.02, attack: 0.02 }));
    }),
};
