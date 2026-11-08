"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

/** ← and → move between projects, unless you are typing or playing with a drawing. */
export default function ProjectKeys({ prev, next }: { prev: string; next: string }) {
  const router = useRouter();
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
      const t = e.target as HTMLElement | null;
      if (t?.closest("input, textarea, select, [contenteditable], svg[tabindex]")) return;
      if (e.key === "ArrowLeft") router.push(prev);
      else if (e.key === "ArrowRight") router.push(next);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router, prev, next]);
  return null;
}
