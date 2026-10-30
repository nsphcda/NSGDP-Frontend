# Niger State Open Data Portal — Frontend

Frontend application for the Niger State Government Open Data Portal.
See [`../docs/Frontend_PRD_v1.0.md`](../docs/Frontend_PRD_v1.0.md) for the full build spec.

## Stack

- **Next.js 15** (App Router) + **React 19** + **TypeScript** (strict)
- **Tailwind CSS v4** + **shadcn/ui** (Radix primitives, owned in-repo)
- **Lucide** icons · **TanStack Query** (server state) · **React Hook Form + Zod** (forms)
- **Leaflet** (maps, added per screen) · **Recharts** (analytics, added per screen)
- Self-hosted **Inter** font

## Getting started

```bash
npm install
cp .env.example .env.local   # set NEXT_PUBLIC_API_URL
npm run dev                  # http://localhost:3000
```

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | ESLint |
| `npx tsc --noEmit` | Type-check |
| `npm run e2e:login:demo` | Sign in the demo accounts for the mobile audit (needs `npm run seed:demo` in the backend) |
| `npm run e2e:responsive` | Mobile responsiveness audit of every page (see [`e2e/README.md`](e2e/README.md)) |

## Structure

```
src/
├── app/            # Routes (App Router)
├── components/
│   ├── ui/         # shadcn/ui primitives
│   └── data/       # Domain components (badges, cards, …)
├── lib/
│   ├── api/        # Typed API client
│   ├── constants.ts
│   └── utils.ts
└── types/          # Shared domain types
```

## Theme

Government brand tokens live in [`src/app/globals.css`](src/app/globals.css):
Niger State Green primary, teal accent, and semantic tokens
(`success`/PUBLIC, `warning`/RESTRICTED, `info`, `admin` shell). All target WCAG AA.
