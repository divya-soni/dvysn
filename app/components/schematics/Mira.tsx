"use client";

import { useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import Ink, { MarkPaths } from "../ink/Ink";
import { drawMira, drawMiraNotes, MIRA, miraLens } from "@/lib/ink/schematics/mira";
import { svgPoint } from "@/lib/ink/motion";
import { sound } from "@/lib/sound";
import { clamp, useInk, useSvgId } from "./useInk";

const NOTES: { x: number; y: number; text: string; anchor?: "start" | "middle" | "end" }[] = [
  { x: 356, y: 322, text: "a", anchor: "middle" },
  { x: 442, y: 240, text: "b" },
  { x: 312, y: 206, text: "c", anchor: "end" },
  { x: 330, y: 292, text: "θ" },
  { x: 262, y: 150, text: "c² = a² + b²" },
  { x: 102, y: 238, text: "DEFINITION" },
  { x: 102, y: 252, text: "SAY IT PLAINLY" },
];

export default function Mira() {
  const drawing = useMemo(() => drawMira(3), []);
  const notes = useMemo(() => drawMiraNotes(), []);
  const ref = useRef<SVGSVGElement>(null);
  useInk(ref);
  const maskId = useSvgId("lens");

  const [lens, setLens] = useState({ x: MIRA.lens.x, y: MIRA.lens.y });
  const dragging = useRef(false);

  const place = (e: PointerEvent) => {
    const p = svgPoint(ref.current!, e);
    setLens({ x: clamp(p.x, 40, MIRA.w - 40), y: clamp(p.y, 50, MIRA.h - 50) });
  };
  const onDown = (e: PointerEvent<SVGCircleElement>) => {
    dragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onUp = () => {
    dragging.current = false;
  };
  const onKey = (e: KeyboardEvent<SVGSVGElement>) => {
    const step = 16;
    const moves: Record<string, [number, number]> = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] };
    const d = moves[e.key];
    if (!d) return;
    e.preventDefault();
    setLens((l) => ({ x: clamp(l.x + d[0], 40, MIRA.w - 40), y: clamp(l.y + d[1], 50, MIRA.h - 50) }));
  };

  return (
    <figure className="schematic">
      <Ink
        ref={ref}
        drawing={drawing}
        label="Mira model: an open textbook. A lens moves over the page and reveals notes explaining what is under it."
        tabIndex={0}
        onKeyDown={onKey}
        onPointerDown={() => sound.tink()}
        onPointerMove={(e) => {
          if (e.pointerType === "mouse" || dragging.current) place(e);
        }}
      >
        <defs>
          <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width={MIRA.w} height={MIRA.h}>
            <rect x="0" y="0" width={MIRA.w} height={MIRA.h} fill="black" />
            <circle cx={lens.x} cy={lens.y} r={MIRA.lens.r - 2} fill="white" />
          </mask>
        </defs>
        <g mask={`url(#${maskId})`}>
          <MarkPaths marks={notes.frames[0]} />
          {NOTES.map((n) => (
            <text key={n.text} x={n.x} y={n.y} textAnchor={n.anchor} className="amber-text">
              {n.text}
            </text>
          ))}
        </g>
        <text x={MIRA.w - 30} y={44} textAnchor="end">
          1 PAGE IMAGE ≈ 250 TOKENS
        </text>
        <g className="lens" style={{ transform: `translate(${lens.x}px, ${lens.y}px)` }}>
          <MarkPaths marks={miraLens.frames[0]} />
        </g>
        <circle
          cx={lens.x}
          cy={lens.y}
          r={MIRA.lens.r}
          className="hit"
          onPointerDown={onDown}
          onPointerUp={onUp}
          onPointerCancel={onUp}
        />
      </Ink>
      <figcaption className="toy-hint">Move the lens over the page. Mira reads a picture of the page, diagrams and all.</figcaption>
    </figure>
  );
}
