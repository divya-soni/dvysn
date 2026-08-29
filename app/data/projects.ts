import projectsData from '@/content/projects.json';

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
  year: string;
  role: string;
  language: string;
  stars: number;
  github: string | null;
  demo: string | null;
  live?: string | null;
  featured: boolean;
  writeup?: ProjectWriteup;
  snippet?: ProjectSnippet;
}

export const projects = [...(projectsData as Project[])].sort((a, b) =>
  b.date.localeCompare(a.date),
);

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
