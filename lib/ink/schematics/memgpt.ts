import { polar, rad, sketch } from "../sketch";

export const MEM = {
  w: 480,
  h: 420,
  cx: 240,
  cy: 205,
  ctx: { r: 78, cap: 6 },
  recall: { r: 128, cap: 12 },
  archive: { r: 176, cap: 24 },
};

/** Three rings: active context, recall storage, archived summaries. */
export function drawMemgpt(frames = 3) {
  const { cx, cy, ctx, recall, archive } = MEM;
  return sketch(
    MEM.w,
    MEM.h,
    (p) => {
      p.circle(cx, cy, 2 * ctx.r, { width: 1.3, roughness: 0.8 });
      p.circle(cx, cy, 2 * recall.r, { width: 0.95, roughness: 0.8 });
      p.circle(cx, cy, 2 * archive.r, { tone: "pencil", width: 0.9, roughness: 0.7, dash: [3, 5] });
      for (const [a0, a1] of [
        [-0.9, 0.2],
        [1.2, 2.3],
        [3.0, 4.1],
      ]) {
        p.arc(cx, cy, 2 * (archive.r + 18), 2 * (archive.r + 18), a0, a1, { tone: "pencil", width: 1.2, roughness: 0.7, layer: "spin" });
      }
      for (let k = 0; k < 48; k++) {
        const [x1, y1] = polar(cx, cy, archive.r + 6, rad(k * 7.5));
        const [x2, y2] = polar(cx, cy, archive.r + (k % 4 === 0 ? 12 : 9), rad(k * 7.5));
        p.line(x1, y1, x2, y2, { tone: "pencil", width: 0.7, roughness: 0.3, single: true });
      }
      p.circle(cx, cy, 40, { fill: "cross-hatch", gap: 3.2, weight: 0.6, width: 1.2, roughness: 0.8 });
      // arrows showing the flow outward
      const [ax, ay] = polar(cx, cy, ctx.r + 8, rad(150));
      const [bx, by] = polar(cx, cy, recall.r - 8, rad(150));
      p.line(ax, ay, bx, by, { tone: "pencil", width: 0.8, roughness: 0.5, single: true });
      const [dx, dy] = polar(cx, cy, recall.r + 8, rad(150));
      const [ex, ey] = polar(cx, cy, archive.r - 8, rad(150));
      p.line(dx, dy, ex, ey, { tone: "pencil", width: 0.8, roughness: 0.5, single: true });
    },
    { seed: 23, frames },
  );
}

export const memMarks = {
  recall: sketch(20, 20, (p) => p.circle(0, 0, 11, { fill: "hachure", gap: 2.2, weight: 0.7, width: 1, roughness: 0.6 }), { seed: 3, frames: 1 }),
  archive: sketch(20, 20, (p) => p.circle(0, 0, 7, { fill: "solid", width: 0.9, roughness: 0.6 }), { seed: 4, frames: 1 }),
};

export function slot(tier: "ctx" | "recall" | "archive", i: number) {
  const t = MEM[tier];
  const step = 360 / t.cap;
  const offset = tier === "recall" ? step / 2 : 0;
  return polar(MEM.cx, MEM.cy, t.r, rad(-90 + offset + i * step));
}
