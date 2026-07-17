import Link from "next/link";
import type { Project } from "../data/projects";
import ProjectMotif from "./ProjectMotif";
import Tag from "./Tag";

export default function ProjectRow({
  project,
  index,
  compact = false,
}: {
  project: Project;
  index: number;
  compact?: boolean;
}) {
  return (
    <article className={`project-row ${compact ? "project-row--compact" : ""}`}>
      <Link href={`/projects/${project.slug}`} className="project-row__visual" tabIndex={-1} aria-hidden="true">
        <ProjectMotif slug={project.slug} year={project.year} tags={project.tags} />
      </Link>
      <div className="project-row__content">
        <div className="project-row__meta">
          <span>{String(index).padStart(2, "0")}</span>
          <span>{project.year}</span>
          <span>{project.stars} {project.stars === 1 ? "star" : "stars"}</span>
        </div>
        <h3 className="project-row__title display">
          <Link href={`/projects/${project.slug}`}>
            {project.title}
            <span className="arrow" aria-hidden="true">↗</span>
          </Link>
        </h3>
        <p className="project-row__description">{project.description}</p>
        <div className="project-row__footer">
          <div className="tag-list">
            {project.tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}
          </div>
          <div className="availability" aria-label="Available project links">
            {project.github && <span>Source</span>}
            {project.demo && <span>Demo</span>}
          </div>
        </div>
      </div>
    </article>
  );
}
