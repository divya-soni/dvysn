import { notFound } from "next/navigation";
import { marked } from "marked";
import { getAllPosts, getPost } from "@/lib/blog";
import MarkdownContent from "../../components/MarkdownContent";

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = getPost(slug);
  return { title: post?.title ?? "Not Found", description: post?.excerpt };
}

function formatDate(iso: string) {
  const date = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogPost({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const html = await marked(post.content, { gfm: true });
  const lede =
    post.excerpt && !post.content.trim().startsWith(post.excerpt)
      ? post.excerpt
      : null;

  return (
    <main id="main-content" className="page shell">
      <article className="article">
        <h1 className="article-title">{post.title}</h1>
        <time className="article-date" dateTime={post.date}>
          {formatDate(post.date)}
        </time>
        {lede ? <p className="article-excerpt">{lede}</p> : null}
        <MarkdownContent html={html} />
      </article>
    </main>
  );
}
