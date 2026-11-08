import { rng, sketch } from "../sketch";

export const MIRA = {
  w: 480,
  h: 420,
  lens: { r: 54, x: 362, y: 238 },
  tri: { ax: 288, ay: 300, bx: 424, by: 300, cx: 424, cy: 172 },
};

/** An open textbook: a page of text on the left, a diagram on the right. */
export function drawMira(frames = 3) {
  const { tri } = MIRA;
  const r = rng(7);
  const left = Array.from({ length: 12 }, () => 120 + r() * 70);
  const right = Array.from({ length: 3 }, () => 110 + r() * 60);
  return sketch(
    MIRA.w,
    MIRA.h,
    (p) => {
      p.poly(
        [
          [30, 74],
          [236, 62],
          [236, 352],
          [30, 346],
        ],
        { width: 1.2, roughness: 0.9 },
      );
      p.poly(
        [
          [244, 62],
          [450, 74],
          [450, 346],
          [244, 352],
        ],
        { width: 1.2, roughness: 0.9 },
      );
      p.curve(
        [
          [240, 58],
          [236, 200],
          [240, 356],
        ],
        { tone: "pencil", width: 1, roughness: 0.6 },
      );
      p.line(48, 100, 150, 98, { width: 2, roughness: 0.6, single: true });
      left.forEach((len, i) => {
        const y = 128 + i * 17 + (i > 5 ? 10 : 0);
        p.line(48, y, 48 + len - (i === 5 || i === 11 ? 60 : 0), y - 1, { tone: "pencil", width: 1, roughness: 0.6, single: true });
      });
      // diagram: a right triangle with a hatched face
      p.poly(
        [
          [tri.ax, tri.ay],
          [tri.bx, tri.by],
          [tri.cx, tri.cy],
        ],
        { width: 1.4, roughness: 0.8, fill: "hachure", gap: 6, angle: -40, weight: 0.6 },
      );
      p.rect(tri.bx - 12, tri.by - 12, 12, 12, { width: 0.9, roughness: 0.4 });
      p.arc(tri.ax, tri.ay, 60, 60, -0.75, 0, { width: 0.9, roughness: 0.5 });
      p.line(262, 96, 380, 96, { width: 1.6, roughness: 0.6, single: true });
      right.forEach((len, i) => p.line(262, 318 + i * 13, 262 + len, 317 + i * 13, { tone: "pencil", width: 1, roughness: 0.6, single: true }));
    },
    { seed: 37, frames },
  );
}

/** Notes the lens reveals: Mira explaining the diagram. */
export function drawMiraNotes() {
  const { tri } = MIRA;
  return sketch(
    MIRA.w,
    MIRA.h,
    (p) => {
      p.line(tri.ax + 2, tri.ay + 10, tri.bx - 2, tri.by + 10, { tone: "amber", width: 1, roughness: 0.6 });
      p.line(tri.bx + 10, tri.by - 2, tri.cx + 10, tri.cy + 2, { tone: "amber", width: 1, roughness: 0.6 });
      p.line(338, 226, 318, 210, { tone: "amber", width: 1, roughness: 0.6, single: true });
      p.circle(tri.ax + 40, tri.ay - 12, 16, { tone: "amber", width: 1, roughness: 0.8 });
      p.line(92, 140, 92, 220, { tone: "amber", width: 1, roughness: 0.6 });
      p.line(92, 140, 98, 140, { tone: "amber", width: 1, roughness: 0.4, single: true });
      p.line(92, 220, 98, 220, { tone: "amber", width: 1, roughness: 0.4, single: true });
    },
    { seed: 41, frames: 1 },
  );
}

export const miraLens = sketch(
  140,
  140,
  (p) => {
    p.circle(0, 0, MIRA.lens.r * 2, { width: 1.8, roughness: 0.8 });
    p.circle(0, 0, MIRA.lens.r * 2 + 8, { tone: "pencil", width: 0.8, roughness: 0.6 });
    p.line(40, 40, 64, 64, { width: 3, roughness: 0.5 });
  },
  { seed: 43, frames: 1 },
);
