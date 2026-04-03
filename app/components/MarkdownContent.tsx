'use client';

import { useEffect, useRef } from 'react';

export default function MarkdownContent({ html }: { html: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    container.querySelectorAll('pre').forEach((pre) => {
      if (pre.parentElement?.classList.contains('code-block')) return;

      const code = pre.querySelector('code');
      const text = code?.textContent ?? '';

      const wrapper = document.createElement('div');
      wrapper.className =
        'code-block border border-[#27272A] my-6 rounded-[4px] overflow-hidden';

      const bar = document.createElement('div');
      bar.className =
        'flex items-center justify-between px-4 py-2.5 border-b border-[#27272A] bg-[#18181B]';
      bar.innerHTML = `
        <div class="flex items-center gap-1.5">
          <span class="w-3 h-3 rounded-full bg-[#27272A] block"></span>
          <span class="w-3 h-3 rounded-full bg-[#27272A] block"></span>
          <span class="w-3 h-3 rounded-full bg-[#27272A] block"></span>
        </div>
        <button class="copy-btn font-mono text-[11px] text-[#A1A1AA] hover:text-[#FAFAFA] transition-colors duration-100">copy</button>
      `;

      pre.className = 'bg-black p-5 overflow-x-auto m-0';
      if (code) {
        code.className =
          'font-mono text-[13px] leading-relaxed whitespace-pre text-white/90';
      }

      pre.parentNode!.insertBefore(wrapper, pre);
      wrapper.appendChild(bar);
      wrapper.appendChild(pre);

      const btn = bar.querySelector('.copy-btn') as HTMLButtonElement;
      btn.addEventListener('click', async () => {
        await navigator.clipboard.writeText(text);
        btn.textContent = '✓ copied';
        btn.style.color = '#10B981';
        setTimeout(() => {
          btn.textContent = 'copy';
          btn.style.color = '';
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
