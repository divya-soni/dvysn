"use client";

import { useState } from "react";
import type { Post } from "@/lib/blog";
import BlogArchive from "./BlogArchive";

export default function BlogSearch({ posts }: { posts: Post[] }) {
  const [query, setQuery] = useState("");
  const filtered = posts.filter((post) =>
    `${post.title} ${post.excerpt}`.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <>
      <label className="archive-search">
        <span className="archive-search__label">Search the archive</span>
        <span className="archive-search__field">
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Title or idea"
          />
          <span aria-hidden="true">⌕</span>
        </span>
      </label>
      {filtered.length > 0 ? <BlogArchive posts={filtered} /> : <p className="archive-empty">No articles found.</p>}
    </>
  );
}
