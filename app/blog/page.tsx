import NoteLink from "../components/NoteLink";
import { getAllPosts } from "@/lib/blog";
import { formatDate } from "@/lib/date";

export const metadata = { title: "Notes" };

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <main id="main-content" className="page shell">
      <h1 className="page-title">Notes</h1>
      <p className="section-lede">Essays on interfaces, language models and the things I build with them.</p>
      <ul className="note-list">
        {posts.map((post) => (
          <li key={post.slug} className="note-row">
            <NoteLink post={post} className="note-title" />
            <time className="note-date" dateTime={post.date}>
              {formatDate(post.date)}
            </time>
          </li>
        ))}
      </ul>
    </main>
  );
}
