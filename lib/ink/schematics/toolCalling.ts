import { sketch, type Pen } from "../sketch";

export const TC = {
  w: 480,
  h: 420,
  token: { x: 24, y: 196, w: 196, h: 34 },
  root: { x: 290, y: 78 },
  trunkX: 300,
  slots: 6,
  slotY: (k: number) => 132 + k * 40,
};

/** A model's text stream on the left, a folder tree on the right. */
export function drawToolCalling(frames = 3, occupied = 2) {
  const { token, trunkX, slotY } = TC;
  return sketch(
    TC.w,
    TC.h,
    (p) => {
      const lines = [168, 140, 182, 120, 156];
      lines.forEach((len, i) => p.line(28, 86 + i * 20, 28 + len, 86 + i * 20, { tone: "pencil", width: 1, roughness: 0.6, single: true }));
      p.rect(token.x, token.y, token.w, token.h, { tone: "amber", width: 1.4, roughness: 0.9 });
      [150, 96].forEach((len, i) => p.line(28, 262 + i * 20, 28 + len, 262 + i * 20, { tone: "pencil", width: 1, roughness: 0.6, single: true }));
      // arrow from token to the tree
      p.curve(
        [
          [token.x + token.w + 6, token.y + token.h / 2],
          [250, token.y + 6],
          [272, 150],
        ],
        { width: 1.1, roughness: 0.6 },
      );
      p.line(272, 150, 263, 146, { width: 1.1, roughness: 0.4, single: true });
      p.line(272, 150, 268, 141, { width: 1.1, roughness: 0.4, single: true });
      // root folder and trunk
      folder(p, TC.root.x, TC.root.y);
      p.line(trunkX, 104, trunkX, slotY(TC.slots - 1), { tone: "pencil", width: 0.9, roughness: 0.6 });
      for (let k = 0; k < TC.slots; k++) {
        const layer = `slot-${k}`;
        if (frames === 1 && k >= occupied) continue;
        p.line(trunkX, slotY(k), trunkX + 18, slotY(k), { tone: "pencil", width: 0.9, roughness: 0.5, single: true, layer });
        folder(p, trunkX + 22, slotY(k) - 10, layer);
      }
    },
    { seed: 29, frames },
  );
}

function folder(p: Pen, x: number, y: number, layer?: string) {
  p.poly(
    [
      [x, y + 4],
      [x + 9, y + 4],
      [x + 12, y],
      [x + 24, y],
      [x + 24, y + 19],
      [x, y + 19],
    ],
    { width: 1.1, roughness: 0.7, layer },
  );
  p.line(x, y + 7, x + 24, y + 7, { width: 0.8, roughness: 0.4, single: true, layer });
}
