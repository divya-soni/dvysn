## dvysn

Personal portfolio site. Paper and ink by day, amber workshop light by night.

```bash
npm run dev    # http://localhost:3000
npm run build
npm run lint
```

**Add a note:** drop a `.md` file into `content/blog/` with frontmatter:

```markdown
---
title: Post Title
date: 2026-01-15
excerpt: One sentence summary.
---

Content here...
```

Set `href` in the frontmatter instead of writing content to link out to an essay hosted elsewhere.

**Add a project:** add an entry to `content/projects.json`. Projects are numbered by date, oldest first, so a new project gets the next number. Its drawing lives in `lib/ink/schematics/` (the geometry) and `app/components/schematics/` (the playable version); register it in `lib/ink/schematics/index.ts` and `app/components/schematics/Schematic.tsx`.

**Drawings:** everything is drawn with [Rough.js](https://roughjs.com) through `lib/ink/sketch.ts`. Each drawing is generated as a few seeded frames; swapping them on hover gives the boiling-line look.

**GitHub ring:** the home page reads the public contribution calendar for `divya-soni` and refreshes it every ten minutes. Optionally set `GITHUB_TOKEN` (a read-only token) to also show when you last pushed.

**Profile photo:** `public/avatar.jpeg`.
