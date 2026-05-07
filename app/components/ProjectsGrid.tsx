"use client";

import Link from "next/link";
import Tag from "@/app/components/Tag";
import type { Project } from "@/app/data/projects";

interface Props {
  projects: Project[];
}

export default function ProjectsGrid({ projects }: Props) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      {projects.map((project) => (
        <Link
          key={project.slug}
          href={`/projects/${project.slug}`}
          className="group flex min-h-[260px] flex-col rounded-lg border border-line bg-surface p-5 shadow-[var(--shadow-soft)] transition-all duration-150 hover:-translate-y-0.5 hover:border-primary/40"
        >
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-muted">{project.year}</p>
              <h2 className="mt-1 text-xl font-semibold text-foreground transition-colors duration-150 group-hover:text-primary">
                {project.title}
              </h2>
            </div>
            <div className="flex items-center gap-1 rounded-full border border-line bg-surface-soft px-2.5 py-1 text-muted">
              <svg
                className="h-3.5 w-3.5"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span className="text-xs">{project.stars}</span>
            </div>
          </div>
          <p className="text-sm leading-6 text-muted">{project.description}</p>
          <div className="mt-auto flex flex-wrap gap-2 pt-5">
            {project.tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
        </Link>
      ))}
    </div>
  );
}
