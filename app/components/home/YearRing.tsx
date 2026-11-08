"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { InkFrames } from "../ink/Ink";
import { polar, rad, sketch } from "@/lib/ink/sketch";
import { attachBoil, drawOn, svgPoint } from "@/lib/ink/motion";

const MON = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
const MONTH = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const C = 280;
const R0 = 150;
const DAY = 864e5;

type Shipped = { title: string; slug: string; date: string };

export type RingProps = {
  /** contributions per day, oldest first, ending today */
  days: number[];
  /** ISO date (YYYY-MM-DD) of the last entry */
  end: string;
  total: number;
  shipped: Shipped[];
  lastPush: string | null;
};

function ago(iso: string, now: number) {
  const min = Math.max(0, Math.round((now - new Date(iso).getTime()) / 60000));
  if (min < 1) return "just now";
  if (min < 60) return `${min} min ago`;
  const h = Math.round(min / 60);
  if (h < 24) return `${h} hour${h === 1 ? "" : "s"} ago`;
  const d = Math.round(h / 24);
  return `${d} day${d === 1 ? "" : "s"} ago`;
}

function arcPath(a0: number, a1: number, r: number) {
  const [x0, y0] = polar(C, C, r, a0);
  const [x1, y1] = polar(C, C, r, a1);
  return `M${x0.toFixed(1)} ${y0.toFixed(1)}A${r} ${r} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`;
}

/**
 * The last twelve months of GitHub contributions as a dial. Today is at the top
 * and the year runs clockwise. Hover to read a day; press and turn to scrub months.
 */
