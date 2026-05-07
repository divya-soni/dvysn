"use client";

import { useState } from "react";
import Link from "next/link";
import type { Post } from "@/lib/blog";

interface Props {
  posts: Post[];
}

export default function BlogList({ posts }: Props) {
  const [query, setQuery] = useState("");

  const filtered = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(query.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <>
      <label className="mb-8 block">
        <span className="sr-only">Search articles</span>
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search articles..."
          className="h-12 w-full rounded-lg border border-line bg-surface px-4 text-sm text-foreground shadow-[var(--shadow-soft)] transition-colors duration-150 placeholder:text-muted focus:border-primary focus:outline-none"
        />
      </label>

      {filtered.length === 0 ? (
        <div className="rounded-lg border border-line bg-surface px-5 py-16 text-center shadow-[var(--shadow-soft)]">
          <p className="text-sm text-muted">No articles found.</p>
        </div>
      ) : (
        <div className="divide-y divide-line rounded-lg border border-line bg-surface shadow-[var(--shadow-soft)]">
          {filtered.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group grid gap-2 p-5 transition-colors duration-150 hover:bg-surface-soft sm:grid-cols-[116px_1fr]"
            >
              <time className="text-sm text-muted sm:pt-1">{post.date}</time>
              <div>
                <h2 className="text-xl font-semibold text-foreground transition-colors duration-150 group-hover:text-primary">
                  {post.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted">
                  {post.excerpt}
                </p>
                <p className="mt-3 text-xs font-medium uppercase tracking-[0.12em] text-muted">
                  {post.readTime}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
