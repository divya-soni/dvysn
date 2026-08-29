import Link from "next/link";
import { projects } from "../data/projects";
import { formatDate } from "@/lib/date";

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
            <time className="index-meta" dateTime={project.date}>
              {formatDate(project.date)}
            </time>
          </li>
        ))}
      </ul>
    </main>
  );
}
