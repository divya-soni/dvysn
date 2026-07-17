import type { CSSProperties } from "react";

function hashString(value: string) {
  return [...value].reduce((hash, char) => (hash * 31 + char.charCodeAt(0)) >>> 0, 0);
}

export default function ProjectMotif({
  slug,
  year,
  tags,
  className = "",
}: {
  slug: string;
  year: string;
  tags: string[];
  className?: string;
}) {
  const seed = hashString(`${slug}-${year}-${tags.join("-")}`);
  const x = 120 + (seed % 340);
  const y = 90 + ((seed >> 5) % 240);
  const radius = 80 + ((seed >> 9) % 100);
  const scanX = 90 + ((seed >> 4) % 620);
  const style = {
    "--motif-phase": `${seed % 100}%`,
  } as CSSProperties;

  return (
    <div className={`project-motif ${className}`} style={style} aria-hidden="true">
      <svg viewBox="0 0 800 520" role="presentation" focusable="false">
        <defs>
          <pattern id={`grid-${slug}`} width="28" height="28" patternUnits="userSpaceOnUse">
            <path d="M 28 0 L 0 0 0 28" fill="none" stroke="currentColor" strokeWidth="1" />
          </pattern>
          <radialGradient id={`wash-${slug}`}>
            <stop offset="0" stopColor="currentColor" stopOpacity="0.26" />
            <stop offset="0.58" stopColor="currentColor" stopOpacity="0.07" />
            <stop offset="1" stopColor="currentColor" stopOpacity="0" />
          </radialGradient>
          <filter id={`glow-${slug}`} x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <rect width="800" height="520" fill={`url(#grid-${slug})`} opacity="0.16" />
        <circle cx={x} cy={y} r={radius * 1.8} fill={`url(#wash-${slug})`} />
        <g fill="none" stroke="currentColor">
          <circle cx={x} cy={y} r={radius} strokeWidth="2" strokeDasharray={`${radius * 1.5} 24`} />
          <circle cx={x} cy={y} r={radius * 0.72} strokeWidth="1" strokeDasharray="7 12" opacity="0.72" />
          <circle cx={x} cy={y} r={radius * 0.35} strokeWidth="3" opacity="0.9" filter={`url(#glow-${slug})`} />
          <path d={`M ${x - radius * 1.2} ${y} H ${x - radius * 0.42} M ${x + radius * 0.42} ${y} H ${x + radius * 1.2}`} />
          <path d={`M ${x} ${y - radius * 1.2} V ${y - radius * 0.42} M ${x} ${y + radius * 0.42} V ${y + radius * 1.2}`} />
          <path d={`M ${scanX} 42 V 478`} opacity="0.35" />
          <path d={`M 56 92 H ${Math.max(180, x - radius - 30)} L ${Math.max(205, x - radius - 5)} 117`} strokeWidth="2" />
          <path d="M56 68H210M56 76H154" strokeWidth="2" />
          <path d="M742 405V458H688M58 118V64H112" strokeWidth="3" />
        </g>
        <circle cx={x} cy={y} r="6" fill="currentColor" filter={`url(#glow-${slug})`} />
        <circle cx={690 - (seed % 180)} cy={410 - (seed % 120)} r="5" fill="var(--signal)" />
      </svg>
      <div className="project-motif__meta">
        <span>{year}</span>
        <span>{tags[0]}</span>
      </div>
      <span className="project-motif__code">{slug.replaceAll("-", " / ")}</span>
    </div>
  );
}
