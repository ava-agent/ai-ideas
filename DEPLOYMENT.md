# Awesome AI Ideas Deployment

`awesome-ai-ideas` contains the public idea repository and a Next.js catalog site under `site/`.

## Repository

- GitHub: `ava-agent/awesome-ai-ideas`
- Main content: Markdown idea documents in `ideas/`, `pr/`, `prs/`, `proposals/`, `docs/`, and `features/`
- Site app: `site/`
- Vercel project: `kevintens-projects/ai-ideas-showcase`; local metadata remains ignored and should not be committed.
- Production URL: `https://ai-ideas-showcase.vercel.app`

## Site App

The Next.js site builds a browsable catalog from repository Markdown and evaluation files.

```bash
cd site
npm install
npm run dev
npm run build
```

The build command runs `node scripts/build-data.mjs` before `next build`. A full repository checkout regenerates and validates the committed catalog data. A site-only Vercel build uses the committed generated data because the source Markdown directories are outside the configured project root.

## Environment

The current site does not require runtime environment variables. Keep `site/.env.example` committed as the documented template and keep real `.env*` files local.

## Verification

Before deployment or handoff:

```bash
cd site
npm run lint
npm run type-check
npm run test
npm run build
```

Then refresh the workspace reports from the parent `projects` directory:

```bash
python3 tools/project_workspace_inventory.py
```

The production release was also checked in a real browser at desktop and 390 px mobile widths. The home page, catalog, idea detail, and leaderboard returned HTTP 200 with no console errors or horizontal overflow.

## Release Assets

Root screenshot files remain repository-owned historical assets. Review their purpose separately before deleting or reorganizing them.
