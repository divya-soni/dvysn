import { rng, sketch } from "../sketch";

export const CLIVE = {
  w: 480,
  h: 420,
  frame: { x: 40, y: 30, w: 400, h: 172 },
  thumbs: { y: 222, h: 34, n: 6 },
  line: { x0: 40, x1: 440, y: 286 },
  minutes: 45,
  initial: 0.3,
};

/** A video, its scenes, and a timeline. Everything past the playhead stays hatched over. */
export function drawClive(frames = 3) {
  const { frame, thumbs, line } = CLIVE;
  const r = rng(5);
  return sketch(
    CLIVE.w,
    CLIVE.h,
    (p) => {
      p.rect(frame.x, frame.y, frame.w, frame.h, { width: 1.4, roughness: 0.9 });
      p.curve(
        [
          [frame.x + 6, frame.y + 150],
          [frame.x + 120, frame.y + 104],
          [frame.x + 230, frame.y + 140],
          [frame.x + 394, frame.y + 92],
        ],
        { tone: "pencil", width: 1, roughness: 1 },
      );
      p.circle(frame.x + 320, frame.y + 48, 30, { tone: "pencil", width: 1, roughness: 0.8, fill: "hachure", gap: 4, weight: 0.6 });
      p.poly(
        [
          [222, 92],
          [222, 140],
          [262, 116],
        ],
        { width: 1.6, roughness: 0.8 },
      );
      const tw = (line.x1 - line.x0 - (thumbs.n - 1) * 8) / thumbs.n;
      for (let k = 0; k < thumbs.n; k++) {
        const x = line.x0 + k * (tw + 8);
        p.rect(x, thumbs.y, tw, thumbs.h, { width: 1, roughness: 0.7 });
        const h = 6 + r() * 14;
        p.line(x + 6, thumbs.y + thumbs.h - 6, x + tw / 2, thumbs.y + thumbs.h - 6 - h, { tone: "pencil", width: 0.9, roughness: 0.6, single: true });
        p.line(x + tw / 2, thumbs.y + thumbs.h - 6 - h, x + tw - 6, thumbs.y + thumbs.h - 8, { tone: "pencil", width: 0.9, roughness: 0.6, single: true });
      }
      p.line(line.x0, line.y, line.x1, line.y, { width: 1.5, roughness: 0.6 });
      for (let k = 0; k <= 9; k++) {
        const x = line.x0 + (k * (line.x1 - line.x0)) / 9;
        p.line(x, line.y - 4, x, line.y + 4, { tone: "pencil", width: 0.8, roughness: 0.3, single: true });
      }
    },
    { seed: 47, frames },
  );
}

export function drawCliveSpoilers() {
  const { line, thumbs } = CLIVE;
  return sketch(
    CLIVE.w,
    CLIVE.h,
    (p) => {
      p.rect(line.x0 - 2, thumbs.y - 6, line.x1 - line.x0 + 4, line.y - thumbs.y + 14, {
        tone: "pencil",
        outline: false,
        fill: "hachure",
        gap: 3.4,
        angle: -45,
        weight: 1,
        roughness: 1.2,
      });
    },
    { seed: 53, frames: 1 },
  );
}

export const clivePlayhead = sketch(
  20,
  100,
  (p) => {
    p.line(0, CLIVE.thumbs.y - 10, 0, CLIVE.line.y + 10, { tone: "amber", width: 1.8, roughness: 0.5 });
    p.circle(0, CLIVE.line.y, 11, { tone: "amber", fill: "solid", width: 1, roughness: 0.5 });
  },
  { seed: 59, frames: 1 },
);
