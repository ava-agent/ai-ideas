# Awesome AI Ideas Site

Next.js catalog site for the `ava-agent/awesome-ai-ideas` repository. It turns the Markdown idea library and evaluation reports into a browsable product-idea directory.

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Data Build

`npm run build` runs `node scripts/build-data.mjs` before `next build`. The data script reads Markdown and evaluation files from the repository root and writes:

- `src/data/ideas.json`
- `src/data/content-map.json`

If both files already exist, the data step is skipped.

## Validation

```bash
npm run lint
npm run type-check
npm run test
npm run build
```

## Environment

No runtime environment variables are currently required. Keep `.env.example` committed and keep real `.env*` files local.

## Deployment

The local workspace contains Vercel metadata in `.vercel/`, but that directory is ignored. Confirm the actual Vercel project and production URL before publishing changes.
