import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
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
    "Software engineer focused on distributed systems and developer tooling.",
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
    >
      <body className="min-h-screen bg-background text-foreground">
        <header className="fixed top-0 inset-x-0 z-50 h-14 border-b border-line bg-background/80 backdrop-blur-[12px]">
          <div className="max-w-[800px] mx-auto h-full px-6 flex items-center justify-between">
            <Link
              href="/"
              className="font-mono text-sm text-foreground hover:text-primary transition-colors duration-100"
            >
              dvysn<span className="text-primary animate-pulse">_</span>
            </Link>
            <nav className="flex items-center gap-8">
              <Link
                href="/projects"
                className="font-mono text-sm text-muted hover:text-primary transition-colors duration-100"
              >
                projects
              </Link>
              <Link
                href="/blog"
                className="font-mono text-sm text-muted hover:text-primary transition-colors duration-100"
              >
                blog
              </Link>
              <a
                href="https://github.com/divya-soni-14"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-sm text-muted hover:text-primary transition-colors duration-100"
              >
                github ↗
              </a>
            </nav>
          </div>
        </header>
        <div className="pt-14">{children}</div>
      </body>
    </html>
  );
}
