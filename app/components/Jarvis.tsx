"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Boil from "./ink/Boil";
import Ink from "./ink/Ink";
import { drawJarvisRing, JARVIS_CALL, JARVIS_MS, JARVIS_ON } from "@/lib/ink/jarvis";
import { drawOn } from "@/lib/ink/motion";
import { sound } from "@/lib/sound";

const WORD = "jarvis";
const MAX_GAP_MS = 1500;

function greeting() {
  const h = new Date().getHours();
  if (h < 5) return "Working late.";
  if (h < 12) return "Good morning.";
  if (h < 17) return "Good afternoon.";
  return "Good evening.";
}

const online = (n: number) => `${n} drawing${n === 1 ? "" : "s"} online`;

type Place = "center" | "left" | "right" | "top" | "bottom";

/** Keeps the ring off the robot, so you can see it salute. */
function placement(): Place {
  const r = document.querySelector(".robot")?.getBoundingClientRect();
  if (!r || r.bottom < 0 || r.top > window.innerHeight) return "center";
  if (window.innerWidth >= 860) return r.left + r.width / 2 > window.innerWidth / 2 ? "left" : "right";
  return r.top + r.height / 2 > window.innerHeight / 2 ? "top" : "bottom";
}

function Ring({ hello, count, place }: { hello: string; count: number; place: Place }) {
  const drawing = useMemo(() => drawJarvisRing(3), []);
  return (
    <div className="jarvis-overlay" data-place={place} aria-hidden="true">
      <Boil mode="always" rate={110} draw>
        <Ink drawing={drawing}>
          <circle cx={240} cy={240} r={106} className="paper" />
          <text x={240} y={238} textAnchor="middle" className="jarvis-hello">
            {hello}
          </text>
          <text x={240} y={264} textAnchor="middle" className="hi">
            {online(count).toUpperCase()}
          </text>
        </Ink>
      </Boil>
    </div>
  );
}

/**
 * Type "jarvis" anywhere (or tap the robot's antenna) and every drawing on the
 * page powers on at once, then settles back to ink.
 */
export default function Jarvis() {
  const [on, setOn] = useState<{ hello: string; count: number; place: Place } | null>(null);
  const busy = useRef(false);

  useEffect(() => {
    const root = document.documentElement;
    let typed = "";
    let lastKey = 0;
    let timer: number | undefined;

    const powerOn = () => {
      if (busy.current) return;
      busy.current = true;
      const drawings = Array.from(document.querySelectorAll<SVGSVGElement>("svg.ink-svg"));
      setOn({ hello: greeting(), count: drawings.length, place: placement() });
      root.classList.add("jarvis");
      window.dispatchEvent(new Event(JARVIS_ON));
      sound.powerOn();
      drawings.forEach((svg) => drawOn(svg, { dur: 700, spread: 1100 }));
      document.querySelectorAll(".sweep").forEach((el) => {
        el.classList.remove("go");
        void el.getBoundingClientRect();
        el.classList.add("go");
      });
      timer = window.setTimeout(() => {
        root.classList.remove("jarvis");
        setOn(null);
        busy.current = false;
      }, JARVIS_MS);
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey || e.key === "Shift") return;
      const target = e.target as HTMLElement | null;
      if (target?.closest?.("input, textarea, select, [contenteditable]")) return;
      if (!/^[a-z]$/i.test(e.key)) {
        typed = "";
        return;
      }
      if (e.timeStamp - lastKey > MAX_GAP_MS) typed = "";
      lastKey = e.timeStamp;
      typed = (typed + e.key.toLowerCase()).slice(-WORD.length);
      if (typed === WORD) {
        typed = "";
        powerOn();
      }
    };

    window.addEventListener("keydown", onKey);
    window.addEventListener(JARVIS_CALL, powerOn);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(JARVIS_CALL, powerOn);
      window.clearTimeout(timer);
      root.classList.remove("jarvis");
    };
  }, []);

  return (
    <>
      <div className="sr-only" role="status">
        {on ? `${on.hello} ${online(on.count)}.` : ""}
      </div>
      {on ? <Ring hello={on.hello} count={on.count} place={on.place} /> : null}
    </>
  );
}
