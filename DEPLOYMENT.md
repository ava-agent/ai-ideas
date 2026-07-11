# Awesome AI Ideas Deployment

`awesome-ai-ideas` contains the public idea repository and a Next.js catalog site under `site/`.

## Repository

- GitHub: `ava-agent/awesome-ai-ideas`
- Main content: Markdown idea documents in `ideas/`, `pr/`, `prs/`, `proposals/`, `docs/`, and `features/`
- Site app: `site/`
- Vercel project: `kevintens-projects/ai-ideas-showcase`; local metadata remains ignored and should not be committed.
- Public domain: no custom production domain has been recorded in this workspace inventory yet.

## Site App

The Next.js site builds a browsable catalog from repository Markdown and evaluation files.

```bash
cd site
npm install
npm run dev
npm run build
```

The build command runs `node scripts/build-data.mjs` before `next build`. If `site/src/data/ideas.json` and `site/src/data/content-map.json` already exist, the data build step is skipped.

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

## Open Items

- Confirm the actual Vercel project and production URL for `site/`.
- Decide whether the root screenshot files are release assets, design review evidence, or disposable QA output.
- Confirm the final production alias and run browser smoke checks after deployment.
