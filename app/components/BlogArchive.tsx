import Link from "next/link";
import type { Post } from "@/lib/blog";

export default function BlogArchive({ posts }: { posts: Post[] }) {
  return (
    <div className="writing-archive">
      {posts.map((post, index) => (
        <article className="writing-row" key={post.slug}>
          <div className="writing-row__index">{String(index + 1).padStart(2, "0")}</div>
          <Link href={`/blog/${post.slug}`} className="writing-row__body">
            <div className="writing-row__meta">
              <time>{post.date}</time>
              <span>{post.readTime}</span>
            </div>
            <h2 className="display">{post.title}</h2>
            <p>{post.excerpt}</p>
          </Link>
          <Link href={`/blog/${post.slug}`} className="writing-row__arrow" aria-label={`Read ${post.title}`}>
            ↗
          </Link>
        </article>
      ))}
    </div>
  );
}
