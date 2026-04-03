# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # Start development server at http://localhost:3000
npm run build    # Production build
npm run start    # Start production server (requires build first)
npm run lint     # Run ESLint
```

There is no test runner configured in this project.

## Stack

- **Next.js 16.2.2** with App Router (`app/` directory) — see AGENTS.md warning about breaking changes
- **React 19.2.4**
- **Tailwind CSS v4** (configured via `@tailwindcss/postcss` in `postcss.config.mjs`)
- **TypeScript** (strict mode via `tsconfig.json`)
- **ESLint v9** with flat config (`eslint.config.mjs`) using `eslint-config-next` core-web-vitals + TypeScript presets

## Architecture

This is a minimal Next.js App Router project. Entry points:

- `app/layout.tsx` — root layout; loads Geist/Geist Mono fonts via `next/font/google`, applies them as CSS variables (`--font-geist-sans`, `--font-geist-mono`)
- `app/page.tsx` — home route (`/`)
- `app/globals.css` — global styles (Tailwind base)

Before writing any Next.js code, consult `node_modules/next/dist/docs/` as noted in AGENTS.md — this version has breaking API changes from prior releases.
