import Link from "next/link";
import { projects } from "../data/projects";

export const metadata = { title: "Work" };

export default function ProjectsPage() {
  return (
    <main id="main-content" className="page shell">
      <h1 className="page-title">Work</h1>
      <ul className="work-list">
        {projects.map((project) => (
          <li key={project.slug} className="work-item">
            <h2 className="work-item-title">
              <Link href={`/projects/${project.slug}`}>{project.title}</Link>
            </h2>
            <span className="index-meta">{project.year}</span>
          </li>
        ))}
      </ul>
    </main>
  );
}
