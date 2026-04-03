import Link from "next/link";
import Tag from "./components/Tag";
import { featuredProjects } from "./data/projects";
import { getAllPosts } from "@/lib/blog";

const socials = [
  { label: "github",   href: "https://github.com/divya-soni-14" },
  { label: "linkedin", href: "https://linkedin.com/in/divya-soni-14" },
  { label: "x",        href: "https://x.com/dvysn" },
  { label: "email",    href: "mailto:hello@dvysn.com" },
];

const skills = [
  { category: "Languages", items: ["Go", "TypeScript", "Rust", "Python", "SQL"] },
  { category: "Frameworks", items: ["React", "Next.js", "gRPC", "Node.js"] },
  { category: "Infra", items: ["PostgreSQL", "Redis", "Docker", "Kubernetes", "AWS"] },
];

export default function Home() {
  const recentPosts = getAllPosts().slice(0, 3);

  return (
    <main className="max-w-[640px] mx-auto px-6 py-24">
      <section className="mb-16">
        {/* Replace public/avatar.svg with your photo */}
        <div className="flex items-center gap-6 mb-8">
          <img
            src="/avatar.svg"
            alt="Divya Soni"
            width={72}
            height={72}
            className="rounded-[4px] grayscale flex-shrink-0"
          />
          <h1 className="text-[48px] font-semibold tracking-[-0.03em] text-foreground leading-none">
            Divya<br />Soni
          </h1>
        </div>

        <div className="h-px bg-line mb-6" />

        <p className="font-mono text-[13px] text-primary mb-5">
          {'> '}software engineer<span className="animate-pulse">_</span>
        </p>

        <p className="text-[15px] text-muted leading-relaxed mb-8 max-w-[440px]">
          Distributed systems and developer tooling. Currently building
          infrastructure for reliability and performance at scale.
        </p>

        <div className="flex items-center gap-2.5 mb-5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="font-mono text-[13px] text-muted">
            Available for new opportunities
          </span>
        </div>

        <div className="flex items-center gap-5 pt-5 border-t border-line">
          {socials.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("mailto") ? undefined : "_blank"}
              rel={href.startsWith("mailto") ? undefined : "noopener noreferrer"}
              className="font-mono text-[13px] text-muted border border-line px-3 h-8 flex items-center hover:border-primary hover:text-primary transition-colors duration-100"
            >
              {label} ↗
            </a>
          ))}
        </div>
      </section>

      <section className="mb-16">
        <h2 className="font-mono text-[13px] uppercase tracking-[0.08em] text-muted mb-5">
          Stack
        </h2>
        <div className="flex flex-col gap-3">
          {skills.map(({ category, items }) => (
            <div key={category} className="flex items-start gap-6">
              <span className="font-mono text-[12px] text-muted w-20 pt-0.5 flex-shrink-0">
                {category}
              </span>
              <div className="flex flex-wrap gap-2">
                {items.map((tag) => <Tag key={tag}>{tag}</Tag>)}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-16">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-mono text-[13px] uppercase tracking-[0.08em] text-muted">
            Projects
          </h2>
          <Link
            href="/projects"
            className="font-mono text-[13px] text-muted hover:text-primary transition-colors duration-100"
          >
            View all →
          </Link>
        </div>
        <div className="flex flex-col gap-3">
          {featuredProjects.map((p) => (
            <Link
              key={p.slug}
              href={`/projects/${p.slug}`}
              className="group border border-line p-4 transition-colors duration-150 hover:border-primary"
            >
              <h3 className="text-[18px] font-semibold text-foreground mb-1.5 group-hover:text-primary transition-colors duration-150">
                {p.title}
              </h3>
              <p className="text-[14px] text-muted mb-3 leading-relaxed">
                {p.description}
              </p>
              <div className="flex gap-2 flex-wrap">
                {p.tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-mono text-[13px] uppercase tracking-[0.08em] text-muted">
            Writing
          </h2>
          <Link
            href="/blog"
            className="font-mono text-[13px] text-muted hover:text-primary transition-colors duration-100"
          >
            View all →
          </Link>
        </div>
        <div>
          {recentPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex items-start justify-between gap-6 border-t border-line py-4 -mx-4 px-4 hover:bg-surface transition-colors duration-100"
            >
              <div>
                <h3 className="text-[16px] font-medium text-foreground mb-1 group-hover:text-primary transition-colors duration-100">
                  {post.title}
                </h3>
                <p className="text-[14px] text-muted leading-relaxed">
                  {post.excerpt}
                </p>
              </div>
              <time className="font-mono text-[12px] text-muted flex-shrink-0 pt-1">
                {post.date}
              </time>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
