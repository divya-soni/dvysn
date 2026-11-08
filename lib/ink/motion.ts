/** Browser-only helpers for ink drawings. */

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Converts a pointer event to the SVG's own coordinate space. */
export function svgPoint(svg: SVGSVGElement, e: { clientX: number; clientY: number }) {
  const m = svg.getScreenCTM();
  if (!m) return { x: 0, y: 0 };
  const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
  return { x: p.x, y: p.y };
}

export type BoilMode = "hover" | "always" | "off";

/**
 * Swaps a drawing's frames a few times a second ("boiling line"): while hovered,
 * or the whole time it is on screen. Returns a cleanup function.
 */
export function attachBoil(svg: SVGSVGElement, host: Element, mode: BoilMode = "hover", rate = 125) {
  const n = svg.querySelectorAll(":scope > .frame").length;
  if (mode === "off" || n < 2 || prefersReducedMotion()) return () => {};
  let timer: number | undefined;
  let i = 0;
  const start = () => {
    if (timer !== undefined) return;
    timer = window.setInterval(() => {
      i = (i + 1) % n;
      svg.dataset.f = String(i);
    }, rate);
  };
  const stop = () => {
    window.clearInterval(timer);
    timer = undefined;
    i = 0;
    svg.dataset.f = "0";
  };
  if (mode === "always") {
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()));
    io.observe(host);
    return () => {
      io.disconnect();
      stop();
    };
  }
  host.addEventListener("pointerenter", start);
  host.addEventListener("pointerleave", stop);
  return () => {
    host.removeEventListener("pointerenter", start);
    host.removeEventListener("pointerleave", stop);
    stop();
  };
}

/** Lines draw themselves in, like a pen moving across paper. */
export function drawOn(svg: SVGSVGElement, { dur = 900, spread = 1200 } = {}) {
  if (prefersReducedMotion()) return;
  svg.dataset.f = "0";
  const paths = Array.from(svg.querySelectorAll<SVGPathElement>(".f0 path"));
  const n = paths.length || 1;
  for (const p of paths) {
    p.setAttribute("pathLength", "1");
    p.style.transition = "none";
    p.style.strokeDasharray = "1 1";
    p.style.strokeDashoffset = "1";
  }
  void svg.getBoundingClientRect();
  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      paths.forEach((p, i) => {
        p.style.transition = `stroke-dashoffset ${dur}ms cubic-bezier(.35,.1,.25,1) ${Math.round((i / n) * spread)}ms`;
        p.style.strokeDashoffset = "0";
      });
    }),
  );
  window.setTimeout(() => {
    for (const p of paths) {
      p.style.transition = "";
      p.style.strokeDasharray = "";
      p.style.strokeDashoffset = "";
      p.removeAttribute("pathLength");
    }
  }, dur + spread + 200);
}
