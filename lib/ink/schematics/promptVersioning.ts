import { polar, rad, sketch } from "../sketch";

export const PV = {
  w: 490,
  h: 420,
  cx: 190,
  cy: 205,
  versions: 7,
  r: (i: number) => 30 + i * 20,
  aProd: rad(-38),
  aStage: rad(28),
  label: [356, 62] as [number, number],
  stageLabel: [364, 322] as [number, number],
  initial: 5,
};

/** Seven rings, one per saved version. Production is a needle pointing at one of them. */
export function drawPromptVersioning(frames = 3, only?: number) {
  const { cx, cy, r, aProd, aStage, label, stageLabel } = PV;
  return sketch(
    PV.w,
    PV.h,
    (p) => {
      for (let k = 0; k < 72; k++) {
        const a = rad(k * 5);
        const [x1, y1] = polar(cx, cy, 160, a);
        const [x2, y2] = polar(cx, cy, k % 6 === 0 ? 173 : 166, a);
        p.line(x1, y1, x2, y2, { tone: "pencil", roughness: 0.35, width: 0.8, single: true });
      }
      for (const [a0, a1] of [
        [-1.25, -0.35],
        [0.5, 1.45],
        [2.2, 3.5],
      ]) {
        p.arc(cx, cy, 356, 356, a0, a1, { tone: "pencil", width: 1.3, roughness: 0.7, layer: "spin" });
      }
      p.line(cx - 156, cy, cx - 15, cy, { tone: "pencil", roughness: 0.4, width: 0.7, single: true });
      for (let i = 0; i < PV.versions; i++) p.circle(cx, cy, 2 * r(i), { roughness: 0.85, width: 0.95 });
      p.circle(cx, cy, 24, { fill: "cross-hatch", gap: 3, weight: 0.6, width: 1.2, roughness: 0.8 });

      const [c0x, c0y] = polar(cx, cy, 13, aProd);
      for (let i = 0; i < PV.versions; i++) {
        if (only !== undefined && i !== only) continue;
        const [tx, ty] = polar(cx, cy, r(i), aProd);
        p.line(c0x, c0y, tx, ty, { width: 1.8, roughness: 0.6, layer: `ptr-${i}` });
        p.line(tx + 4, ty - 4, label[0], label[1], { tone: "pencil", width: 0.8, roughness: 0.4, single: true, layer: `ptr-${i}` });
      }
      p.line(label[0], label[1], label[0] + 12, label[1], { tone: "pencil", width: 0.8, roughness: 0.3, single: true });

      const [s0x, s0y] = polar(cx, cy, 13, aStage);
      const [sx, sy] = polar(cx, cy, r(6), aStage);
      p.line(s0x, s0y, sx, sy, { tone: "pencil", width: 1.1, roughness: 0.5, dash: [4, 4] });
      p.circle(sx, sy, 8, { tone: "pencil", width: 1, roughness: 0.5 });
      p.line(sx + 4, sy + 4, stageLabel[0], stageLabel[1], { tone: "pencil", width: 0.8, roughness: 0.4, single: true });
      p.line(stageLabel[0], stageLabel[1], stageLabel[0] + 12, stageLabel[1], { tone: "pencil", width: 0.8, roughness: 0.3, single: true });
    },
    { seed: 17, frames },
  );
}

export const pvDot = sketch(20, 20, (p) => p.circle(0, 0, 11, { tone: "amber", fill: "solid", width: 1, roughness: 0.5 }), {
  seed: 9,
  frames: 1,
});
