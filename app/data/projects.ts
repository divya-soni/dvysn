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
  year: string;
  role: string;
  language: string;
  stars: number;
  github: string | null;
  demo: string | null;
  featured: boolean;
  writeup?: ProjectWriteup;
  snippet?: ProjectSnippet;
}

export const projects = projectsData as Project[];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export const featuredProjects = projects.filter((p) => p.featured);
 
