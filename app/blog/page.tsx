import Link from "next/link";
import { getAllPosts } from "@/lib/blog";

export const metadata = { title: "Notes" };

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <main id="main-content" className="page shell">
      <h1 className="page-title">Notes</h1>
      <ul className="notes-list">
        {posts.map((post) => (
          <li key={post.slug} className="note-item">
            <h2 className="note-item-title">
              <Link href={`/blog/${post.slug}`}>{post.title}</Link>
            </h2>
            <time className="index-meta" dateTime={post.date}>
              {post.date.slice(0, 4)}
            </time>
          </li>
        ))}
      </ul>
    </main>
  );
}
