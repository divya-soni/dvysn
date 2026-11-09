"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { InkFrames } from "../ink/Ink";
import { drawRobot, drawScene, SCENE } from "@/lib/ink/robot";
import { sound } from "@/lib/sound";
import { callJarvis, JARVIS_MS, JARVIS_ON } from "@/lib/ink/jarvis";
import { attachBoil, drawOn, prefersReducedMotion } from "@/lib/ink/motion";

const IDLE_MS = 25_000;
const MAX_WINDS = 8;

/**
 * A small wind-up robot. Its eye follows your cursor, it nods off when you stop
 * moving, and if you wind its key it walks along the path leaving footprints.
 */
export default function RobotScene() {
  const scene = useMemo(() => drawScene(3), []);
  const robot = useMemo(() => drawRobot(3), []);
  const hiddenPrints = useMemo(
    () => Object.fromEntries(SCENE.prints.map((_, k) => [`fp-${k}`, { opacity: 0 }])),
    [],
  );

  const svgRef = useRef<SVGSVGElement>(null);
  const robotRef = useRef<SVGGElement>(null);
  const pupilRef = useRef<SVGGElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const windRef = useRef<() => void>(() => {});

  const [hint, setHint] = useState(true);
  const [asleep, setAsleep] = useState<{ x: number; dir: number } | null>(null);

  useEffect(() => {
    const svg = svgRef.current;
    const body = robotRef.current;
    if (!svg || !body) return;
    const reduce = prefersReducedMotion();
    const s = { x: SCENE.start, dir: 1, energy: 0, phase: 0, winds: 0, key: 0, walking: false, saluting: false };
    let raf = 0;
    let last = 0;
    let release: number | undefined;
    let idle: number | undefined;
    let sleeping = false;

    const layer = (name: string, transform: string) => {
      body.querySelectorAll<SVGGElement>(`.layer.${name}`).forEach((g) => (g.style.transform = transform));
    };
    const place = () => {
      const bob = s.walking ? -Math.abs(Math.sin(s.phase)) * 2.5 : 0;
      body.setAttribute("transform", `translate(${s.x.toFixed(1)} ${(SCENE.ground + bob).toFixed(1)}) scale(${s.dir} 1)`);
      const swing = s.walking ? Math.sin(s.phase) * 14 : 0;
      layer("leg-l", `rotate(${swing.toFixed(1)}deg)`);
      layer("leg-r", `rotate(${(-swing).toFixed(1)}deg)`);
      layer("arm", `rotate(${s.saluting ? -146 : (-swing * 0.7).toFixed(1)}deg)`);
      layer("key", `rotate(${s.key.toFixed(1)}deg)`);
      const btn = btnRef.current;
      if (btn) btn.style.left = `${((s.x + SCENE.key.x * s.dir) / SCENE.w) * 100}%`;
    };
    const reveal = (a: number, b: number) => {
      const lo = Math.min(a, b) - 2;
      const hi = Math.max(a, b) + 2;
      SCENE.prints.forEach((x, k) => {
        if (x >= lo && x <= hi) svg.querySelectorAll<SVGGElement>(`.layer.fp-${k}`).forEach((g) => (g.style.opacity = "1"));
      });
    };
    const wake = () => {
      window.clearTimeout(idle);
      if (sleeping) {
        sleeping = false;
        setAsleep(null);
      }
      idle = window.setTimeout(() => {
        if (s.walking) return;
        sleeping = true;
        setAsleep({ x: s.x, dir: s.dir });
      }, IDLE_MS);
    };

    const step = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const speed = 58 * (0.35 + 0.65 * Math.min(1, s.energy / 70));
      const prev = s.x;
      s.x += s.dir * speed * dt;
      s.energy -= speed * dt;
      const stride = Math.floor(s.phase / Math.PI);
      s.phase += dt * 11;
      if (Math.floor(s.phase / Math.PI) !== stride) sound.step(stride % 2 === 0);
      s.key -= speed * dt * 2.2;
      if (s.x > SCENE.max) {
        s.x = SCENE.max;
        s.dir = -1;
        sound.tonk();
      } else if (s.x < SCENE.min) {
        s.x = SCENE.min;
        s.dir = 1;
        sound.tonk();
      }
      reveal(prev, s.x);
      if (s.energy <= 0) {
        s.energy = 0;
        s.walking = false;
        place();
        wake();
        return;
      }
      place();
      raf = requestAnimationFrame(step);
    };
    const go = () => {
      if (!s.winds) return;
      const dist = s.winds * 46;
      s.winds = 0;
      if (reduce) {
        const prev = s.x;
        s.x = Math.max(SCENE.min, Math.min(SCENE.max, s.x + s.dir * dist));
        if (s.x === SCENE.max || s.x === SCENE.min) s.dir = -s.dir;
        reveal(prev, s.x);
        place();
        return;
      }
      s.energy += dist;
      if (!s.walking) {
        s.walking = true;
        last = performance.now();
        raf = requestAnimationFrame(step);
      }
    };
    windRef.current = () => {
      setHint(false);
      wake();
      s.winds = Math.min(MAX_WINDS, s.winds + 1);
      s.key += 90;
      sound.ratchet(s.winds);
      place();
      window.clearTimeout(release);
      release = window.setTimeout(go, 650);
    };

    // the eye follows the pointer
    let lookRaf = 0;
    let px = 0;
    let py = 0;
    const look = () => {
      lookRaf = 0;
      const pupil = pupilRef.current;
      const m = svg.getScreenCTM();
      if (!pupil || !m) return;
      const eye = new DOMPoint(s.x + SCENE.eye.x * s.dir, SCENE.ground + SCENE.eye.y).matrixTransform(m);
      const dx = px - eye.x;
      const dy = py - eye.y;
      const len = Math.hypot(dx, dy) || 1;
      pupil.setAttribute(
        "transform",
        `translate(${(SCENE.eye.x + (dx / len) * 2.4 * s.dir).toFixed(2)} ${(SCENE.eye.y + (dy / len) * 2.4).toFixed(2)})`,
      );
    };
    const onPointer = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
      wake();
      if (!lookRaf) lookRaf = requestAnimationFrame(look);
    };
    const onActivity = () => wake();

    // when the power-on happens, the robot salutes
    let saluteTimer: number | undefined;
    const salute = () => {
      wake();
      s.saluting = true;
      body.classList.add("saluting");
      place();
      window.clearTimeout(saluteTimer);
      saluteTimer = window.setTimeout(() => {
        s.saluting = false;
        place();
        saluteTimer = window.setTimeout(() => body.classList.remove("saluting"), 400);
      }, JARVIS_MS - 700);
    };

    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("keydown", onActivity);
    window.addEventListener("scroll", onActivity, { passive: true });
    window.addEventListener(JARVIS_ON, salute);
    drawOn(svg, { dur: 1000, spread: 1600 });
    const unboil = attachBoil(svg, svg, "hover");
    wake();

    return () => {
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("keydown", onActivity);
      window.removeEventListener("scroll", onActivity);
      cancelAnimationFrame(raf);
      cancelAnimationFrame(lookRaf);
      window.removeEventListener(JARVIS_ON, salute);
      window.clearTimeout(saluteTimer);
      window.clearTimeout(release);
      window.clearTimeout(idle);
      unboil();
    };
  }, []);

  const keyX = SCENE.start + SCENE.key.x;
  const keyY = SCENE.ground + SCENE.key.y;

  return (
    <div className="robot-scene">
      <div className="robot-stage">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${SCENE.w} ${SCENE.h}`}
        className="ink-svg"
        role="img"
        aria-label="A small wind-up tin robot with an amber eye stands on a path near a tree, footprints trailing behind it."
      >
        <InkFrames drawing={scene} layerStyle={hiddenPrints} />
        <g
          ref={robotRef}
          className="robot"
          transform={`translate(${SCENE.start} ${SCENE.ground}) scale(1 1)`}
          onClick={() => windRef.current()}
        >
          <InkFrames drawing={robot} />
          <circle
            cx={-2}
            cy={-135}
            r={20}
            className="antenna-hit"
            onClick={(e) => {
              e.stopPropagation();
              callJarvis();
            }}
          />
          <g ref={pupilRef} transform={`translate(${SCENE.eye.x} ${SCENE.eye.y})`} style={{ opacity: asleep ? 0 : 1 }}>
            <circle r={3.2} className="amber-dot" />
          </g>
          {asleep ? (
            <line x1={SCENE.eye.x - 4} y1={SCENE.eye.y + 1} x2={SCENE.eye.x + 4} y2={SCENE.eye.y + 1} className="ink-stroke" />
          ) : null}
        </g>
        {asleep ? (
          <g className="zzz" aria-hidden="true">
            <text x={asleep.x + 18 * asleep.dir} y={SCENE.ground - 128}>z</text>
            <text x={asleep.x + 28 * asleep.dir} y={SCENE.ground - 142} className="zzz-2">z</text>
          </g>
        ) : null}
        {hint ? (
          <g className="wind-hint" aria-hidden="true">
            <line x1={keyX - 30} y1={keyY - 38} x2={keyX - 6} y2={keyY - 10} className="pencil-stroke" />
            <text x={keyX - 34} y={keyY - 42} textAnchor="end">
              WIND ME
            </text>
          </g>
        ) : null}
      </svg>
      <button
        ref={btnRef}
        type="button"
        className="wind-btn"
        aria-label="Wind up the robot"
        style={{ left: `${(keyX / SCENE.w) * 100}%`, top: `${(keyY / SCENE.h) * 100}%` }}
        onClick={() => windRef.current()}
      />
      </div>
    </div>
  );
}
