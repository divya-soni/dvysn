"use client";

import { useSyncExternalStore } from "react";

function Icon({ children }: { children: React.ReactNode }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    >
      {children}
    </svg>
  );
}

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
    root.classList.add("theme-transitioning");
    root.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
    window.dispatchEvent(new Event("themechange"));
    setTimeout(() => root.classList.remove("theme-transitioning"), 300);
  };

  return (
    <button
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line bg-surface text-muted shadow-[var(--shadow-soft)] transition-colors duration-150 hover:border-primary/40 hover:text-foreground"
    >
      <span key={dark ? "dark" : "light"} className="theme-icon block">
        <Icon>
          {dark ? (
            <>
              <circle cx="12" cy="12" r="5" />
              <line x1="12" x2="12" y1="1" y2="3" />
              <line x1="12" x2="12" y1="21" y2="23" />
              <line x1="4.22" x2="5.64" y1="4.22" y2="5.64" />
              <line x1="18.36" x2="19.78" y1="18.36" y2="19.78" />
              <line x1="1" x2="3" y1="12" y2="12" />
              <line x1="21" x2="23" y1="12" y2="12" />
              <line x1="4.22" x2="5.64" y1="19.78" y2="18.36" />
              <line x1="18.36" x2="19.78" y1="5.64" y2="4.22" />
            </>
          ) : (
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          )}
        </Icon>
      </span>
    </button>
  );
}
