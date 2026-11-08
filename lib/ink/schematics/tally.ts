import { rng, sketch } from "../sketch";

export const TALLY = {
  w: 480,
  h: 420,
  bubble: { x: 22, y: 44, w: 196, h: 64 },
  wave: { x0: 32, x1: 206, y: 196, bars: 30 },
  sheet: { x: 254, y: 52, w: 208, h: 318 },
  cols: [262, 314, 394],
  rowY: (k: number) => 116 + k * 32,
  rows: 7,
};

/** A message and its voice waveform on the left, the expense sheet on the right. */
export function drawTally(frames = 3) {
  const { bubble, wave, sheet, cols, rowY } = TALLY;
  const r = rng(12);
  const heights = Array.from({ length: wave.bars }, (_, i) => 6 + r() * 34 * Math.sin((i / wave.bars) * Math.PI) + 4);
  return sketch(
    TALLY.w,
    TALLY.h,
    (p) => {
      p.rect(bubble.x, bubble.y, bubble.w, bubble.h, { width: 1.2, roughness: 0.9 });
      p.line(bubble.x + 26, bubble.y + bubble.h, bubble.x + 20, bubble.y + bubble.h + 14, { width: 1.1, roughness: 0.5, single: true });
      p.line(bubble.x + 20, bubble.y + bubble.h + 14, bubble.x + 42, bubble.y + bubble.h, { width: 1.1, roughness: 0.5, single: true });
      heights.forEach((h, i) => {
        const x = wave.x0 + (i * (wave.x1 - wave.x0)) / (wave.bars - 1);
        p.line(x, wave.y - h / 2, x, wave.y + h / 2, { width: 1.3, roughness: 0.5, single: true, layer: "wave" });
      });
      p.line(214, wave.y, 244, wave.y, { width: 1.1, roughness: 0.4, single: true });
      p.line(244, wave.y, 236, wave.y - 5, { width: 1.1, roughness: 0.3, single: true });
      p.line(244, wave.y, 236, wave.y + 5, { width: 1.1, roughness: 0.3, single: true });
      // the sheet
      p.rect(sheet.x, sheet.y, sheet.w, sheet.h, { width: 1.3, roughness: 0.9 });
      p.line(sheet.x, 92, sheet.x + sheet.w, 92, { width: 1, roughness: 0.5 });
      for (let k = 0; k < TALLY.rows; k++) {
        p.line(sheet.x + 4, rowY(k) + 10, sheet.x + sheet.w - 4, rowY(k) + 10, { tone: "pencil", width: 0.7, roughness: 0.5, single: true });
      }
      p.line(cols[1] - 6, sheet.y + 4, cols[1] - 6, sheet.y + sheet.h - 40, { tone: "pencil", width: 0.7, roughness: 0.5, single: true });
      p.line(cols[2] - 6, sheet.y + 4, cols[2] - 6, sheet.y + sheet.h - 40, { tone: "pencil", width: 0.7, roughness: 0.5, single: true });
      p.line(sheet.x, sheet.y + sheet.h - 36, sheet.x + sheet.w, sheet.y + sheet.h - 36, { width: 1, roughness: 0.5 });
    },
    { seed: 31, frames },
  );
}
