import Link from "next/link";
import { notFound } from "next/navigation";
import CodeBlock from "../../components/CodeBlock";
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
  const projectIndex = projects.findIndex((item) => item.slug === slug);
  const nextProject = projects[(projectIndex + 1) % projects.length];

  return (
    <main id="main-content" className="page shell">
      <article className="work">
        <h1>{project.title}</h1>
        <time className="work-kicker" dateTime={project.date}>
          {formatDate(project.date)}
        </time>
        <WorkLinks project={project} />

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
