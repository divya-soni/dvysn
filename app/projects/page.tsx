import ProjectsGrid from "../components/ProjectsGrid";
import { projects } from "../data/projects";

export const metadata = {
  title: "Projects — Divya Soni",
};

export default function ProjectsPage() {
  return (
    <main className="mx-auto max-w-[980px] px-5 py-20 sm:px-6 sm:py-24">
      <div className="mb-10 max-w-2xl">
        <p className="mb-3 text-sm font-medium uppercase tracking-[0.14em] text-primary">
          Projects
        </p>
        <h1 className="text-4xl font-semibold tracking-normal text-foreground sm:text-5xl">
          A few things I&apos;ve built recently.
        </h1>
        <p className="mt-4 text-base leading-7 text-muted">
          More fun stuff coming soon!
        </p>
      </div>
      <ProjectsGrid projects={projects} />
    </main>
  );
}
