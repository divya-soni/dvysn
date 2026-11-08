import projectsData from "@/content/projects.json";

export interface ProjectWriteup {
  architecture?: string;
  quote?: string;
  implementation?: string;
  results?: string;
}

export interface ProjectSnippet {
  language: string;
  code: string;
}

export interface Project {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  date: string;
  github: string | null;
  demo: string | null;
  live?: string | null;
  writeup?: ProjectWriteup;
  snippet?: ProjectSnippet;
}

export type NumberedProject = Project & { number: string };

const oldestFirst = [...(projectsData as Project[])].sort((a, b) => a.date.localeCompare(b.date));

/**
 * Projects, newest first. Each keeps a stable number in the order it was made,
 * so 01 is the oldest and a new project simply becomes the next number.
 */
export const projects: NumberedProject[] = oldestFirst
  .map((p, i) => ({ ...p, number: String(i + 1).padStart(2, "0") }))
  .reverse();

export function getProject(slug: string): NumberedProject | undefined {
  return projects.find((p) => p.slug === slug);
}
