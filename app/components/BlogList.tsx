import type { Post } from "@/lib/blog";
import BlogArchive from "./BlogArchive";
import BlogSearch from "./BlogSearch";

export default function BlogList({ posts }: { posts: Post[] }) {
  if (posts.length > 6) return <BlogSearch posts={posts} />;
  return <BlogArchive posts={posts} />;
}
