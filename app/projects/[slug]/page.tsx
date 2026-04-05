import { notFound } from "next/navigation";
import Link from "next/link";
import { projects, getProject } from "../../data/projects";
import CodeBlock from "../../components/CodeBlock";
import Tag from "../../components/Tag";

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
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
    <main className="max-w-[640px] mx-auto px-6 py-24">
      <Link
        href="/projects"
        className="font-mono text-[13px] text-muted hover:text-primary transition-colors duration-100 mb-10 inline-block"
      >
        ← projects
      </Link>

      <div className="mb-10">
        <h1 className="text-5xl font-semibold tracking-[-0.02em] text-foreground mb-4">
          {project.title}
        </h1>
        <div className="flex items-center gap-6 mb-6">
          <span className="font-mono text-[13px] text-muted">{project.year}</span>
          <span className="font-mono text-[13px] text-muted">{project.role}</span>
          <span className="font-mono text-[13px] text-muted">{project.language}</span>
        </div>
        <div className="flex gap-3">
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[13px] font-medium h-8 px-4 border border-foreground bg-foreground text-background flex items-center hover:opacity-90 transition-opacity duration-100"
          >
            View Source →
          </a>
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[13px] h-8 px-4 border border-foreground text-foreground flex items-center hover:bg-foreground hover:text-background transition-colors duration-100"
            >
              Live Demo ↗
            </a>
          )}
        </div>
      </div>

      <div className="prose">
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

        {snippet && (
          <CodeBlock code={snippet.code} language={snippet.language} />
        )}

        {writeup?.results && (
          <>
            <h2>Results</h2>
            <p>{writeup.results}</p>
          </>
        )}

        <div className="flex flex-wrap gap-2 mt-8">
          {project.tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}
        </div>
      </div>
    </main>
  );
}
