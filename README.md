## dvysn

Personal portfolio site.

```bash
npm run dev    # http://localhost:3000
npm run build
npm run lint
```

**Add a blog post:** drop a `.md` file into `content/blog/` with frontmatter:

```markdown
---
title: Post Title
date: 2026-01-15
excerpt: One sentence summary.
---

Content here...
```

**Profile photo:** replace `public/avatar.svg` with your photo, update `src` in `app/page.tsx`.
