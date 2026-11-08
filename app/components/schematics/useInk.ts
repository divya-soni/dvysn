"use client";

import { useEffect, useId, type RefObject } from "react";
import { attachBoil, drawOn, type BoilMode } from "@/lib/ink/motion";

/** Boil on hover and draw in once on mount, for an interactive drawing. */
export function useInk(ref: RefObject<SVGSVGElement | null>, { boil = "hover" as BoilMode, draw = true } = {}) {
  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    if (draw) drawOn(svg, { dur: 900, spread: 1300 });
    return attachBoil(svg, svg, boil);
  }, [ref, boil, draw]);
}

/** An id that is safe inside url(#…) references. */
export function useSvgId(prefix: string) {
  return `${prefix}-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
}

export const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