export default function YearRing({ days, end, total, shipped, lastPush }: RingProps) {
  const N = days.length;
  const endMs = Date.parse(`${end}T00:00:00Z`);
  const max = Math.max(1, ...days);
  const ang = (j: number) => rad(-90 + ((j + 0.5) / N) * 360);
  const len = (c: number) => (c ? 8 + 46 * Math.sqrt(c / max) : 0);
  const dateOf = (j: number) => new Date(endMs - (N - 1 - j) * DAY);
  const activeToday = days[N - 1] > 0;

  const months = useMemo(() => {
    const out: { key: string; label: string; name: string; from: number; to: number; sum: number }[] = [];
    days.forEach((c, j) => {
      const d = new Date(endMs - (N - 1 - j) * DAY);
      const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
      const lastM = out[out.length - 1];
      if (!lastM || lastM.key !== key) {
        out.push({ key, label: MON[d.getUTCMonth()], name: `${MONTH[d.getUTCMonth()]} ${d.getUTCFullYear()}`, from: j, to: j, sum: c });
      } else {
        lastM.to = j;
        lastM.sum += c;
      }
    });
    return out;
  }, [days, endMs, N]);

  const drawing = useMemo(
    () =>
      sketch(
        560,
        560,
        (p) => {
          p.circle(C, C, 2 * (R0 - 10), { tone: "pencil", roughness: 0.7, width: 0.8 });
          p.circle(C, C, 2 * (R0 - 26), { tone: "pencil", roughness: 0.6, width: 0.8, dash: [2, 6] });
          p.circle(C, C, 2 * (R0 + 62), { tone: "pencil", roughness: 0.6, width: 0.7 });
          for (const [a0, a1] of [
            [-1.0, -0.1],
            [0.35, 1.55],
            [2.0, 3.3],
            [3.7, 4.55],
          ]) {
            p.arc(C, C, 2 * (R0 + 92), 2 * (R0 + 92), a0, a1, { tone: "pencil", width: 1.3, roughness: 0.7, layer: "spin" });
          }
          days.forEach((c, j) => {
            if (!c) return;
            const a = ang(j);
            const ux = Math.cos(a);
            const uy = Math.sin(a);
            const l = len(c);
            const n = c <= 3 ? 1 : c <= 9 ? 2 : 3;
            for (let s = 0; s < n; s++) {
              const o = (s - (n - 1) / 2) * 1.7;
              p.line(C + R0 * ux - uy * o, C + R0 * uy + ux * o, C + (R0 + l) * ux - uy * o, C + (R0 + l) * uy + ux * o, {
                roughness: 0.5,
                bowing: 0.4,
                width: 0.95,
                single: true,
              });
            }
          });
          for (const m of months) {
            if (dateOf(m.from).getUTCDate() !== 1) continue;
            const [x1, y1] = polar(C, C, R0 + 56, ang(m.from));
            const [x2, y2] = polar(C, C, R0 + 68, ang(m.from));
            p.line(x1, y1, x2, y2, { tone: "pencil", width: 0.9, roughness: 0.4, single: true });
          }
          const [tx, ty] = polar(C, C, R0 + len(days[N - 1]) + 8, ang(N - 1));
          p.line(tx, ty, C, C - (R0 + 102), { tone: "pencil", width: 0.8, roughness: 0.4, single: true });
        },
        { seed: 31, frames: 2 },
      ),
    // the drawing only depends on the data
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [days, end],
  );

  const ref = useRef<SVGSVGElement>(null);
  const sweepRef = useRef<SVGGElement>(null);
  const [day, setDay] = useState<number | null>(null);
  const [month, setMonth] = useState<number | null>(null);
  const [now, setNow] = useState<number | null>(null);
  const turning = useRef(false);

  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    const unboil = attachBoil(svg, svg, activeToday ? "always" : "hover", activeToday ? 220 : 125);
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        drawOn(svg, { dur: 500, spread: 1700 });
        const sw = sweepRef.current;
        if (sw && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          sw.classList.remove("go");
          void sw.getBoundingClientRect();
          sw.classList.add("go");
        }
      },
      { threshold: 0.35 },
    );
    io.observe(svg);
    const tick = () => setNow(Date.now());
    const first = window.setTimeout(tick, 0);
    const timer = window.setInterval(tick, 60_000);
    return () => {
      unboil();
      io.disconnect();
      window.clearTimeout(first);
      window.clearInterval(timer);
    };
  }, [activeToday]);

  const indexAt = (e: PointerEvent) => {
    const p = svgPoint(ref.current!, e);
    const dist = Math.hypot(p.x - C, p.y - C);
    if (dist < R0 - 34 || dist > R0 + 104) return null;
    let deg = (Math.atan2(p.y - C, p.x - C) * 180) / Math.PI + 90;
    if (deg < 0) deg += 360;
    return Math.min(N - 1, Math.floor((deg / 360) * N));
  };
  const monthOf = (j: number) => months.findIndex((m) => j >= m.from && j <= m.to);
  const turnTo = (m: number) => {
    if (m !== month) navigator.vibrate?.(6);
    setMonth(m);
    setDay(null);
  };

  const onDown = (e: PointerEvent<SVGSVGElement>) => {
    const j = indexAt(e);
    if (j === null) return;
    turning.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    turnTo(monthOf(j));
  };
  const onMove = (e: PointerEvent<SVGSVGElement>) => {
    const j = indexAt(e);
    if (turning.current) {
      if (j !== null) turnTo(monthOf(j));
      return;
    }
    if (e.pointerType !== "mouse") return;
    setDay(j);
    if (j !== null) setMonth(null);
  };
  const onUp = () => {
    turning.current = false;
  };
  const onLeave = () => {
    if (!turning.current) setDay(null);
  };
  const onKey = (e: KeyboardEvent<SVGSVGElement>) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") turnTo(month === null ? months.length - 1 : Math.min(months.length - 1, month + 1));
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") turnTo(month === null ? months.length - 1 : Math.max(0, month - 1));
    else if (e.key === "Escape") setMonth(null);
    else return;
    e.preventDefault();
  };

  const sel = month !== null ? months[month] : null;
  const fmtDay = (j: number) => {
    const d = dateOf(j);
    return `${d.getUTCDate()} ${MON[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
  };
  let big = String(total);
  let line1 = "CONTRIBUTIONS";
  let line2 = "LAST 12 MONTHS";
  if (sel) {
    big = String(sel.sum);
    line1 = sel.sum === 1 ? "CONTRIBUTION" : "CONTRIBUTIONS";
    line2 = sel.name.toUpperCase();
  } else if (day !== null) {
    big = String(days[day]);
    line1 = days[day] === 1 ? "CONTRIBUTION" : "CONTRIBUTIONS";
    line2 = fmtDay(day) + (day === N - 1 ? " · TODAY" : "");
  }
  const hov = day !== null ? polar(C, C, R0 + len(days[day]) + 6, ang(day)) : null;
  const todayAt = polar(C, C, R0 + len(days[N - 1]) + 3, ang(N - 1));
  const monthShipped = sel ? shipped.filter((s) => s.date.startsWith(sel.key)) : [];

  return (
    <div className="year-ring">
      <svg
        ref={ref}
        viewBox="0 0 560 560"
        className="ink-svg ring-svg"
        role="img"
        aria-label={`GitHub contributions over the last 12 months: ${total} in total. ${months.map((m) => `${m.name}: ${m.sum}`).join("; ")}.`}
        tabIndex={0}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        onPointerLeave={onLeave}
        onKeyDown={onKey}
      >
        <InkFrames drawing={drawing} layerStyle={{ spin: { transformOrigin: `${C}px ${C}px` } }} />
        {days.map((c, j) =>
          c ? null : (
            <circle key={j} cx={polar(C, C, R0 + 1, ang(j))[0].toFixed(1)} cy={polar(C, C, R0 + 1, ang(j))[1].toFixed(1)} r={0.9} className="pencil-dot" />
          ),
        )}
        {months.map((m) => {
          if (dateOf(m.from).getUTCDate() !== 1) return null;
          const [x, y] = polar(C, C, R0 + 82, ang(m.from));
          return (
            <text key={m.key} x={x.toFixed(1)} y={(y + 3.5).toFixed(1)} textAnchor="middle" className={sel?.key === m.key ? "hi" : undefined}>
              {m.label}
            </text>
          );
        })}
        <text x={C} y={C - (R0 + 109)} textAnchor="middle" className="hi">
          TODAY
        </text>
        {sel ? <path d={arcPath(ang(sel.from) - 0.004, ang(sel.to) + 0.004, R0 + 62)} className="amber-arc" /> : null}
        <circle cx={todayAt[0]} cy={todayAt[1]} r={3.4} className={activeToday ? "amber-dot" : "pencil-dot"} />
        {hov ? <circle cx={hov[0]} cy={hov[1]} r={3.6} className="amber-dot" /> : null}
        <text x={C} y={C + 12} textAnchor="middle" className="big">
          {big}
        </text>
        <text x={C} y={C + 40} textAnchor="middle" className="hi">
          {line1}
        </text>
        <text x={C} y={C + 56} textAnchor="middle">
          {line2}
        </text>
        <g ref={sweepRef} className="sweep">
          <path d={arcPath(rad(-112), rad(-90), R0 + 62)} className="amber-arc thick" />
        </g>
      </svg>
      <p className="ring-note" aria-live="polite">
        {sel ? (
          monthShipped.length ? (
            <>
              Shipped in {sel.name}:{" "}
              {monthShipped.map((s, i) => (
                <span key={s.slug}>
                  {i ? ", " : ""}
                  <Link href={`/projects/${s.slug}`}>{s.title}</Link>
                </span>
              ))}
              .
            </>
          ) : (
            <>Nothing shipped in {sel.name}, just work in progress.</>
          )
        ) : (
          <>Hover to read a day. Press and turn the dial to go month by month.</>
        )}
      </p>
      <p className="label live">
        <span className={activeToday ? "pulse" : "pulse off"} aria-hidden="true" />
        {lastPush && now ? `Last push ${ago(lastPush, now)}` :`Today · ${days[N - 1]} contribution${days[N - 1] === 1 ? "" : "s"}`}
      </p>
    </div>
  );
}
