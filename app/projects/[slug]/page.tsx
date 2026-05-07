import Link from "next/link";
import { notFound } from "next/navigation";
import CodeBlock from "../../components/CodeBlock";
import Tag from "../../components/Tag";
import { getProject, projects } from "../../data/projects";

export async function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);

  return {
    title: project ? `${project.title} — Divya Soni` : "Not Found",
  };
}

export default async function ProjectDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const { writeup, snippet } = project;

  return (
    <main className="mx-auto max-w-[780px] px-5 py-16 sm:px-6 sm:py-20">
      <Link
        href="/projects"
        className="mb-10 inline-flex items-center text-sm font-medium text-muted transition-colors duration-150 hover:text-primary"
      >
        ← Projects
      </Link>

      <header className="mb-10">
        <p className="mb-3 text-sm font-medium uppercase tracking-[0.14em] text-primary">
          {project.role}
        </p>
        <h1 className="text-4xl font-semibold leading-tight tracking-normal text-foreground sm:text-5xl">
          {project.title}
        </h1>
        <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
          <span>{project.year}</span>
          <span>{project.language}</span>
          <span>{project.stars} stars</span>
        </div>
        <p className="mt-6 text-lg leading-8 text-muted">{project.description}</p>
        <div className="mt-7 flex flex-wrap gap-3">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center rounded-full bg-foreground px-4 text-sm font-medium text-background transition-opacity duration-150 hover:opacity-90"
            >
              View Source →
            </a>
          )}
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center rounded-full border border-line bg-surface px-4 text-sm font-medium text-foreground transition-colors duration-150 hover:border-primary/40 hover:text-primary"
            >
              Live Demo →
            </a>
          )}
        </div>
      </header>

      <article className="prose">
        <h2>Overview</h2>
        <p>{project.description}</p>

        {writeup?.architecture && (
          <>
            <h2>Architecture</h2>
            <p>{writeup.architecture}</p>
          </>
        )}

        {writeup?.quote && <blockquote>{writeup.quote}</blockquote>}

        {writeup?.implementation && (
          <>
            <h2>Implementation</h2>
            <p>{writeup.implementation}</p>
          </>
        )}

        {snippet && <CodeBlock code={snippet.code} language={snippet.language} />}

        {writeup?.results && (
          <>
            <h2>Results</h2>
            <p>{writeup.results}</p>
          </>
        )}

        <div className="mt-8 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>
      </article>
    </main>
  );
}
