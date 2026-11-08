import Link from "next/link";
import { notFound } from "next/navigation";
import CodeBlock from "../../components/CodeBlock";
import ProjectKeys from "../../components/ProjectKeys";
import Schematic from "../../components/schematics/Schematic";
import WorkLinks from "../../components/WorkLinks";
import { getProject, projects } from "../../data/projects";
import { formatDate } from "@/lib/date";

export async function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  return {
    title: project?.title ?? "Not Found",
    description: project?.description,
  };
}

export default async function ProjectDetail({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const { writeup, snippet } = project;
  const i = projects.findIndex((item) => item.slug === slug);
  // the list is newest first, so "previous" is the older project
  const older = projects[(i + 1) % projects.length];
  const newer = projects[(i - 1 + projects.length) % projects.length];
  const byNumber = [...projects].reverse();

  return (
    <main id="main-content" className="page chapter-page">
      <ProjectKeys prev={`/projects/${older.slug}`} next={`/projects/${newer.slug}`} />
      <nav className="rail" aria-label="All projects">
        <ol>
          {byNumber.map((p) => (
            <li key={p.slug}>
              <Link href={`/projects/${p.slug}`} aria-current={p.slug === slug ? "page" : undefined} title={p.title}>
                {p.number}
              </Link>
            </li>
          ))}
        </ol>
      </nav>

      <div className="chapter">
        <div className="chapter-drawing">
          <Schematic slug={slug} />
        </div>

        <article className="chapter-text">
          <p className="chapter-n">{project.number}</p>
          <h1 className="chapter-title">{project.title}</h1>
          <p className="chapter-line">{project.description}</p>
          <p className="chapter-meta">
            <time dateTime={project.date}>{formatDate(project.date)}</time>
            <span aria-hidden="true"> · </span>
            {project.tags.join(" · ")}
          </p>
          <WorkLinks project={project} />

          <div className="prose">
            {writeup?.architecture && (
              <>
                <h2>How it is put together</h2>
                <p>{writeup.architecture}</p>
              </>
            )}
            {writeup?.quote && <blockquote>{writeup.quote}</blockquote>}
            {writeup?.implementation && (
              <>
                <h2>How it was built</h2>
                <p>{writeup.implementation}</p>
              </>
            )}
            {snippet && <CodeBlock code={snippet.code} />}
            {writeup?.results && (
              <>
                <h2>What came of it</h2>
                <p>{writeup.results}</p>
              </>
            )}
          </div>

          <nav className="chapter-nav" aria-label="More projects">
            <Link href={`/projects/${older.slug}`}>
              <span className="chapter-nav-k">← {older.number}</span> {older.title}
            </Link>
            <Link href={`/projects/${newer.slug}`}>
              {newer.title} <span className="chapter-nav-k">{newer.number} →</span>
            </Link>
          </nav>
        </article>
      </div>
    </main>
  );
}
