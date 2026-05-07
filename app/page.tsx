import Image from "next/image";
import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import FadeIn from "./components/FadeIn";
import Tag from "./components/Tag";
import { featuredProjects } from "./data/projects";
import profileImg from "../public/avatar.jpeg";

const socials = [
  {
    label: "GitHub",
    href: "https://github.com/divya-soni",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/divya-soni14",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: "X",
    href: "https://x.com/thedivyasoni",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "Email",
    href: "mailto:divya.rajeshsoni@gmail.com",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
  },
];

const experience = [
  {
    company: "Wells Fargo",
    role: "Software Engineer",
    period: "Aug 2024 — now",
    location: "Hyderabad, India",
    description:
      "Building dsitributed systems for large-scale data processing and analytics. Working with Java, Springboot, Spark, Kubernetes and MongoDB.",
  },
  {
    company: "ShopOS",
    role: "AI Engineer Intern",
    period: "Jan 2024 — Jul 2024",
    location: "Remote",
    description:
      "Shipped POCs around everything image gen. Worked with LLMs and diffusion models using python, flask and react.",
  },
];

const skills = [
  { category: "Languages", items: ["Java", "Javascript", "Python"] },
  {
    category: "Frameworks",
    items: ["Springboot", "React", "Next.js", "Node.js", "Flask"],
  },
  { category: "Infra", items: ["Kubernetes", "Linux", "MongoDB"] },
];

function SectionHeading({
  eyebrow,
  action,
}: {
  eyebrow: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-5 flex items-center justify-between gap-4">
      <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-muted">
        {eyebrow}
      </h2>
      {action}
    </div>
  );
}

export default function Home() {
  const recentPosts = getAllPosts().slice(0, 3);

  return (
    <main>
      <section className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-[980px] items-center gap-10 px-5 py-16 sm:px-6 lg:grid-cols-[1fr_280px] lg:py-24">
        <div className="animate-fade-up">
          <p className="mb-5 text-sm font-medium uppercase tracking-[0.14em] text-primary">
            Software Engineer at Wells Fargo · Hyderabad, Telangana
          </p>
          <h1 className="max-w-3xl text-[3rem] font-semibold leading-[0.98] tracking-normal text-foreground sm:text-[4.5rem]">
            hey, i&apos;m divya.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
            I build with distributed systems at work and tinker with AI in my
            free time. I love building software that feels magical, and hate
            writing about myself in the third person.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/projects"
              className="inline-flex h-11 items-center rounded-full bg-foreground px-5 text-sm font-medium text-background transition-opacity duration-150 hover:opacity-90"
            >
              View projects
            </Link>
            <Link
              href="/blog"
              className="inline-flex h-11 items-center rounded-full border border-line bg-surface px-5 text-sm font-medium text-foreground transition-colors duration-150 hover:border-primary/40 hover:text-primary"
            >
              Read writing
            </Link>
          </div>
        </div>

        <div
          className="animate-fade-up justify-self-start lg:justify-self-end"
          style={{ animationDelay: "120ms" }}
        >
          <div className="rounded-[8px] border border-line bg-surface p-3 shadow-[var(--shadow-soft)]">
            <Image
              src={profileImg}
              alt="Divya Soni"
              width={248}
              height={248}
              className="aspect-square rounded-[6px] object-cover"
              priority
            />
          </div>
          <div className="mt-4 flex items-center gap-2">
            {socials.map(({ label, href, icon }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("mailto") ? undefined : "_blank"}
                rel={href.startsWith("mailto") ? undefined : "noopener noreferrer"}
                aria-label={label}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface text-muted transition-colors duration-150 hover:border-primary/40 hover:text-primary"
              >
                {icon}
              </a>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[780px] px-5 pb-24 sm:px-6">
        <FadeIn className="mb-18">
          <SectionHeading eyebrow="Stack" />
          <div className="space-y-4 rounded-lg border border-line bg-surface p-5 shadow-[var(--shadow-soft)]">
            {skills.map(({ category, items }) => (
              <div
                key={category}
                className="grid gap-3 sm:grid-cols-[120px_1fr] sm:items-start"
              >
                <span className="text-sm font-medium text-foreground">
                  {category}
                </span>
                <div className="flex flex-wrap gap-2">
                  {items.map((tag) => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </FadeIn>

        <FadeIn className="mb-18">
          <SectionHeading eyebrow="Experience" />
          <div className="divide-y divide-line rounded-lg border border-line bg-surface shadow-[var(--shadow-soft)]">
            {experience.map(({ company, role, period, location, description }) => (
              <article key={company} className="p-5">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                  <h3 className="text-base font-semibold text-foreground">
                    {company}
                  </h3>
                  <span className="text-sm text-muted">{period}</span>
                </div>
                <p className="mt-1 text-sm font-medium text-primary">
                  {role} · {location}
                </p>
                <p className="mt-3 text-sm leading-6 text-muted">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </FadeIn>

        <FadeIn className="mb-18">
          <SectionHeading
            eyebrow="Projects"
            action={
              <Link
                href="/projects"
                className="text-sm font-medium text-muted transition-colors duration-150 hover:text-primary"
              >
                View all →
              </Link>
            }
          />
          <div className="grid gap-3">
            {featuredProjects.map((project) => (
              <Link
                key={project.slug}
                href={`/projects/${project.slug}`}
                className="group rounded-lg border border-line bg-surface p-5 shadow-[var(--shadow-soft)] transition-all duration-150 hover:-translate-y-0.5 hover:border-primary/40"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <h3 className="text-xl font-semibold text-foreground transition-colors duration-150 group-hover:text-primary">
                    {project.title}
                  </h3>
                  <span className="text-sm text-muted">{project.year}</span>
                </div>
                <p className="mt-3 text-sm leading-6 text-muted">
                  {project.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </FadeIn>

        <FadeIn>
          <SectionHeading
            eyebrow="Writing"
            action={
              <Link
                href="/blog"
                className="text-sm font-medium text-muted transition-colors duration-150 hover:text-primary"
              >
                View all →
              </Link>
            }
          />
          <div className="divide-y divide-line rounded-lg border border-line bg-surface shadow-[var(--shadow-soft)]">
            {recentPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group grid gap-2 p-5 transition-colors duration-150 hover:bg-surface-soft sm:grid-cols-[1fr_110px]"
              >
                <div>
                  <h3 className="text-base font-semibold text-foreground transition-colors duration-150 group-hover:text-primary">
                    {post.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted">
                    {post.excerpt}
                  </p>
                </div>
                <time className="text-sm text-muted sm:text-right">
                  {post.date}
                </time>
              </Link>
            ))}
          </div>
        </FadeIn>
      </div>
    </main>
  );
}
