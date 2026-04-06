import Link from "next/link";
import Image from "next/image";
import Tag from "./components/Tag";
import FadeIn from "./components/FadeIn";
import { featuredProjects } from "./data/projects";
import { getAllPosts } from "@/lib/blog";
import profile_img from "../public/avatar.jpeg"

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
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
    description: "Building dsitributed systems for large-scale data processing and analytics. Working with Java, Springboot, Spark, Kubernetes and MongoDB.",
  },
  {
    company: "ShopOS",
    role: "AI Engineer Intern",
    period: "Jan 2024 — Jul 2024",
    location: "Remote",
    description: "Shipped POCs around everything image gen. Worked with LLMs and diffusion models using python, flask and react.",
  },
];

const skills = [
  { category: "Languages", items: ["Java", "Javascript", "Python"] },
  { category: "Frameworks", items: ["Springboot", "React", "Next.js", "Node.js", "Flask"] },
  { category: "Infra", items: ["Kubernetes", "Linux", "MongoDB"] },
];

export default function Home() {
  const recentPosts = getAllPosts().slice(0, 3);

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative min-h-[calc(100vh-3.5rem)] flex flex-col items-center justify-center px-6 text-center">
        <div className="animate-fade-up -mt-12" style={{ animationDelay: "0ms" }}>
          <Image
            src={profile_img}
            alt="Divya Soni"
            width={200}
            height={200}
            className="rounded-full mx-auto mb-6 border-2 border-line object-cover"
            priority
          />
        </div>

        <div className="animate-fade-up" style={{ animationDelay: "120ms" }}>
          <h1 className="text-[2.4rem] sm:text-[3rem] font-bold tracking-[-0.03em] text-foreground leading-tight">
            hey, i&apos;m divya<span className="text-primary">_</span>
          </h1>
        </div>

        <div className="animate-fade-up" style={{ animationDelay: "240ms" }}>
          <p className="text-[1rem] sm:text-[1.1rem] text-muted mt-5 leading-relaxed">
            I build with distributed systems at work and tinker with AI in my free time. <br/>
            I love building software that feels magical, and hate writing about myself in the third person.
          </p>
        </div>

        <div className="animate-fade-up" style={{ animationDelay: "360ms" }}>
          <p className="font-mono text-[0.8rem] sm:text-[0.9rem] text-muted/60 mt-3">
            Software Engineer at Wells Fargo · Hyderabad, Telangana
          </p>
        </div>

        <div className="animate-fade-up" style={{ animationDelay: "480ms" }}>
          <div className="flex items-center gap-4 mt-8">
            {socials.map(({ label, href, icon }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("mailto") ? undefined : "_blank"}
                rel={href.startsWith("mailto") ? undefined : "noopener noreferrer"}
                aria-label={label}
                className="w-10 h-10 rounded-full border border-line flex items-center justify-center text-muted hover:text-primary hover:border-primary transition-all duration-200"
              >
                {icon}
              </a>
            ))}
          </div>
        </div>

        {/* <div className="animate-fade-up" style={{ animationDelay: "600ms" }}>
          <div className="flex flex-col sm:flex-row items-center gap-3 mt-8">
            <Link
              href="/projects"
              className="font-mono text-[13px] h-10 px-6 rounded-full border border-primary text-foreground flex items-center justify-center hover:bg-primary hover:text-background transition-all duration-200"
            >
              View Projects
            </Link>
            <Link
              href="/blog"
              className="font-mono text-[13px] h-10 px-6 rounded-full border border-line text-muted flex items-center justify-center hover:border-primary hover:text-primary transition-all duration-200"
            >
              Read Blog
            </Link>
          </div>
        </div> */}

        <div className="absolute bottom-9 left-1/2 -translate-x-1/2 animate-fade-up" style={{ animationDelay: "800ms" }}>
          <a
            href="#content"
            aria-label="Scroll down"
            className="flex flex-col items-center gap-2 text-muted/50 hover:text-primary transition-colors duration-200"
          >
            <span className="font-mono text-[15px]">scroll</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-float"
            >
              <path d="M7 13l5 5 5-5" />
              <path d="M7 6l5 5 5-5" />
            </svg>
          </a>
        </div>
      </section>

      <main id="content" className="max-w-[640px] mx-auto px-6 pb-24 scroll-mt-24">

      {/* ── Stack ── */}
      <FadeIn className="mb-16">
        <h2 className="font-mono text-[13px] uppercase tracking-[0.08em] text-muted mb-5">
          <span className="text-primary">//</span> Stack
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
      </FadeIn>

      {/* ── Experience ── */}
      <FadeIn className="mb-16">
        <h2 className="font-mono text-[13px] uppercase tracking-[0.08em] text-muted mb-5">
          <span className="text-primary">//</span> Experience
        </h2>
        <div className="border-b border-line">
          {experience.map(({ company, role, period, location, description }) => (
            <div
              key={company}
              className={`border-t border-line py-5 pl-4 border-l-2 ${
                period.includes("now") ? "border-l-primary" : "border-l-line"
              }`}
            >
              <div className="flex items-baseline justify-between gap-4 mb-1">
                <span className="text-[15px] font-semibold text-foreground">{company}</span>
                <span className="font-mono text-[12px] text-muted flex-shrink-0">{period}</span>
              </div>
              <div className="flex items-center gap-3 mb-2">
                <p className="font-mono text-[12px] text-primary">{role}</p>
                <span className="text-line">·</span>
                <p className="font-mono text-[12px] text-muted">{location}</p>
              </div>
              <p className="text-[14px] text-muted leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </FadeIn>

      {/* ── Projects ── */}
      <FadeIn className="mb-16">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-mono text-[13px] uppercase tracking-[0.08em] text-muted">
            <span className="text-primary">//</span> Projects
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
              className="group border border-line p-4 transition-all duration-200 hover:border-primary hover:-translate-y-0.5 hover:shadow-sm"
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
      </FadeIn>

      {/* ── Writing ── */}
      <FadeIn>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-mono text-[13px] uppercase tracking-[0.08em] text-muted">
            <span className="text-primary">//</span> Writing
          </h2>
          <Link
            href="/blog"
            className="font-mono text-[13px] text-muted hover:text-primary transition-colors duration-100"
          >
            View all →
          </Link>
        </div>
        <div className="border-b border-line">
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
      </FadeIn>
    </main>
    </>
  );
}
