import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import ThemeToggle from "./components/ThemeToggle";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Divya Soni — Software Engineer",
  description:
    "I love building software that feels magical. Currently working with distributed systems and big data processing. Tinkering with LLMs and AI agents in my free time.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('theme');if(t==='dark')document.documentElement.classList.add('dark')}catch(e){}`,
          }}
        />
      </head>
      <body className="min-h-screen bg-background text-foreground">
        <header className="sticky top-0 z-50 border-b border-line bg-background/86 backdrop-blur-xl">
          <div className="mx-auto flex h-16 max-w-[980px] items-center justify-between px-5 sm:px-6">
            <Link
              href="/"
              className="text-sm font-semibold tracking-normal text-foreground transition-colors duration-150 hover:text-primary"
            >
              dvysn
            </Link>
            <nav className="flex items-center gap-2 sm:gap-3">
              <Link
                href="/projects"
                className="rounded-full px-3 py-2 text-sm text-muted transition-colors duration-150 hover:bg-surface-soft hover:text-foreground"
              >
                projects
              </Link>
              <Link
                href="/blog"
                className="rounded-full px-3 py-2 text-sm text-muted transition-colors duration-150 hover:bg-surface-soft hover:text-foreground"
              >
                blog
              </Link>
              <a
                href="https://github.com/divya-soni"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden rounded-full px-3 py-2 text-sm text-muted transition-colors duration-150 hover:bg-surface-soft hover:text-foreground sm:inline-flex"
              >
                github
              </a>
              <ThemeToggle />
            </nav>
          </div>
        </header>
        {children}
        <footer className="mx-auto max-w-[980px] px-5 py-10 sm:px-6">
          <div className="border-t border-line pt-8">
            <p className="text-center text-sm text-muted">
              built with next.js, tailwind, and mass amounts of tokens
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
