'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Post } from '@/lib/blog';

interface Props {
  posts: Post[];
}

export default function BlogList({ posts }: Props) {
  const [query, setQuery] = useState('');

  const filtered = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="> search articles..."
        className="w-full h-10 border border-line bg-transparent px-4 mb-8 font-mono text-[13px] text-foreground placeholder:text-muted focus:outline-none focus:border-primary transition-colors duration-100"
      />

      {filtered.length === 0 ? (
        <div className="py-16 border-t border-line text-center">
          <p className="font-mono text-[13px] text-muted">
            No articles found{' '}
            <span className="text-primary animate-pulse">_</span>
          </p>
        </div>
      ) : (
        <div className="border-b border-line">
          {filtered.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block border-t border-line py-6 -mx-6 px-6 hover:bg-surface transition-colors duration-100"
            >
              <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-6">
                <time className="font-mono text-[13px] text-muted flex-shrink-0 sm:pt-1 sm:w-[108px]">
                  {post.date}
                </time>
                <div>
                  <h2 className="text-[18px] font-medium text-foreground mb-1.5 group-hover:text-primary transition-colors duration-100">
                    {post.title}
                  </h2>
                  <p className="text-[15px] text-muted leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
