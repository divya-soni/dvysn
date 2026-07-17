import { getAllPosts } from "@/lib/blog";
import BlogList from "../components/BlogList";
import { PageHeader } from "../components/PageHeader";

export const metadata = { title: "Writing" };

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <main id="main-content" className="page-shell shell writing-page">
      <PageHeader
        eyebrow={`Writing archive / ${String(posts.length).padStart(2, "0")}`}
        title={<>Technical articles, tutorials, and notes on <em>systems engineering.</em></>}
        aside={<p>Ideas on software,<br />AI, and interface.</p>}
      />
      <BlogList posts={posts} />
    </main>
  );
}
