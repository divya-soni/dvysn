import { polar, rad, sketch } from "./sketch";

/** Fired to ask for the power-on (the typed word, or the robot's antenna). */
export const JARVIS_CALL = "jarvis:call";
/** Fired when the power-on starts, so drawings can join in. */
export const JARVIS_ON = "jarvis:on";
export const JARVIS_MS = 3400;

export function callJarvis() {
  window.dispatchEvent(new Event(JARVIS_CALL));
}

/** The big hand-drawn ring that appears over the page. */
export function drawJarvisRing(frames = 3) {
  const C = 240;
  return sketch(
    480,
    480,
    (p) => {
      for (let k = 0; k < 90; k++) {
        const a = rad(k * 4);
        const [x1, y1] = polar(C, C, 200, a);
        const [x2, y2] = polar(C, C, k % 5 === 0 ? 216 : 208, a);
        p.line(x1, y1, x2, y2, { tone: "pencil", width: 0.8, roughness: 0.35, single: true });
      }
      p.circle(C, C, 392, { width: 1.5, roughness: 0.9 });
      p.circle(C, C, 336, { tone: "pencil", width: 0.9, roughness: 0.6, dash: [3, 6] });
      p.circle(C, C, 280, { width: 1.1, roughness: 0.8 });
      p.circle(C, C, 224, { tone: "pencil", width: 0.8, roughness: 0.6 });
      for (const [a0, a1] of [
        [-1.3, -0.3],
        [0.5, 1.7],
        [2.4, 3.6],
        [4.1, 4.8],
      ]) {
        p.arc(C, C, 452, 452, a0, a1, { width: 1.6, roughness: 0.7, layer: "spin" });
      }
      for (const [a0, a1] of [
        [-0.8, 0.5],
        [1.3, 2.2],
        [3.0, 4.4],
      ]) {
        p.arc(C, C, 310, 310, a0, a1, { width: 3, roughness: 0.6, layer: "spin-rev" });
      }
    },
    { seed: 101, frames },
  );
}
