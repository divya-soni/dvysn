"use client";

import { useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import Ink, { MarkPaths } from "../ink/Ink";
import { CLIVE, clivePlayhead, drawClive, drawCliveSpoilers } from "@/lib/ink/schematics/clive";
import { svgPoint } from "@/lib/ink/motion";
import { clamp, useInk, useSvgId } from "./useInk";

function clock(t: number) {
  const s = Math.round(t * CLIVE.minutes * 60);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

export default function Clive() {
  const drawing = useMemo(() => drawClive(3), []);
  const spoilers = useMemo(() => drawCliveSpoilers(), []);
  const ref = useRef<SVGSVGElement>(null);
  useInk(ref);
  const clipId = useSvgId("spoil");

  const [t, setT] = useState(CLIVE.initial);
  const dragging = useRef(false);
  const { line, thumbs } = CLIVE;
  const x = line.x0 + t * (line.x1 - line.x0);

  const seek = (e: PointerEvent) => {
    const p = svgPoint(ref.current!, e);
    setT(clamp((p.x - line.x0) / (line.x1 - line.x0), 0, 1));
  };
  const onKey = (e: KeyboardEvent<SVGSVGElement>) => {
    if (e.key === "ArrowRight") setT((v) => clamp(v + 0.02, 0, 1));
    else if (e.key === "ArrowLeft") setT((v) => clamp(v - 0.02, 0, 1));
    else return;
    e.preventDefault();
  };

  const done = t >= 0.995;

  return (
    <figure className="schematic">
      <Ink
        ref={ref}
        drawing={drawing}
        label={`Clive model. The playhead is at ${clock(t)} of ${CLIVE.minutes} minutes; everything after it is hidden. Use the arrow keys to move it.`}
        tabIndex={0}
        onKeyDown={onKey}
      >
        <defs>
          <clipPath id={clipId}>
            <rect x={x} y={0} width={Math.max(0, CLIVE.w - x)} height={CLIVE.h} />
          </clipPath>
        </defs>
        <g clipPath={`url(#${clipId})`}>
          <MarkPaths marks={spoilers.frames[0]} />
        </g>
        <g className="playhead" style={{ transform: `translateX(${x}px)` }}>
          <MarkPaths marks={clivePlayhead.frames[0]} />
        </g>
        <text x={line.x0} y={line.y + 26} className="tiny">
          0:00
        </text>
        <text x={line.x1} y={line.y + 26} textAnchor="end" className="tiny">
          {CLIVE.minutes}:00
        </text>
        <text x={clamp(x, line.x0 + 34, line.x1 - 40)} y={line.y + 26} textAnchor="middle" className="hi">
          {clock(t)}
        </text>
        <text x={line.x0} y={356}>YOU › WHO WINS IN THE END?</text>
        <text x={line.x0} y={378} className="hi" aria-live="polite">
          {done ? "CLIVE › YOU'VE SEEN IT ALL. ASK ME ANYTHING." : `CLIVE › NO SPOILERS. YOU'RE AT ${clock(t)}.`}
        </text>
        <rect
          x={line.x0 - 10}
          y={thumbs.y - 12}
          width={line.x1 - line.x0 + 20}
          height={line.y - thumbs.y + 30}
          className="hit scrub"
          onPointerDown={(e) => {
            dragging.current = true;
            e.currentTarget.setPointerCapture(e.pointerId);
            seek(e);
          }}
          onPointerMove={(e) => dragging.current && seek(e)}
          onPointerUp={() => (dragging.current = false)}
          onPointerCancel={() => (dragging.current = false)}
        />
      </Ink>
      <figcaption className="toy-hint">Drag along the timeline. Clive only talks about what you have already watched.</figcaption>
    </figure>
  );
}
