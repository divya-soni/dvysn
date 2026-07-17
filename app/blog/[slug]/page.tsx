import Link from "next/link";
import { notFound } from "next/navigation";
import { marked } from "marked";
import { getAllPosts, getPost } from "@/lib/blog";
import MarkdownContent from "../../components/MarkdownContent";
import ReadingProgress from "../../components/ReadingProgress";

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = getPost(slug);
  return { title: post?.title ?? "Not Found", description: post?.excerpt };
}

function cleanHeading(value: string) {
  return value
    .replace(/<[^>]+>/g, "")
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'");
}

function slugify(value: string) {
  return cleanHeading(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default async function BlogPost({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const headings: Array<{ id: string; label: string }> = [];
  const counts = new Map<string, number>();
  let html = await marked(post.content, { gfm: true });
  html = html.replace(/<h2>([\s\S]*?)<\/h2>/g, (_match, value: string) => {
    const base = slugify(value);
    const count = counts.get(base) ?? 0;
    counts.set(base, count + 1);
    const id = count === 0 ? base : `${base}-${count + 1}`;
    headings.push({ id, label: cleanHeading(value) });
    return `<h2 id="${id}">${value}</h2>`;
  });

  return (
    <main id="main-content" className="article-page">
      <ReadingProgress />
      <div className="shell article-topbar">
        <Link href="/blog" className="back-link"><span aria-hidden="true">←</span> Writing archive</Link>
        <span>Article / {post.readTime}</span>
      </div>

      <header className="article-header shell">
        <div className="article-header__meta">
          <span>Published</span>
          <time>{post.date}</time>
        </div>
        <h1 className="display">{post.title}</h1>
        <p className="article-header__excerpt">{post.excerpt}</p>
      </header>

      <div className="article-layout shell">
        <aside className="article-toc">
          <p className="eyebrow">On this page</p>
          <nav aria-label="Table of contents">
            {headings.map(({ id, label }, index) => (
              <a key={id} href={`#${id}`}><span>{String(index + 1).padStart(2, "0")}</span>{label}</a>
            ))}
          </nav>
        </aside>
        <article className="article-content">
          <MarkdownContent html={html} />
        </article>
        <aside className="article-rail" aria-label="Article details">
          <span>{post.readTime}</span>
          <a href="#main-content">Back to top ↑</a>
        </aside>
      </div>
    </main>
  );
}
