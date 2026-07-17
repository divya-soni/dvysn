import Image from "next/image";
import Link from "next/link";
import profileImg from "../public/avatar.jpeg";
import { getAllPosts } from "@/lib/blog";
import { featuredProjects } from "./data/projects";
import { SectionHeader } from "./components/PageHeader";
import ProjectRow from "./components/ProjectRow";
import Tag from "./components/Tag";

const socials = [
  { label: "GitHub", href: "https://github.com/divya-soni" },
  { label: "LinkedIn", href: "https://linkedin.com/in/divya-soni14" },
  { label: "X", href: "https://x.com/thedivyasoni" },
  { label: "Email", href: "mailto:divya.rajeshsoni@gmail.com" },
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
  { category: "Frameworks", items: ["Springboot", "React", "Next.js", "Node.js", "Flask"] },
  { category: "Infra", items: ["Kubernetes", "Linux", "MongoDB"] },
];

export default function Home() {
  const recentPosts = getAllPosts().slice(0, 3);

  return (
    <main id="main-content">
      <section className="home-hero shell">
        <div className="home-hero__copy reveal">
          <p className="eyebrow">Software Engineer at Wells Fargo · Hyderabad, Telangana</p>
          <h1 className="hero-title display">
            hey, i&apos;m <em>divya.</em>
          </h1>
          <p className="hero-intro">
            I build with distributed systems at work and tinker with AI in my free time. I love building software that feels magical, and hate writing about myself in the third person.
          </p>
          <div className="hero-actions">
            <Link href="/projects" className="button button--primary">
              View projects <span aria-hidden="true">↗</span>
            </Link>
            <Link href="/blog" className="text-link">
              Read writing <span className="arrow" aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="hero-socials" aria-label="Social links">
            {socials.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("mailto") ? undefined : "_blank"}
                rel={href.startsWith("mailto") ? undefined : "noopener noreferrer"}
              >
                {label}<span aria-hidden="true">↗</span>
              </a>
            ))}
          </div>
        </div>

        <div className="portrait-block reveal reveal--delay">
          <div className="portrait-block__index" aria-hidden="true">01 / PORTRAIT</div>
          <div className="portrait-block__frame">
            <Image
              src={profileImg}
              alt="Divya Soni"
              className="portrait-block__image"
              priority
              sizes="(max-width: 760px) 88vw, 38vw"
              placeholder="blur"
            />
          </div>
          <div className="portrait-block__caption">
            <span>Engineer</span>
            <span>Builder</span>
            <span>Occasional writer</span>
          </div>
        </div>
      </section>

      <section className="home-section shell" aria-labelledby="selected-work">
        <SectionHeader
          number="01"
          title="Selected work"
          id="selected-work"
          action={<Link href="/projects" className="text-link">All projects <span className="arrow" aria-hidden="true">→</span></Link>}
        />
        <div className="project-list">
          {featuredProjects.map((project, index) => (
            <ProjectRow key={project.slug} project={project} index={index + 1} compact />
          ))}
        </div>
      </section>

      <section className="home-section shell split-section" aria-labelledby="experience-heading">
        <div className="split-section__intro">
          <p className="eyebrow">02 / Experience</p>
          <h2 id="experience-heading" className="display split-section__title">Building at the intersection of scale and imagination.</h2>
        </div>
        <div className="timeline">
          {experience.map(({ company, role, period, location, description }, index) => (
            <article className="timeline__item" key={company}>
              <span className="timeline__number">0{index + 1}</span>
              <div>
                <div className="timeline__heading">
                  <h3>{company}</h3>
                  <time>{period}</time>
                </div>
                <p className="timeline__role">{role} · {location}</p>
                <p className="timeline__description">{description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="home-section home-section--ink" aria-labelledby="writing-heading">
        <div className="shell">
          <SectionHeader
            number="03"
            title="Writing"
            id="writing-heading"
            action={<Link href="/blog" className="text-link text-link--light">All writing <span className="arrow" aria-hidden="true">→</span></Link>}
          />
          <div className="home-writing">
            {recentPosts.map((post, index) => (
              <Link href={`/blog/${post.slug}`} className="home-writing__item" key={post.slug}>
                <span className="home-writing__index">0{index + 1}</span>
                <div>
                  <h3 className="display">{post.title}</h3>
                  <p>{post.excerpt}</p>
                </div>
                <div className="home-writing__meta">
                  <time>{post.date}</time>
                  <span>{post.readTime}</span>
                  <span className="home-writing__arrow" aria-hidden="true">↗</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="home-section shell" aria-labelledby="stack-heading">
        <SectionHeader number="04" title="Stack" id="stack-heading" />
        <div className="stack-grid">
          {skills.map(({ category, items }) => (
            <div className="stack-group" key={category}>
              <h3>{category}</h3>
              <div className="tag-list">
                {items.map((item) => <Tag key={item}>{item}</Tag>)}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
