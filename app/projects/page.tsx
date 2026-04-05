import { projects } from "../data/projects";
import ProjectsGrid from "../components/ProjectsGrid";

export const metadata = {
  title: "Projects — Divya Soni",
};

export default function ProjectsPage() {
  return (
    <main className="max-w-[800px] mx-auto px-6 py-24">
      <div className="mb-10">
        <h1 className="text-4xl font-semibold tracking-[-0.02em] text-foreground mb-2">
          Projects
        </h1>
        <p className="text-[15px] text-muted">
          A few things I&apos;ve built recently. More fun stuff coming soon!
        </p>
      </div>
      <ProjectsGrid projects={projects} />
    </main>
  );
}
