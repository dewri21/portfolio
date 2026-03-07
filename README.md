# Nayan Jeet Dewri Portfolio

Dynamic single-page React portfolio built with Vite + TypeScript, Framer Motion, and JSON-driven content.

## Stack

- React 18 + TypeScript
- Vite
- Framer Motion
- Vitest + Testing Library
- Playwright (smoke e2e)

## Quick start

```bash
npm install
npm run dev
```

## Scripts

- `npm run dev`: Start local dev server.
- `npm run build`: Type-check and build static files.
- `npm run preview`: Serve build output locally.
- `npm run test`: Run unit/component tests.
- `npm run test:e2e`: Run Playwright smoke tests.

## Content updates

Edit one file to update portfolio data:

- `src/data/portfolioData.json`

UI components are schema-driven from `PortfolioData` types in `src/types/portfolio.ts`.

## Deployment

Static build is Vercel-ready.

```bash
npm run build
```

Deploy the repository in Vercel and it will serve the SPA with fallback routing from `vercel.json`.
