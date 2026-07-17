"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";

const routes = [
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Writing" },
];

export default function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="site-header">
      <div className="shell site-header__inner">
        <Link href="/" className="brand" aria-label="Divya Soni, home">
          <span className="brand__mark">dvysn</span>
          <span className="brand__divider" aria-hidden="true" />
          <span className="brand__name">Divya Soni</span>
        </Link>

        <nav className="primary-nav" aria-label="Primary navigation">
          {routes.map(({ href, label }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                className="nav-link"
                aria-current={active ? "page" : undefined}
              >
                {label}
              </Link>
            );
          })}
          <a
            href="https://github.com/divya-soni"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link nav-link--external"
          >
            GitHub
          </a>
          <a className="header-contact" href="mailto:divya.rajeshsoni@gmail.com">
            Let&apos;s talk
            <span aria-hidden="true">↗</span>
          </a>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
