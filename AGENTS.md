# Repository Instructions

## GitHub Identity

- All commits in this repository must be authored and committed as `kevinten <596823919@qq.com>`.
- Before creating commits, run:
  `git config user.name kevinten`
  `git config user.email 596823919@qq.com`
- Do not use `孔明 (Kongming) <kongming@ai-ideas-lab.com>` for new commits. GitHub does not attribute that identity to `kevinten10`.

## Scheduled Tasks

- Cron-generated reports should commit only their intended files.
- Do not use `git add -A` for automated commits.
- Push through the configured `kevinten10` GitHub CLI account.

## Site Scope

- This is a public AI product-idea knowledge base with a Next.js catalog in `site/`.
- Treat Markdown idea documents as public product/reference content.
- Keep QA screenshots, browser caches, Vercel metadata, `node_modules/`, and `.next/` out of commits.
- Follow `site/AGENTS.md` before changing the Next.js app.
- Do not commit real environment files. Use `site/.env.example` for placeholders only.

## Validation

- For content-only changes, run `git diff --check`.
- For `site/` changes, run:

```bash
cd site
npm run lint
npm run type-check
npm run test
npm run build
```
