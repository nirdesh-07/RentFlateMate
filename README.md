# RentFlatemate — Frontend Scaffold

Next.js 15 (App Router) + TypeScript + Tailwind v4 frontend for the RentFlatemate
rent & flatmate-finder platform. This is the **frontend scaffold only** — pages
run against mock data in `src/lib/mock-data.ts` until the backend is wired up.

## Design system: "dusk commute"

Dark, aurora-gradient glass UI. Tokens live in `src/app/globals.css` under
`@theme inline` — colors (`--color-*`), fonts (`--font-*`), radii, and glow
shadows. The signature element is `CompatibilityRing`
(`src/components/ui/compatibility-ring.tsx`), an animated gradient ring used
everywhere a match score appears (hero, listing cards, dashboards later).

Fonts are self-hosted via `@fontsource` (Sora for display, Inter for body,
JetBrains Mono for scores/data) rather than `next/font/google`, since the
build environment can't reach Google Fonts — swap back to `next/font/google`
freely once deployed somewhere with normal internet access.

## What's built

- `/` — landing page: hero + search, featured listings, how-it-works,
  testimonials, FAQ, closing CTA
- `/listings` — searchable, filterable, sortable grid (client-side over mock
  data)
- `/login`, `/register` — auth forms, register includes tenant/owner role toggle
- Dark/light theme toggle (persisted to localStorage, no-flash script in
  `<head>`)
- Reusable primitives in `src/components/ui`: Button, Input, Card, Badge,
  CompatibilityRing

## Not built yet (next steps)

- Backend (Node/Express + MongoDB/Mongoose per your last message)
- Auth wiring (forms are UI-only, no submit handlers yet)
- Owner dashboard, tenant dashboard, chat, admin panel
- Real AI compatibility scoring (currently hardcoded scores in mock data)

## Run locally

```bash
npm install
npm run dev
```

Visit http://localhost:3000.

## Stack

Next.js 15, TypeScript, Tailwind CSS v4, Framer Motion, React Hook Form, Zod,
TanStack Query, Axios, lucide-react icons.
