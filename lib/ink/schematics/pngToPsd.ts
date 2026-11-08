import { sketch } from "../sketch";

export const PSD = {
  w: 480,
  h: 420,
  base: { x: 56, y: 180, w: 220, h: 160 },
  step: { x: 34, y: -28 },
  layers: ["SKY", "HILLS", "SUN", "TREE"],
  initial: 0.7,
};

/** One picture, drawn as four stacked layers that can fan apart. */
export function drawPngToPsd(frames = 3) {
  const { base } = PSD;
  const { x, y, w, h } = base;
  return sketch(
    PSD.w,
    PSD.h,
    (p) => {
      // layer 0: the sky, a full sheet
      p.rect(x, y, w, h, { width: 1.4, roughness: 0.9, layer: "l-0" });
      p.rect(x + 4, y + 4, w - 8, h - 8, { tone: "pencil", outline: false, fill: "hachure", gap: 9, angle: -20, weight: 0.6, roughness: 1, layer: "l-0" });
      // layer 1: hills
      p.rect(x, y, w, h, { tone: "pencil", width: 0.8, roughness: 0.6, dash: [3, 4], layer: "l-1" });
      p.poly(
        [
          [x + 2, y + h - 2],
          [x + 2, y + 104],
          [x + 70, y + 76],
          [x + 130, y + 110],
          [x + 190, y + 88],
          [x + w - 2, y + 100],
          [x + w - 2, y + h - 2],
        ],
        { width: 1.3, roughness: 1, fill: "hachure", gap: 4.5, angle: 30, weight: 0.7, layer: "l-1" },
      );
      // layer 2: the sun
      p.rect(x, y, w, h, { tone: "pencil", width: 0.8, roughness: 0.6, dash: [3, 4], layer: "l-2" });
      p.circle(x + 164, y + 46, 40, { width: 1.3, roughness: 0.8, fill: "cross-hatch", gap: 4, weight: 0.6, layer: "l-2" });
      // layer 3: a tree
      p.rect(x, y, w, h, { tone: "pencil", width: 0.8, roughness: 0.6, dash: [3, 4], layer: "l-3" });
      p.line(x + 62, y + 124, x + 60, y + 70, { width: 1.6, roughness: 0.8, layer: "l-3" });
      p.circle(x + 60, y + 58, 40, { width: 1.3, roughness: 1.2, fill: "hachure", gap: 3.5, angle: 60, weight: 0.7, layer: "l-3" });
    },
    { seed: 61, frames },
  );
}
