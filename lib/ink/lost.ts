import { sketch } from "./sketch";

export const LOST = {
  w: 640,
  h: 320,
  ground: 238,
  start: 205,
  end: 400,
  sign: { x: 556, y: 162 },
  prints: Array.from({ length: 10 }, (_, k) => 242 + k * 16),
  /** where the robot holds the map, relative to its feet */
  map: { x: 68, y: -72 },
};

/** The page-not-found scene: footprints going in circles, and a signpost home. */
export function drawLost(frames = 3) {
  const { ground, sign } = LOST;
  return sketch(
    LOST.w,
    LOST.h,
    (p) => {
      for (const [x1, y1, x2, y2] of [
        [20, ground + 2, 180, ground],
        [236, ground + 1, 420, ground - 1],
        [452, ground + 2, 628, ground],
      ]) {
        p.line(x1, y1, x2, y2, { tone: "pencil", roughness: 1.2, width: 0.8 });
      }
      for (const [tx, ty] of [
        [34, 256],
        [396, 298],
        [470, 268],
        [602, 262],
      ]) {
        for (let k = 0; k < 4; k++) {
          const a = ((-120 + k * 20) * Math.PI) / 180;
          p.line(tx + k * 2, ty, tx + k * 2 + 11 * Math.cos(a), ty + 11 * Math.sin(a), { tone: "pencil", roughness: 0.8, width: 0.8, single: true });
        }
      }

      // two and a bit laps around the same spot
      const n = 46;
      for (let k = 0; k < n; k++) {
        const t = k / (n - 1);
        const th = t * 4.4 * Math.PI + 0.6;
        const rx = 92 + t * 74;
        const ry = 14 + t * 24;
        const x = LOST.start + rx * Math.cos(th);
        const y = 274 + ry * Math.sin(th);
        const dx = -rx * Math.sin(th);
        const dy = ry * Math.cos(th);
        const len = Math.hypot(dx, dy) || 1;
        const side = k % 2 ? 1 : -1;
        const sc = 0.8 + 0.2 * (Math.sin(th) + 1);
        p.ellipse(x - (dy / len) * 3.6 * sc * side, y + (dx / len) * 3.6 * sc * side, 8 * sc, 4.6 * sc, { roughness: 0.7, width: 0.85 });
      }

      LOST.prints.forEach((x, k) => {
        p.ellipse(x, ground + (k % 2 ? 4 : -1), 6, 3.5, { roughness: 0.7, width: 0.85, layer: `fp-${k}` });
      });

      p.line(sign.x, ground + 2, sign.x + 2, sign.y + 16, { width: 1.6, roughness: 0.9 });
      const board: [number, number][] = [
        [sign.x - 40, sign.y - 16],
        [sign.x + 32, sign.y - 16],
        [sign.x + 48, sign.y],
        [sign.x + 32, sign.y + 16],
        [sign.x - 40, sign.y + 16],
      ];
      p.poly(board, { width: 1.3, roughness: 0.9 });
      p.poly(board, { tone: "amber", width: 2, roughness: 0.7, layer: "sign-lit" });
    },
    { seed: 131, frames },
  );
}

/** A folded map, drawn around (0, 0) so it can be turned the right way up. */
export function drawMap(frames = 3) {
  return sketch(
    80,
    60,
    (p) => {
      p.rect(-30, -22, 60, 44, { width: 1.2, roughness: 0.8 });
      p.line(-10, -21, -10, 21, { tone: "pencil", width: 0.7, roughness: 0.4, single: true });
      p.line(10, -21, 10, 21, { tone: "pencil", width: 0.7, roughness: 0.4, single: true });
      p.curve(
        [
          [-24, 15],
          [-12, -1],
          [2, 11],
          [18, 0],
        ],
        { tone: "pencil", width: 1, roughness: 0.6, dash: [2, 3] },
      );
      p.line(14, -4, 22, 4, { width: 1.2, roughness: 0.4, single: true });
      p.line(22, -4, 14, 4, { width: 1.2, roughness: 0.4, single: true });
      p.line(-23, -8, -23, -18, { width: 0.9, roughness: 0.3, single: true });
      p.line(-23, -18, -26, -14, { width: 0.9, roughness: 0.3, single: true });
      p.line(-23, -18, -20, -14, { width: 0.9, roughness: 0.3, single: true });
    },
    { seed: 137, frames },
  );
}
