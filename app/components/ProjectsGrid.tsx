import type { Project } from "@/app/data/projects";
import ProjectRow from "./ProjectRow";

export default function ProjectsGrid({ projects }: { projects: Project[] }) {
  return (
    <div className="project-list">
      {projects.map((project, index) => (
        <ProjectRow key={project.slug} project={project} index={index + 1} />
      ))}
    </div>
  );
}
