"use client";

import { useSyncExternalStore } from "react";

const PAPER = { light: "#f4f1ea", dark: "#161410" };

export default function ThemeToggle() {
  const dark = useSyncExternalStore(
    (onStoreChange) => {
      window.addEventListener("storage", onStoreChange);
      window.addEventListener("themechange", onStoreChange);

      return () => {
        window.removeEventListener("storage", onStoreChange);
        window.removeEventListener("themechange", onStoreChange);
      };
    },
    () => document.documentElement.classList.contains("dark"),
    () => false,
  );

  const toggle = () => {
    const next = !dark;
    const root = document.documentElement;

    root.classList.add("theme-anim");
    window.setTimeout(() => root.classList.remove("theme-anim"), 320);

    root.classList.toggle("dark", next);
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", next ? PAPER.dark : PAPER.light);
    localStorage.setItem("theme", next ? "dark" : "light");
    window.dispatchEvent(new Event("themechange"));
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className="theme-toggle"
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <span key={dark ? "light" : "dark"} className="theme-word">
        {dark ? "Light" : "Dark"}
      </span>
    </button>
  );
}
