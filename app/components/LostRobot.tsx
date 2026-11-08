"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { InkFrames } from "./ink/Ink";
import { drawLost, drawMap, LOST } from "@/lib/ink/lost";
import { attachBoil, drawOn, prefersReducedMotion } from "@/lib/ink/motion";
import { drawRobot, SCENE } from "@/lib/ink/robot";

const HOLDING_MAP = { arm: { transform: "rotate(-22deg)" } };
const SPEED = 62;

/**
 * The page-not-found scene. The robot has been walking in circles because its
 * map is upside down. Turn the map and it walks to the sign pointing home.
 */
export default function LostRobot() {
  const scene = useMemo(() => drawLost(3), []);
  const robot = useMemo(() => drawRobot(3), []);
  const map = useMemo(() => drawMap(3), []);

  const svgRef = useRef<SVGSVGElement>(null);
  const robotRef = useRef<SVGGElement>(null);
  const homeRef = useRef<HTMLAnchorElement>(null);
  const turnRef = useRef<() => void>(() => {});

  const [turned, setTurned] = useState(false);
  const [arrived, setArrived] = useState(false);

  useEffect(() => {
    const svg = svgRef.current;
    const body = robotRef.current;
    if (!svg || !body) return;
    const reduce = prefersReducedMotion();
    let x: number = LOST.start;
    let phase = 0;
    let last = 0;
    let raf = 0;
    let timer: number | undefined;
    let started = false;

    const legs = (deg: number) => {
      body.querySelectorAll<SVGGElement>(".layer.leg-l").forEach((g) => (g.style.transform = `rotate(${deg.toFixed(1)}deg)`));
      body.querySelectorAll<SVGGElement>(".layer.leg-r").forEach((g) => (g.style.transform = `rotate(${(-deg).toFixed(1)}deg)`));
    };
    const place = (bob: number) => {
      body.setAttribute("transform", `translate(${x.toFixed(1)} ${(LOST.ground + bob).toFixed(1)})`);
    };
    const reveal = (a: number, b: number) => {
      LOST.prints.forEach((px, k) => {
        if (px >= a - 2 && px <= b + 2) {
          svg.querySelectorAll<SVGGElement>(`.layer.fp-${k}`).forEach((g) => (g.style.opacity = "1"));
        }
      });
    };
    const arrive = () => {
      x = LOST.end;
      place(0);
      legs(0);
      setArrived(true);
    };
    const step = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const prev = x;
      x += SPEED * dt;
      phase += dt * 11;
      reveal(prev, x);
      if (x >= LOST.end) {
        arrive();
        return;
      }
      place(-Math.abs(Math.sin(phase)) * 2.5);
      legs(Math.sin(phase) * 14);
      raf = requestAnimationFrame(step);
    };

    turnRef.current = () => {
      if (started) return;
      started = true;
      setTurned(true);
      homeRef.current?.focus({ preventScroll: true });
      timer = window.setTimeout(
        () => {
          if (reduce) {
            reveal(LOST.start, LOST.end);
            arrive();
            return;
          }
          last = performance.now();
          raf = requestAnimationFrame(step);
        },
        reduce ? 0 : 900,
      );
    };

    drawOn(svg, { dur: 1000, spread: 1600 });
    const unboil = attachBoil(svg, svg, "hover");
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(timer);
      unboil();
    };
  }, []);

  const layers = {
    ...Object.fromEntries(LOST.prints.map((_, k) => [`fp-${k}`, { opacity: 0 }])),
    "sign-lit": { opacity: arrived ? 1 : 0 },
  };
  const mapX = LOST.start + LOST.map.x;
  const mapY = LOST.ground + LOST.map.y;

  return (
    <div className="lost-stage">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${LOST.w} ${LOST.h}`}
        className="ink-svg"
        role="img"
        aria-label="A small tin robot stands in the middle of footprints going round in circles, holding a map upside down. A signpost points home."
      >
        <InkFrames drawing={scene} layerStyle={layers} />
        <g ref={robotRef} className="robot" transform={`translate(${LOST.start} ${LOST.ground})`}>
          <InkFrames drawing={robot} layerStyle={HOLDING_MAP} />
          <circle cx={SCENE.eye.x + 2.2} cy={SCENE.eye.y + 1.5} r={3.2} className="amber-dot" />
          {turned ? null : (
            <text x={-34} y={-122} className="lost-q">
              ?
            </text>
          )}
          <g transform={`translate(${LOST.map.x} ${LOST.map.y})`}>
            <g className="lost-map" data-turned={turned ? "1" : "0"}>
              <InkFrames drawing={map} />
              <text x={-23} y={1} textAnchor="middle">N</text>
              <text x={18} y={-10} textAnchor="middle">HOME</text>
            </g>
          </g>
        </g>
        {turned ? null : (
          <g className="wind-hint" aria-hidden="true">
            <line x1={mapX} y1={mapY - 44} x2={mapX} y2={mapY - 26} className="pencil-stroke" />
            <text x={mapX} y={mapY - 49} textAnchor="middle">
              TURN THE MAP
            </text>
          </g>
        )}
      </svg>
      {turned ? null : (
        <button
          type="button"
          className="lost-map-btn"
          aria-label="Turn the map the right way up"
          style={{ left: `${(mapX / LOST.w) * 100}%`, top: `${(mapY / LOST.h) * 100}%` }}
          onClick={() => turnRef.current()}
        />
      )}
      <Link
        ref={homeRef}
        href="/"
        className="lost-home"
        style={{ left: `${((LOST.sign.x + 2) / LOST.w) * 100}%`, top: `${(LOST.sign.y / LOST.h) * 100}%` }}
      >
        Home
      </Link>
    </div>
  );
}
