'use client';

import { useState } from 'react';

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
    <div className="border border-line my-6 rounded-[4px] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-line bg-surface">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-line" />
          <span className="w-3 h-3 rounded-full bg-line" />
          <span className="w-3 h-3 rounded-full bg-line" />
        </div>
        <div className="flex items-center gap-4">
          {language && (
            <span className="font-mono text-[11px] text-muted">{language}</span>
          )}
          <button
            onClick={handleCopy}
            className={`font-mono text-[11px] transition-colors duration-100 ${
              copied
                ? 'text-emerald-500'
                : 'text-muted hover:text-foreground'
            }`}
          >
            {copied ? '✓ copied' : 'copy'}
          </button>
        </div>
      </div>
      <pre className="bg-black p-5 overflow-x-auto">
        <code className="font-mono text-[13px] text-foreground/90 leading-relaxed whitespace-pre">
          {code}
        </code>
      </pre>
    </div>
  );
}
