import RobotScene from "./components/home/RobotScene";
import YearRing from "./components/home/YearRing";
import NoteLink from "./components/NoteLink";
import WorkIndex from "./components/WorkIndex";
import { projects } from "./data/projects";
import { getAllPosts } from "@/lib/blog";
import { formatDate } from "@/lib/date";
import { getContributions } from "@/lib/github";

export default async function Home() {
  const notes = getAllPosts();
  const github = await getContributions();

  return (
    <main id="main-content" className="home shell">
      <header className="masthead">
        <h1 className="masthead-name">Divya Soni</h1>
        <p className="masthead-bio">
          I work on distributed systems at Wells Fargo in Hyderabad. On the side I make small tools around language
          models.
        </p>
      </header>

      <RobotScene />

      <WorkIndex projects={projects} />

      {github ? (
        <section className="workshop" aria-labelledby="workshop-heading">
          <h2 id="workshop-heading" className="section-label">
            Workshop log
          </h2>
          <p className="section-lede">
            Everything I pushed to GitHub in the last twelve months, refreshed every ten minutes.
          </p>
          <YearRing
            days={github.days}
            end={github.end}
            total={github.total}
            lastPush={github.lastPush}
            shipped={projects.map(({ title, slug, date }) => ({ title, slug, date }))}
          />
        </section>
      ) : null}

      <section className="notes-index" aria-labelledby="notes-heading">
        <h2 id="notes-heading" className="section-label">
          Notes
        </h2>
        <ul className="note-list">
          {notes.map((post) => (
            <li key={post.slug} className="note-row">
              <NoteLink post={post} className="note-title" />
              <time className="note-date" dateTime={post.date}>
                {formatDate(post.date)}
              </time>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
