"use client";

import { useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import Ink, { MarkPaths } from "../ink/Ink";
import { drawPromptVersioning, PV, pvDot } from "@/lib/ink/schematics/promptVersioning";
import { polar } from "@/lib/ink/sketch";
import { svgPoint } from "@/lib/ink/motion";
import { clamp, useInk } from "./useInk";

const nearest = (r: number) => clamp(Math.round((r - PV.r(0)) / 20), 0, PV.versions - 1);

export default function PromptVersioning() {
  const drawing = useMemo(() => drawPromptVersioning(3), []);
  const ref = useRef<SVGSVGElement>(null);
  useInk(ref);

  const [prod, setProd] = useState(PV.initial);
  const [dragR, setDragR] = useState<number | null>(null);
  const [log, setLog] = useState(`PRODUCTION SERVES v${PV.initial + 1}`);

  const shown = dragR === null ? prod : nearest(dragR);
  const [dx, dy] = polar(PV.cx, PV.cy, dragR ?? PV.r(prod), PV.aProd);

  const commit = (i: number) => {
    if (i !== prod) setLog(i > prod ? `PROMOTED v${i + 1} TO PRODUCTION` : `ROLLED BACK TO v${i + 1}`);
    setProd(i);
  };
  const radius = (e: PointerEvent) => {
    const p = svgPoint(ref.current!, e);
    return Math.hypot(p.x - PV.cx, p.y - PV.cy);
  };

  const onDown = (e: PointerEvent<SVGCircleElement>) => {
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragR(clamp(radius(e), PV.r(0), PV.r(PV.versions - 1)));
  };
  const onMove = (e: PointerEvent<SVGCircleElement>) => {
    if (dragR !== null) setDragR(clamp(radius(e), PV.r(0), PV.r(PV.versions - 1)));
  };
  const onUp = (e: PointerEvent<SVGCircleElement>) => {
    e.stopPropagation();
    if (dragR !== null) commit(nearest(dragR));
    setDragR(null);
  };
  const onClickRing = (e: PointerEvent<SVGSVGElement>) => {
    const r = radius(e);
    if (r > PV.r(0) - 10 && r < PV.r(PV.versions - 1) + 10) commit(nearest(r));
  };
  const onKey = (e: KeyboardEvent<SVGSVGElement>) => {
    if (e.key === "ArrowUp" || e.key === "ArrowRight") commit(Math.min(prod + 1, PV.versions - 1));
    else if (e.key === "ArrowDown" || e.key === "ArrowLeft") commit(Math.max(prod - 1, 0));
    else return;
    e.preventDefault();
  };

  const layerStyle = {
    spin: { transformOrigin: `${PV.cx}px ${PV.cy}px` },
    ...Object.fromEntries(Array.from({ length: PV.versions }, (_, i) => [`ptr-${i}`, { opacity: i === shown ? 1 : 0 }])),
  };

  return (
    <figure className="schematic">
      <Ink
        ref={ref}
        drawing={drawing}
        layerStyle={layerStyle}
        label="Prompt Versioning: seven rings for seven saved versions. Drag the amber dot, click a ring, or use the arrow keys to move production."
        tabIndex={0}
        onKeyDown={onKey}
        onPointerUp={onClickRing}
      >
        {Array.from({ length: PV.versions }, (_, i) => (
          <text key={i} x={PV.cx - PV.r(i) + 3} y={PV.cy - 5} className="tiny">
            v{i + 1}
          </text>
        ))}
        <text x={PV.label[0] + 17} y={PV.label[1] + 3.5} className="hi">
          PRODUCTION → v{shown + 1}
        </text>
        <text x={PV.stageLabel[0] + 17} y={PV.stageLabel[1] + 3.5}>
          STAGING → v7
        </text>
        <text x={12} y={408} className="hi" aria-live="polite">
          LOG · {log}
        </text>
        <g className="pv-dot" style={{ transform: `translate(${dx}px, ${dy}px)`, transition: dragR === null ? undefined : "none" }}>
          <MarkPaths marks={pvDot.frames[0]} />
        </g>
        <circle
          cx={dx}
          cy={dy}
          r={24}
          className="hit"
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
        />
      </Ink>
      <figcaption className="toy-hint">Drag the amber dot to another ring to promote it. Drag it back to roll back.</figcaption>
    </figure>
  );
}
