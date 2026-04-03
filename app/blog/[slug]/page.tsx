import { notFound } from "next/navigation";
import Link from "next/link";
import { marked } from "marked";
import { getAllPosts, getPost } from "@/lib/blog";
import MarkdownContent from "../../components/MarkdownContent";

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  return {
    title: post ? `${post.title} — Divya Soni` : "Not Found",
  };
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const html = await marked(post.content, { gfm: true });

  return (
    <main className="max-w-[640px] mx-auto px-6 py-24">
      <Link
        href="/blog"
        className="font-mono text-[13px] text-muted hover:text-primary transition-colors duration-100 mb-10 inline-block"
      >
        ← writing
      </Link>

      <div className="mb-10">
        <div className="flex items-center gap-5 mb-4">
          <time className="font-mono text-[13px] text-muted">{post.date}</time>
          <span className="font-mono text-[13px] text-muted">
            {post.readTime}
          </span>
        </div>
        <h1 className="text-[40px] font-semibold tracking-[-0.02em] text-foreground leading-tight">
          {post.title}
        </h1>
      </div>

      <MarkdownContent html={html} />
    </main>
  );
}
