"use client";

import { useRef, useState, useSyncExternalStore, type PointerEvent } from "react";
import { InkFrames, MarkPaths } from "./ink/Ink";
import { sketch } from "@/lib/ink/sketch";
import { prefersReducedMotion } from "@/lib/ink/motion";
import { sound } from "@/lib/sound";

const PAPER = { light: "#F6F2E9", dark: "#0D1520" };
const PULL = 22; // how far the chain stretches, in drawing units

const lamp = sketch(
  44,
  70,
  (p) => {
    p.line(22, 0, 22, 11, { width: 1, roughness: 0.4 });
    p.poly(
      [
        [8, 28],
        [36, 28],
        [29, 11],
        [15, 11],
      ],
      { width: 1.3, roughness: 0.9 },
    );
    p.poly(
      [
        [27, 12],
        [30, 12],
        [36, 27],
        [31, 27],
      ],
      { outline: false, fill: "hachure", gap: 2.2, angle: -60, weight: 0.7, roughness: 0.6 },
    );
  },
  { seed: 5, frames: 1 },
);
const bulb = sketch(44, 70, (p) => p.circle(22, 31, 8, { tone: "pencil", width: 1, roughness: 0.6 }), { seed: 6, frames: 1 });
const bulbLit = sketch(
  44,
  70,
  (p) => p.circle(22, 31, 8, { tone: "amber", fill: "solid", width: 1, roughness: 0.5 }),
  { seed: 7, frames: 1 },
);
const knob = sketch(44, 70, (p) => p.circle(33, 48, 6, { fill: "solid", width: 1, roughness: 0.5 }), { seed: 8, frames: 1 });

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener("themechange", onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener("themechange", onChange);
  };
}

function applyTheme(dark: boolean) {
  document.documentElement.classList.toggle("dark", dark);
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", dark ? PAPER.dark : PAPER.light);
  try {
    localStorage.setItem("theme", dark ? "dark" : "light");
  } catch {}
  window.dispatchEvent(new Event("themechange"));
}

type Doc = Document & { startViewTransition?: (cb: () => void) => { ready: Promise<void> } };

/** Night spreads out from the lamp in a circle. */
function switchTheme(dark: boolean, x: number, y: number) {
  const doc = document as Doc;
  const root = document.documentElement;
  if (!doc.startViewTransition || prefersReducedMotion()) {
    root.classList.add("theme-anim");
    window.setTimeout(() => root.classList.remove("theme-anim"), 450);
    applyTheme(dark);
    return;
  }
  const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  const t = doc.startViewTransition(() => applyTheme(dark));
  t.ready
    .then(() => {
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
        { duration: 800, easing: "cubic-bezier(.45,.05,.2,1)", pseudoElement: "::view-transition-new(root)" },
      );
    })
    .catch(() => {});
}

/** The theme switch: a hanging lamp with a pull chain. Pull it, or just click. */
export default function Lamp() {
  const dark = useSyncExternalStore(
    subscribe,
    () => document.documentElement.classList.contains("dark"),
    () => false,
  );
  const [pull, setPull] = useState(0);
  const [held, setHeld] = useState(false);
  const drag = useRef<{ y: number; moved: boolean } | null>(null);
  const skipClick = useRef(false);
  const btn = useRef<HTMLButtonElement>(null);

  const origin = () => {
    const r = btn.current?.getBoundingClientRect();
    return r ? { x: r.left + r.width * 0.75, y: r.top + r.height * 0.7 } : { x: innerWidth, y: 0 };
  };
  const toggle = () => {
    sound.lamp();
    const o = origin();
    switchTheme(!dark, o.x, o.y);
  };

  const onPointerDown = (e: PointerEvent<HTMLButtonElement>) => {
    drag.current = { y: e.clientY, moved: false };
    setHeld(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: PointerEvent<HTMLButtonElement>) => {
    if (!drag.current) return;
    const dy = Math.max(0, Math.min(PULL, (e.clientY - drag.current.y) * 0.8));
    if (dy > 3 && !drag.current.moved) sound.chain();
    if (dy > 3) drag.current.moved = true;
    setPull(dy);
  };
  const onPointerUp = () => {
    const d = drag.current;
    drag.current = null;
    setHeld(false);
    if (d?.moved) {
      skipClick.current = true;
      if (pull > PULL * 0.45) toggle();
    }
    setPull(0);
  };
  const onClick = () => {
    if (skipClick.current) {
      skipClick.current = false;
      return;
    }
    // a quick tug for keyboard and plain clicks
    setPull(10);
    window.setTimeout(() => setPull(0), 140);
    toggle();
  };

  return (
    <button
      ref={btn}
      type="button"
      className="lamp"
      aria-label={dark ? "Turn the lamp off (day)" : "Turn the lamp on (night)"}
      title={dark ? "Pull for day" : "Pull for night"}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onClick={onClick}
    >
      <svg viewBox="0 0 44 74" aria-hidden="true" className="ink-svg lamp-svg">
        <InkFrames drawing={lamp} />
        <MarkPaths marks={(dark ? bulbLit : bulb).frames[0]} />
        <line
          x1="33"
          y1="22"
          x2="33"
          y2={45 + pull}
          className="lamp-chain"
          style={{ transition: held ? "none" : undefined }}
        />
        <g
          className="lamp-knob"
          style={{ transform: `translateY(${pull}px)`, transition: held ? "none" : undefined }}
        >
          <MarkPaths marks={knob.frames[0]} />
        </g>
      </svg>
    </button>
  );
}
