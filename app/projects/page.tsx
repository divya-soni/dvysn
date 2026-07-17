import { PageHeader } from "../components/PageHeader";
import ProjectsGrid from "../components/ProjectsGrid";
import { projects } from "../data/projects";

export const metadata = { title: "Projects" };

export default function ProjectsPage() {
  return (
    <main id="main-content" className="page-shell shell">
      <PageHeader
        eyebrow={`Project archive / ${String(projects.length).padStart(2, "0")}`}
        title={<>A few things I&apos;ve built <em>recently.</em></>}
        description="More fun stuff coming soon!"
        aside={<p>Systems, agents,<br />and useful experiments.</p>}
      />
      <ProjectsGrid projects={projects} />
    </main>
  );
}
