import Image from "next/image";
import Link from "next/link";
import NoteLink from "./components/NoteLink";
import profileImg from "../public/avatar.jpeg";
import { getAllPosts } from "@/lib/blog";
import { formatDate } from "@/lib/date";
import { projects } from "./data/projects";

const HIGHLIGHTS = 2;

export default function Home() {
  const recentWork = projects.slice(0, HIGHLIGHTS);
  const recentNotes = getAllPosts().slice(0, HIGHLIGHTS);

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
          {recentWork.map((project) => (
            <div key={project.slug} className="index-item">
              <Link href={`/projects/${project.slug}`} className="index-title">
                {project.title}
              </Link>
              <time className="index-meta" dateTime={project.date}>
                {formatDate(project.date)}
              </time>
            </div>
          ))}
          <p className="index-more">
            <Link href="/projects">See more</Link>
          </p>
        </section>

        <section className="index">
          <h2 className="index-heading">Notes</h2>
          {recentNotes.map((post) => (
            <div key={post.slug} className="index-item">
              <NoteLink post={post} className="index-title" />
              <time className="index-meta" dateTime={post.date}>
                {formatDate(post.date)}
              </time>
            </div>
          ))}
          <p className="index-more">
            <Link href="/blog">See more</Link>
          </p>
        </section>
      </div>
    </main>
  );
}
