import Link from "next/link";
import { notFound } from "next/navigation";
import CodeBlock from "../../components/CodeBlock";
import MetadataList from "../../components/MetadataList";
import ProjectMotif from "../../components/ProjectMotif";
import Tag from "../../components/Tag";
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

  return (
    <main id="main-content" className="project-detail">
      <div className="shell project-detail__top">
        <Link href="/projects" className="back-link"><span aria-hidden="true">←</span> Project archive</Link>
        <span className="project-detail__index">Project {String(projectIndex + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}</span>
      </div>

      <header className="shell project-hero">
        <div className="project-hero__copy">
          <p className="eyebrow">{project.role} / {project.year}</p>
          <h1 className="display">{project.title}</h1>
          <p>{project.description}</p>
          <div className="project-actions">
            {project.live && (
              <a href={project.live} target="_blank" rel="noopener noreferrer" className="button button--primary">
                Open project <span aria-hidden="true">↗</span>
              </a>
            )}
            {project.github && (
              <a href={project.github} target="_blank" rel="noopener noreferrer" className={project.live ? "button button--outline" : "button button--primary"}>
                View source <span aria-hidden="true">↗</span>
              </a>
            )}
            {project.demo && (
              <a href={project.demo} target="_blank" rel="noopener noreferrer" className="button button--outline">
                Watch demo <span aria-hidden="true">↗</span>
              </a>
            )}
          </div>
        </div>
        <ProjectMotif slug={project.slug} year={project.year} tags={project.tags} className="project-hero__motif" />
      </header>

      <div className="shell project-story">
        <aside className="project-story__aside">
          <p className="eyebrow">Project record</p>
          <MetadataList items={[
            { label: "Year", value: project.year },
            { label: "Role", value: project.role },
            { label: "Language", value: project.language },
            { label: "Stars", value: project.stars },
          ]} />
          <div className="tag-list project-story__tags">
            {project.tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}
          </div>
        </aside>

        <article className="project-narrative prose">
          <section>
            <p className="section-kicker">01 / Overview</p>
            <h2>Overview</h2>
            <p>{project.description}</p>
          </section>
          {writeup?.architecture && (
            <section>
              <p className="section-kicker">02 / Architecture</p>
              <h2>Architecture</h2>
              <p>{writeup.architecture}</p>
            </section>
          )}
          {writeup?.quote && <blockquote>{writeup.quote}</blockquote>}
          {writeup?.implementation && (
            <section>
              <p className="section-kicker">03 / Implementation</p>
              <h2>Implementation</h2>
              <p>{writeup.implementation}</p>
              {snippet && <CodeBlock code={snippet.code} language={snippet.language} />}
            </section>
          )}
          {writeup?.results && (
            <section>
              <p className="section-kicker">04 / Results</p>
              <h2>Results</h2>
              <p>{writeup.results}</p>
            </section>
          )}
        </article>
      </div>

      <Link href={`/projects/${nextProject.slug}`} className="next-project">
        <span>Next project</span>
        <strong className="display">{nextProject.title}</strong>
        <span className="next-project__arrow" aria-hidden="true">↗</span>
      </Link>
    </main>
  );
}
