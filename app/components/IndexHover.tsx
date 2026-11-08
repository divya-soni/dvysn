"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Ink from "./ink/Ink";
import { descriptions, thumbs } from "@/lib/ink/schematics";

/** Shows the drawing of whichever project row is hovered or focused. */
export default function IndexHover({
  children,
  items,
}: {
  children: ReactNode;
  items: { slug: string; number: string }[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(items[0]?.slug ?? "");

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const pick = (e: Event) => {
      const slug = (e.target as HTMLElement).closest<HTMLElement>("[data-row]")?.dataset.row;
      if (slug) setActive(slug);
    };
    root.addEventListener("pointerover", pick);
    root.addEventListener("focusin", pick);
    return () => {
      root.removeEventListener("pointerover", pick);
      root.removeEventListener("focusin", pick);
    };
  }, []);

  useEffect(() => {
    ref.current?.querySelectorAll<HTMLElement>("[data-row]").forEach((el) => {
      el.dataset.on = el.dataset.row === active ? "1" : "0";
    });
  }, [active]);

  const drawing = useMemo(() => thumbs[active]?.(), [active]);
  const item = items.find((i) => i.slug === active);

  return (
    <div ref={ref} className="index-hover">
      {children}
      <div className="idx-panel" aria-hidden="true">
        {drawing && item ? (
          <div key={active} className="idx-thumb">
            <Ink drawing={drawing} />
            <p className="idx-thumb-cap">
              {item.number} · {descriptions[active]}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
