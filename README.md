# Edelweiss Pastry Shop — Landing 2026

Premium Next.js 14 landing page for Edelweiss Pastry Shop (Biddeford, Maine). Crafted with Swiss-inspired hospitality, hand-curated photography and a calm, alpine palette.

## Stack

- **Next.js 14** (App Router, TypeScript)
- **Tailwind CSS** with a bespoke Edelweiss palette (cream, forest, rust, mustard, cocoa)
- **Framer Motion** for cinematic fade-in-up reveals
- **lucide-react** for line iconography
- 100% mobile-first, ready for Vercel zero-config deploys

## Local development

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
npm run start
```

## Order CTAs

All "Order" buttons currently point to `#order`. When the Clover URL is ready, do a project-wide find & replace on the string `#order` to swap it in.

## Deployment

The repository is linked to the Vercel team **Orkesta Automation** (project `edelweiss-landing-page-2026`). Pushing to `main` triggers an automatic production deploy.
