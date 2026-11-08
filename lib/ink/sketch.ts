import rough from "roughjs";
import type { Drawable, Options } from "roughjs/bin/core";

/**
 * Hand-drawn SVG geometry built on Rough.js.
 *
 * A drawing is generated several times with different seeds ("frames"); swapping
 * between them a few times a second gives the boiling-line look of hand-drawn
 * animation. Everything here is pure and seeded, so the same drawing comes out
 * identical on the server and in the browser.
 */

export type Tone = "ink" | "pencil" | "amber";

export interface Mark {
  d: string;
  tone: Tone;
  /** stroke width; 0 means no stroke */
  w: number;
  /** filled with currentColor */
  fill: boolean;
  dash?: string;
  layer?: string;
}

export interface Drawing {
  w: number;
  h: number;
  frames: Mark[][];
}

export interface PenOpts {
  tone?: Tone;
  layer?: string;
  roughness?: number;
  bowing?: number;
  width?: number;
  /** draw the outline (default true) */
  outline?: boolean;
  fill?: "hachure" | "cross-hatch" | "solid" | "zigzag" | "dots";
  gap?: number;
  angle?: number;
  weight?: number;
  dash?: number[];
  /** one pass instead of rough's default double stroke; halves the path data */
  single?: boolean;
}

type Pt = [number, number];

const gen = rough.generator();

/**
 * Rounds path numbers to one decimal. Keeps the markup small, and keeps server
 * and browser output identical even when their floating point differs in the
 * last digits.
 */
function tidy(d: string) {
  return d.replace(/-?\d*\.?\d+(?:e[-+]?\d+)?/gi, (n) => {
    const v = Math.round(Number(n) * 10) / 10;
    return Object.is(v, -0) ? "0" : String(v);
  });
}

export class Pen {
  marks: Mark[] = [];
  private k = 0;

  constructor(private seed: number) {}

  private opts(o: PenOpts): Options {
    const r: Options = {
      roughness: o.roughness ?? 1,
      bowing: o.bowing ?? 1,
      strokeWidth: o.width ?? 1,
      stroke: o.outline === false ? "none" : "currentColor",
      seed: this.seed + ++this.k * 13,
      fixedDecimalPlaceDigits: 1,
      disableMultiStroke: o.single ?? false,
    };
    if (o.fill) {
      r.fill = "currentColor";
      r.fillStyle = o.fill;
      if (o.gap !== undefined) r.hachureGap = o.gap;
      if (o.angle !== undefined) r.hachureAngle = o.angle;
      if (o.weight !== undefined) r.fillWeight = o.weight;
    }
    return r;
  }

  private add(drawable: Drawable, o: PenOpts) {
    for (const p of gen.toPaths(drawable)) {
      const stroked = p.stroke !== "none" && p.strokeWidth > 0;
      const filled = !!p.fill && p.fill !== "none";
      if (!stroked && !filled) continue;
      this.marks.push({
        d: tidy(p.d),
        tone: o.tone ?? "ink",
        w: stroked ? Math.round(p.strokeWidth * 100) / 100 : 0,
        fill: filled,
        dash: stroked && o.dash ? o.dash.join(" ") : undefined,
        layer: o.layer,
      });
    }
    return this;
  }

  line(x1: number, y1: number, x2: number, y2: number, o: PenOpts = {}) {
    return this.add(gen.line(x1, y1, x2, y2, this.opts(o)), o);
  }
  circle(x: number, y: number, d: number, o: PenOpts = {}) {
    return this.add(gen.circle(x, y, d, this.opts(o)), o);
  }
  ellipse(x: number, y: number, w: number, h: number, o: PenOpts = {}) {
    return this.add(gen.ellipse(x, y, w, h, this.opts(o)), o);
  }
  rect(x: number, y: number, w: number, h: number, o: PenOpts = {}) {
    return this.add(gen.rectangle(x, y, w, h, this.opts(o)), o);
  }
  arc(x: number, y: number, w: number, h: number, a0: number, a1: number, o: PenOpts = {}) {
    return this.add(gen.arc(x, y, w, h, a0, a1, false, this.opts(o)), o);
  }
  poly(points: Pt[], o: PenOpts = {}) {
    return this.add(gen.polygon(points, this.opts(o)), o);
  }
  curve(points: Pt[], o: PenOpts = {}) {
    return this.add(gen.curve(points, this.opts(o)), o);
  }
}

export function sketch(
  w: number,
  h: number,
  draw: (pen: Pen, frame: number) => void,
  { seed = 1, frames = 3 }: { seed?: number; frames?: number } = {},
): Drawing {
  const out: Mark[][] = [];
  for (let f = 0; f < frames; f++) {
    const pen = new Pen(seed + f * 1009);
    draw(pen, f);
    out.push(pen.marks);
  }
  return { w, h, frames: out };
}

export const rad = (deg: number) => (deg * Math.PI) / 180;

export function polar(cx: number, cy: number, r: number, a: number): Pt {
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
}

/** Small seeded PRNG for layout jitter that must match across frames and renders. */
export function rng(seed: number) {
  let a = seed | 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Footprints along a quadratic curve, alternating left and right. */
export function footprints(
  pen: Pen,
  p0: Pt,
  p1: Pt,
  p2: Pt,
  n: number,
  s0: number,
  s1: number,
  o: PenOpts = {},
  layerFor?: (k: number) => string,
) {
  for (let k = 0; k < n; k++) {
    const t = n === 1 ? 0 : k / (n - 1);
    const u = 1 - t;
    const x = u * u * p0[0] + 2 * u * t * p1[0] + t * t * p2[0];
    const y = u * u * p0[1] + 2 * u * t * p1[1] + t * t * p2[1];
    const dx = 2 * u * (p1[0] - p0[0]) + 2 * t * (p2[0] - p1[0]);
    const dy = 2 * u * (p1[1] - p0[1]) + 2 * t * (p2[1] - p1[1]);
    const len = Math.hypot(dx, dy) || 1;
    const side = k % 2 ? 1 : -1;
    const sc = s0 + (s1 - s0) * t;
    pen.ellipse(
      x + (-dy / len) * 4.5 * sc * side,
      y + (dx / len) * 4.5 * sc * side,
      8 * sc,
      4.6 * sc,
      { roughness: 0.7, width: 0.85, ...o, layer: layerFor ? layerFor(k) : o.layer },
    );
  }
}
