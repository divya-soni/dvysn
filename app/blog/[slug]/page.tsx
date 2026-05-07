import Link from "next/link";
import { notFound } from "next/navigation";
import { marked } from "marked";
import { getAllPosts, getPost } from "@/lib/blog";
import MarkdownContent from "../../components/MarkdownContent";

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
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
    <main className="mx-auto max-w-[740px] px-5 py-16 sm:px-6 sm:py-20">
      <Link
        href="/blog"
        className="mb-10 inline-flex items-center text-sm font-medium text-muted transition-colors duration-150 hover:text-primary"
      >
        ← Writing
      </Link>

      <header className="mb-10">
        <div className="mb-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted">
          <time>{post.date}</time>
          <span>{post.readTime}</span>
        </div>
        <h1 className="text-4xl font-semibold leading-tight tracking-normal text-foreground sm:text-5xl">
          {post.title}
        </h1>
      </header>

      <MarkdownContent html={html} />
    </main>
  );
}
