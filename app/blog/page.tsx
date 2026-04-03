import { getAllPosts } from "@/lib/blog";
import BlogList from "../components/BlogList";

export const metadata = {
  title: "Writing — Divya Soni",
};

export default function BlogPage() {
  const posts = getAllPosts();
  return (
    <main className="max-w-[640px] mx-auto px-6 py-24">
      <div className="mb-10">
        <h1 className="text-4xl font-semibold tracking-[-0.02em] text-foreground mb-2">
          Writing
        </h1>
        <p className="text-[15px] text-muted">
          Technical articles, tutorials, and notes on systems engineering.
        </p>
      </div>
      <BlogList posts={posts} />
    </main>
  );
}
