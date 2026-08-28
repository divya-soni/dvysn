"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";

const routes = [
  { href: "/projects", label: "Work" },
  { href: "/blog", label: "Notes" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const home = pathname === "/";

  return (
    <header className="site-header">
      <div className={`shell header-inner${home ? " header-inner-end" : ""}`}>
        {!home && (
          <Link href="/" className="brand">
            Divya Soni
          </Link>
        )}

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
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
