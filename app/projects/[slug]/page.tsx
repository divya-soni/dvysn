import Link from "next/link";
import { notFound } from "next/navigation";
import CodeBlock from "../../components/CodeBlock";
import { getProject, projects } from "../../data/projects";

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
  const projectIndex = projects.findIndex((item) => item.slug === slug);
  const nextProject = projects[(projectIndex + 1) % projects.length];
  const hasLinks = Boolean(project.github || project.live || project.demo);

  return (
    <main id="main-content" className="page shell">
      <article className="work">
        <h1>{project.title}</h1>
        <p className="work-kicker">{project.year}</p>
        {hasLinks && (
          <div className="work-links">
            {project.github && (
              <a href={project.github} target="_blank" rel="noopener noreferrer">
                Source
              </a>
            )}
            {project.live && (
              <a href={project.live} target="_blank" rel="noopener noreferrer">
                Live
              </a>
            )}
            {project.demo && (
              <a href={project.demo} target="_blank" rel="noopener noreferrer">
                Demo
              </a>
            )}
          </div>
        )}

        <div className="prose">
          <p>{project.description}</p>
          {writeup?.architecture && <p>{writeup.architecture}</p>}
          {writeup?.quote && <blockquote>{writeup.quote}</blockquote>}
          {writeup?.implementation && <p>{writeup.implementation}</p>}
          {snippet && <CodeBlock code={snippet.code} />}
          {writeup?.results && <p>{writeup.results}</p>}
        </div>

        <Link href={`/projects/${nextProject.slug}`} className="work-next">
          {nextProject.title}
        </Link>
      </article>
    </main>
  );
}
