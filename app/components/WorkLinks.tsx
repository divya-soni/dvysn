import type { ReactNode } from "react";
import type { Project } from "../data/projects";

function GitHubIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path
        fill="currentColor"
        d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.22 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8"
      />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path
        fill="currentColor"
        d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1m0 1.15c.86 0 1.66.7 2.28 1.85.3.55.54 1.2.7 1.9H5.02c.16-.7.4-1.35.7-1.9C6.34 2.85 7.14 2.15 8 2.15m-3.86 5c.16-.8.41-1.55.73-2.12.5-.9 1.1-1.48 1.7-1.7A6 6 0 0 0 3.2 7.15zm7.72 0h1.94A6 6 0 0 0 9.43 3.33c.6.22 1.2.8 1.7 1.7.32.57.57 1.32.73 2.12M3.2 8.85a6 6 0 0 0 3.37 3.82c-.6-.22-1.2-.8-1.7-1.7a7 7 0 0 1-.73-2.12zm2.55 0h5.5c-.16.8-.41 1.55-.73 2.12-.62 1.15-1.42 1.85-2.28 1.85s-1.66-.7-2.28-1.85a7 7 0 0 1-.73-2.12m6.32 0c-.16.8-.41 1.55-.73 2.12-.5.9-1.1 1.48-1.7 1.7a6 6 0 0 0 3.37-3.82z"
      />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12.12.75h2.37L9.4 7.05 16 15.25h-4.86L7.4 10.04l-4.36 5.21H.66l5.43-6.55L0 .75h4.99l3.52 4.97zm-.83 13.05h1.31L4.57 2.07H3.16z"
      />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path
        fill="currentColor"
        d="M14.5 1H1.5C.67 1 0 1.67 0 2.5v11c0 .83.67 1.5 1.5 1.5h13c.83 0 1.5-.67 1.5-1.5v-11C16 1.67 15.33 1 14.5 1M4.75 13H2.6V6.2h2.15zm-1.07-7.75a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5M13.4 13h-2.14V9.55c0-.82-.02-1.87-1.14-1.87-1.14 0-1.31.89-1.31 1.81V13H6.67V6.2h2.05v.93h.03c.29-.54.98-1.11 2.02-1.11 2.16 0 2.56 1.42 2.56 2.56z"
      />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path
        fill="currentColor"
        d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1m-.5 4.2 4.2 2.8-4.2 2.8z"
      />
    </svg>
  );
}

function demoIcon(href: string) {
  if (/x\.com|twitter\.com/i.test(href)) return <XIcon />;
  if (/linkedin\.com/i.test(href)) return <LinkedInIcon />;
  return <PlayIcon />;
}

export default function WorkLinks({ project }: { project: Project }) {
  const links: { href: string; label: string; icon: ReactNode }[] = [];

  if (project.github) {
    links.push({ href: project.github, label: "Source", icon: <GitHubIcon /> });
  }
  if (project.live) {
    links.push({ href: project.live, label: "Live", icon: <GlobeIcon /> });
  }
  if (project.demo) {
    links.push({ href: project.demo, label: "Demo", icon: demoIcon(project.demo) });
  }

  if (links.length === 0) return null;

  return (
    <div className="work-links">
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="work-link"
        >
          {link.icon}
          {link.label}
        </a>
      ))}
    </div>
  );
}
