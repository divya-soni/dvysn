import { footprints, sketch } from "./sketch";

export const SCENE = {
  w: 720,
  h: 300,
  ground: 238,
  start: 300,
  min: 300,
  max: 536,
  prints: Array.from({ length: 14 }, (_, k) => 318 + k * 16),
  eye: { x: 6, y: -106 },
  key: { x: -39, y: -66 },
};

/** The landscape: ground, grass, a tree, and the trail the robot already walked. */
export function drawScene(frames = 3) {
  const { ground } = SCENE;
  return sketch(
    SCENE.w,
    SCENE.h,
    (p) => {
      for (const [x1, y1, x2, y2] of [
        [150, ground + 1, 330, ground - 1],
        [356, ground + 2, 470, ground],
        [496, ground + 2, 700, ground - 1],
      ]) {
        p.line(x1, y1, x2, y2, { tone: "pencil", roughness: 1.2, width: 0.8 });
      }
      for (const [tx, ty] of [
        [110, 262],
        [250, 276],
        [560, 262],
        [652, 272],
        [330, 292],
        [470, 284],
      ]) {
        for (let k = 0; k < 4; k++) {
          const a = ((-120 + k * 20) * Math.PI) / 180;
          p.line(tx + k * 2, ty, tx + k * 2 + 11 * Math.cos(a), ty + 11 * Math.sin(a), { tone: "pencil", roughness: 0.8, width: 0.8, single: true });
        }
      }
      for (let k = 0; k < 10; k++) {
        const bx = 604 + k * 5.5;
        const top = 18 + (k % 3) * 14;
        const lean = -58 + k * 11;
        p.curve(
          [
            [bx, ground + 2],
            [bx - 6 + k, 150],
            [bx + lean, top],
          ],
          { tone: k % 3 ? "pencil" : "ink", roughness: 1.1, width: k % 3 ? 0.8 : 1.1 },
        );
      }
      for (let b = 0; b < 7; b++) {
        p.line(594 + b * 9, ground + 2, 586 + b * 11, ground - 14 - (b % 2) * 6, { roughness: 1.4, width: 0.9, single: true });
      }
      footprints(p, [40, 296], [170, 264], [282, 244], 10, 1.35, 0.8);
      SCENE.prints.forEach((x, k) => {
        p.ellipse(x, ground + (k % 2 ? 4 : -1), 8 * 0.75, 4.6 * 0.75, { roughness: 0.7, width: 0.85, layer: `fp-${k}` });
      });
    },
    { seed: 89, frames },
  );
}

/** The tin robot, drawn around its feet at (0, 0) so it can walk. */
export function drawRobot(frames = 3) {
  return sketch(
    80,
    150,
    (p) => {
      p.ellipse(2, 2, 62, 9, { tone: "pencil", outline: false, fill: "hachure", gap: 3, angle: 0, roughness: 1 });
      p.line(-12, -40, -15, -6, { roughness: 0.8, width: 1.3, layer: "leg-l" });
      p.ellipse(-17, -3, 13, 5.5, { roughness: 0.7, width: 1.1, layer: "leg-l" });
      p.line(12, -40, 15, -7, { roughness: 0.8, width: 1.3, layer: "leg-r" });
      p.ellipse(18, -4, 13, 5.5, { roughness: 0.7, width: 1.1, layer: "leg-r" });
      p.rect(-23, -88, 46, 48, { roughness: 1.2, width: 1.4 });
      p.poly(
        [
          [9, -85],
          [21, -85],
          [21, -42],
          [9, -42],
        ],
        { outline: false, fill: "hachure", angle: -50, gap: 3, weight: 0.7, roughness: 1 },
      );
      p.circle(-6, -68, 13, { roughness: 0.8, width: 0.9 });
      p.line(-6, -68, -2, -72, { roughness: 0.3, width: 0.8, single: true });
      p.line(-23, -66, -34, -66, { roughness: 0.6, width: 1.2 });
      p.ellipse(-39, -72, 7, 11, { roughness: 0.7, width: 1, layer: "key" });
      p.ellipse(-39, -60, 7, 11, { roughness: 0.7, width: 1, layer: "key" });
      p.line(23, -76, 37, -59, { roughness: 0.7, width: 1.2, layer: "arm" });
      p.circle(38, -57, 6, { roughness: 0.6, width: 1, layer: "arm" });
      p.line(-7, -91, -7, -88, { roughness: 0.3, single: true });
      p.line(7, -91, 7, -88, { roughness: 0.3, single: true });
      p.rect(-17, -118, 34, 28, { roughness: 1.1, width: 1.4 });
      p.poly(
        [
          [9, -115],
          [15, -115],
          [15, -93],
          [9, -93],
        ],
        { outline: false, fill: "hachure", angle: -50, gap: 2.6, weight: 0.7, roughness: 1 },
      );
      p.circle(SCENE.eye.x, SCENE.eye.y, 12, { roughness: 0.6, width: 1 });
      p.line(0, -118, -2, -132, { roughness: 0.6, width: 1.1 });
      p.circle(-2, -135, 6, { fill: "solid", roughness: 0.5 });
      p.arc(-2, -135, 22, 22, (-140 * Math.PI) / 180, (-40 * Math.PI) / 180, { tone: "pencil", roughness: 0.8, width: 0.9, layer: "signal" });
      p.arc(-2, -135, 38, 38, (-135 * Math.PI) / 180, (-45 * Math.PI) / 180, { tone: "pencil", roughness: 0.8, width: 0.9, layer: "signal" });
    },
    { seed: 97, frames },
  );
}
