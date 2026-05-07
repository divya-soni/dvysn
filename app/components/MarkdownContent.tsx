"use client";

import { useEffect, useRef } from "react";

export default function MarkdownContent({ html }: { html: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    container.querySelectorAll("pre").forEach((pre) => {
      if (pre.parentElement?.classList.contains("code-block")) return;

      const code = pre.querySelector("code");
      const text = code?.textContent ?? "";

      const wrapper = document.createElement("div");
      wrapper.className =
        "code-block my-8 overflow-hidden rounded-lg border border-line bg-surface shadow-[var(--shadow-soft)]";

      const bar = document.createElement("div");
      bar.className =
        "flex items-center justify-between border-b border-line bg-surface-soft px-4 py-3";
      bar.innerHTML = `
        <div class="flex items-center gap-1.5">
          <span class="block h-2.5 w-2.5 rounded-full bg-line"></span>
          <span class="block h-2.5 w-2.5 rounded-full bg-line"></span>
          <span class="block h-2.5 w-2.5 rounded-full bg-line"></span>
        </div>
        <button class="copy-btn font-mono text-[11px] text-muted transition-colors duration-150 hover:text-foreground">copy</button>
      `;

      pre.className = "m-0 overflow-x-auto p-5";
      pre.style.background = "var(--code-bg)";
      if (code) {
        code.className =
          "whitespace-pre font-mono text-[13px] leading-relaxed";
        code.style.color = "var(--code-text)";
      }

      pre.parentNode!.insertBefore(wrapper, pre);
      wrapper.appendChild(bar);
      wrapper.appendChild(pre);

      const btn = bar.querySelector(".copy-btn") as HTMLButtonElement;
      btn.addEventListener("click", async () => {
        await navigator.clipboard.writeText(text);
        btn.textContent = "✓ copied";
        btn.style.color = "#10b981";
        setTimeout(() => {
          btn.textContent = "copy";
          btn.style.color = "";
        }, 2000);
      });
    });
  }, [html]);

  return (
    <div
      ref={ref}
      className="prose"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
