'use client';

import { useState } from 'react';
import Link from 'next/link';
import Tag from '@/app/components/Tag';
import type { Project } from '@/app/data/projects';

const FILTERS = [''];

interface Props {
  projects: Project[];
}

export default function ProjectsGrid({ projects }: Props) {
  const [active, setActive] = useState('All');

  const filtered =
    active === 'All' ? projects : projects.filter((p) => p.tags.includes(active));

  return (
    <>
      {/* <div className="flex gap-2 mb-10 flex-wrap">
        {FILTERS.map((tag) => (
          <button
            key={tag}
            onClick={() => setActive(tag)}
            className={`font-mono text-[13px] h-8 px-4 border transition-colors duration-100 focus-visible:outline-primary ${
              active === tag
                ? 'bg-foreground text-background border-foreground'
                : 'border-line text-muted hover:text-foreground hover:border-muted'
            }`}
          >
            {tag}
          </button>
        ))}
      </div> */}

      {filtered.length === 0 ? (
        <p className="font-mono text-[13px] text-muted py-16 border-t border-line">
          No projects match selected filter.{' '}
          <button
            onClick={() => setActive('All')}
            className="text-primary hover:underline"
          >
            Clear filter
          </button>
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {filtered.map((p) => (
            <Link
              key={p.slug}
              href={`/projects/${p.slug}`}
              className="group border border-line p-5 hover:border-primary transition-colors duration-150"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="text-[16px] font-semibold text-foreground group-hover:text-primary transition-colors duration-100">
                  {p.title}
                </h3>
                <div className="flex items-center gap-1 text-muted flex-shrink-0 pt-0.5">
                  <svg
                    className="w-3.5 h-3.5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  <span className="font-mono text-[12px]">{p.stars}</span>
                </div>
              </div>
              <p className="text-[13px] text-muted mb-4 leading-relaxed">
                {p.description}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex gap-1.5 flex-wrap">
                  {p.tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}
                </div>
                <span className="text-muted text-sm">↗</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
