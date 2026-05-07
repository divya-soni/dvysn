"use client";

import { useState } from "react";

interface Props {
  code: string;
  language?: string;
}

export default function CodeBlock({ code, language }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-8 overflow-hidden rounded-lg border border-line bg-surface shadow-[var(--shadow-soft)]">
      <div className="flex items-center justify-between border-b border-line bg-surface-soft px-4 py-3">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-line" />
          <span className="h-2.5 w-2.5 rounded-full bg-line" />
          <span className="h-2.5 w-2.5 rounded-full bg-line" />
        </div>
        <div className="flex items-center gap-4">
          {language && (
            <span className="font-mono text-[11px] text-muted">
              {language}
            </span>
          )}
          <button
            onClick={handleCopy}
            className={`font-mono text-[11px] transition-colors duration-150 ${
              copied ? "text-emerald-500" : "text-muted hover:text-foreground"
            }`}
          >
            {copied ? "✓ copied" : "copy"}
          </button>
        </div>
      </div>
      <pre className="overflow-x-auto bg-[var(--code-bg)] p-5">
        <code className="whitespace-pre font-mono text-[13px] leading-relaxed text-[var(--code-text)]">
          {code}
        </code>
      </pre>
    </div>
  );
}
