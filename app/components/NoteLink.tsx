import type { Post } from "@/lib/blog";
import Link from "next/link";

export default function NoteLink({
  post,
  className,
}: {
  post: Post;
  className?: string;
}) {
  if (post.href) {
    return (
      <a
        href={post.href}
        className={className}
        target="_blank"
        rel="noopener noreferrer"
      >
        {post.title}
      </a>
    );
  }

  return (
    <Link href={`/blog/${post.slug}`} className={className}>
      {post.title}
    </Link>
  );
}
