"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { attachBoil, drawOn, type BoilMode } from "@/lib/ink/motion";

/** Wraps a server-rendered ink drawing and brings it to life in the browser. */
export default function Boil({
  children,
  mode = "hover",
  rate = 125,
  draw = false,
  className,
}: {
  children: ReactNode;
  mode?: BoilMode;
  rate?: number;
  draw?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = ref.current;
    const svg = host?.querySelector<SVGSVGElement>("svg.ink-svg");
    if (!host || !svg) return;
    if (draw) drawOn(svg);
    return attachBoil(svg, host, mode, rate);
  }, [mode, rate, draw]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
