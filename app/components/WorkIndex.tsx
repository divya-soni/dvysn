import Link from "next/link";
import IndexHover from "./IndexHover";
import type { NumberedProject } from "../data/projects";

/** The numbered list of work, with the hovered project's drawing beside it on wide screens. */
export default function WorkIndex({ projects, heading = "Work" }: { projects: NumberedProject[]; heading?: string }) {
  const first = projects[0]?.slug ?? "";
  return (
    <section className="work-index" aria-labelledby="work-heading">
      <h2 id="work-heading" className="section-label">
        {heading}
      </h2>
      <IndexHover items={projects.map(({ slug, number }) => ({ slug, number }))}>
        <ol className="idx-list">
          {projects.map((p) => (
            <li key={p.slug}>
              <Link href={`/projects/${p.slug}`} className="idx-row" data-row={p.slug} data-on={p.slug === first ? "1" : "0"}>
                <span className="idx-n">{p.number}</span>
                <span className="idx-title">{p.title}</span>
                <span className="idx-line">{p.description}</span>
              </Link>
            </li>
          ))}
        </ol>
      </IndexHover>
    </section>
  );
}
