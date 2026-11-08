import WorkIndex from "../components/WorkIndex";
import { projects } from "../data/projects";

export const metadata = { title: "Work" };

export default function ProjectsPage() {
  return (
    <main id="main-content" className="page shell">
      <h1 className="page-title">Work</h1>
      <p className="section-lede">
        Small tools around language models, numbered in the order I made them. Each one has a drawing you can play with.
      </p>
      <WorkIndex projects={projects} heading="All work" />
    </main>
  );
}
