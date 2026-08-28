import Image from "next/image";
import Link from "next/link";
import profileImg from "../public/avatar.jpeg";
import { getAllPosts } from "@/lib/blog";
import { featuredProjects } from "./data/projects";

export default function Home() {
  const recentPosts = getAllPosts().slice(0, 3);

  return (
    <main id="main-content" className="home shell">
      <div className="home-intro">
        <div>
          <h1 className="home-name">Divya Soni</h1>
          <p className="home-bio">
            I work on distributed systems at Wells Fargo in Hyderabad. On the
            side I make small tools around language models.
          </p>
        </div>
        <Image
          src={profileImg}
          alt="Divya Soni"
          className="portrait"
          priority
          sizes="(max-width: 720px) 14rem, 16rem"
          placeholder="blur"
        />
      </div>

      <div className="home-indexes">
        <section className="index">
          <h2 className="index-heading">Work</h2>
          {featuredProjects.map((project) => (
            <div key={project.slug} className="index-item">
              <Link href={`/projects/${project.slug}`} className="index-title">
                {project.title}
              </Link>
              <span className="index-meta">{project.year}</span>
            </div>
          ))}
        </section>

        <section className="index">
          <h2 className="index-heading">Notes</h2>
          {recentPosts.map((post) => (
            <div key={post.slug} className="index-item">
              <Link href={`/blog/${post.slug}`} className="index-title">
                {post.title}
              </Link>
              <span className="index-meta">{post.date.slice(0, 4)}</span>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
