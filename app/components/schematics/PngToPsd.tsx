"use client";

import { useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import Ink from "../ink/Ink";
import { drawPngToPsd, PSD } from "@/lib/ink/schematics/pngToPsd";
import { svgPoint } from "@/lib/ink/motion";
import { sound } from "@/lib/sound";
import { clamp, useInk } from "./useInk";

export default function PngToPsd() {
  const drawing = useMemo(() => drawPngToPsd(3), []);
  const ref = useRef<SVGSVGElement>(null);
  useInk(ref);

  const [t, setT] = useState(PSD.initial);
  const pressed = useRef(false);
  const { base, step, layers } = PSD;

  const follow = (e: PointerEvent<SVGSVGElement>) => {
    if (e.pointerType !== "mouse" && !pressed.current) return;
    const p = svgPoint(ref.current!, e);
    const next = clamp((p.x - 60) / 320, 0, 1);
    if (Math.round(next * 4) !== Math.round(t * 4)) sound.paper();
    setT(next);
  };
  const onKey = (e: KeyboardEvent<SVGSVGElement>) => {
    if (e.key === "ArrowRight") setT((v) => clamp(v + 0.1, 0, 1));
    else if (e.key === "ArrowLeft") setT((v) => clamp(v - 0.1, 0, 1));
    else return;
    e.preventDefault();
    sound.paper();
  };

  const offset = (i: number) => ({ x: i * step.x * t, y: i * step.y * t });
  const layerStyle = Object.fromEntries(
    layers.map((_, i) => [`l-${i}`, { transform: `translate(${offset(i).x}px, ${offset(i).y}px)` }]),
  );

  return (
    <figure className="schematic">
      <Ink
        ref={ref}
        drawing={drawing}
        layerStyle={layerStyle}
        label="PNG to PSD model: one picture split into four layers, sky, hills, sun and tree. Move across the drawing or use the arrow keys to fan them apart."
        tabIndex={0}
        onKeyDown={onKey}
        onPointerMove={follow}
        onPointerDown={(e) => {
          pressed.current = true;
          follow(e);
        }}
        onPointerUp={() => (pressed.current = false)}
        onPointerLeave={() => (pressed.current = false)}
      >
        <text x={24} y={44}>
          PNG → PSD · {layers.length} LAYERS
        </text>
        {layers.map((name, i) => (
          <text
            key={name}
            x={base.x + base.w + 10 + offset(i).x}
            y={base.y + 14 + offset(i).y}
            className="layer-label"
            style={{ opacity: Math.max(0, t * 1.4 - 0.2) }}
          >
            {i + 1} · {name}
          </text>
        ))}
        <text x={24} y={404} className="tiny">
          {t < 0.15 ? "ONE FLAT IMAGE" : "SEGMENTED, CLEANED UP, STACKED"}
        </text>
      </Ink>
      <figcaption className="toy-hint">Move across the picture to pull the layers apart.</figcaption>
    </figure>
  );
}
