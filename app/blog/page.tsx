import { getAllPosts } from "@/lib/blog";
import BlogList from "../components/BlogList";

export const metadata = {
  title: "Writing — Divya Soni",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <main className="mx-auto max-w-[780px] px-5 py-20 sm:px-6 sm:py-24">
      <div className="mb-10">
        <p className="mb-3 text-sm font-medium uppercase tracking-[0.14em] text-primary">
          Writing
        </p>
        <h1 className="text-4xl font-semibold tracking-normal text-foreground sm:text-5xl">
          Technical articles, tutorials, and notes on systems engineering.
        </h1>
      </div>
      <BlogList posts={posts} />
    </main>
  );
}
