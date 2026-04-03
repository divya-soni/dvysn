import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface Post {
  slug: string;
  title: string;
  date: string;
  readTime: string;
  excerpt: string;
  content: string;
}

const BLOG_DIR = path.join(process.cwd(), 'content/blog');

export function getAllPosts(): Post[] {
  if (!fs.existsSync(BLOG_DIR)) return [];

  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith('.md'))
    .map((filename) => {
      const slug = filename.slice(0, -3);
      const raw = fs.readFileSync(path.join(BLOG_DIR, filename), 'utf-8');
      const { data, content } = matter(raw);
      const wordCount = content.trim().split(/\s+/).length;
      const readTime = `${Math.ceil(wordCount / 200)} min read`;
      return {
        slug,
        title: String(data.title),
        date:
          data.date instanceof Date
            ? data.date.toISOString().slice(0, 10)
            : String(data.date),
        readTime,
        excerpt: String(data.excerpt ?? ''),
        content,
      };
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getPost(slug: string): Post | undefined {
  return getAllPosts().find((p) => p.slug === slug);
}
