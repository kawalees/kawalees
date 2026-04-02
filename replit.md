# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Kawalees (كواليس)

A curated professional directory and casting MVP platform for theatre, cinema, and arts. Dark cinematic design with Arabic RTL support and gold (#C8A96A) accents.

### Features

#### Directory (Original)
- Artist directory with search, filter (specialty, country, experience), and pagination
- Artist profile pages (privacy-first — no contact details shown publicly)
- Contact request form (stored in DB)
- Featured artists carousel
- Artist self-registration with pending approval workflow
- Admin panel to review, approve, or reject artist applications
- 6 sample Arabic artists pre-seeded

#### Casting MVP (Phase 1 Complete)
- **User Authentication**: JWT-based auth (bcryptjs + jsonwebtoken). Token stored in localStorage.
- **User Types**: `artist` (فنان) and `company` (شركة / جهة إنتاج)
- **Subscription Plans**: `free` (3 applications max), `pro` (unlimited), `elite` (unlimited)
- **Projects**: Companies create casting calls (normal or featured). `GET /api/projects` returns applicant count per project and supports `?search=` and `?type=` query params.
- **Applications**: Artists apply to projects with an optional message. Plan limit enforced server-side (returns `plan_limit` error when exceeded).
- **Dashboards**: Separate artist and company dashboards. Artist dashboard shows plan usage with a visual progress bar and remaining count. Company dashboard shows project list with expandable applicant cards (name, email, plan, message).
- **Search & Filter**:
  - Home page: text search + specialty filter tabs + country dropdown (from live artist data)
  - Projects page: text search + type filter tabs (الكل / عادي / مميز) + applicant counts on cards
- **Auth-aware navigation**: Shows login/register or user menu depending on auth state

### UI Upgrades (Professional Launch Upgrade)
- **Homepage**: Added hero badge, dual CTAs, "How it works" 3-step section, Stats band, "Who is it for" user-type cards, Trust section, CTA to pricing — all hidden during active search/filter
- **Artist Card**: Added "موثّق" (verified) badge on all approved artists
- **Artist Profile**: Added verified badge, `StarRating` component with mock rating from experience level
- **Pricing Page**: Added collapsible feature comparison table for artist plans
- **Register Page**: Converted to 2-step form (step 1: choose account type with descriptions; step 2: enter details) with visual progress indicator

### Pages
- `/` - Home: hero, search, filters, featured carousel, artist grid
- `/artist/:id` - Artist profile
- `/contact` - Contact request form
- `/join` - Artist registration form (pending until admin approves)
- `/admin` - Admin panel (protected by ADMIN_KEY env var)
- `/login` - Login page (JWT auth)
- `/register` - Register page (artist or company type)
- `/projects` - Public listing of all casting projects
- `/projects/:id` - Project detail + apply button (artists only)
- `/dashboard/artist` - Artist dashboard: my applications + plan usage
- `/dashboard/company` - Company dashboard: my projects + applicants

### API — Original
- `GET /api/artists` — list artists (filterable by specialty, country)
- `GET /api/artists/:id` — artist profile
- `POST /api/contact` — contact request
- `POST /api/artists/apply` — artist self-registration
- `GET /api/admin/applications` — list pending applications (admin key required)
- `PATCH /api/admin/applications/:id/approve` — approve artist
- `DELETE /api/admin/applications/:id` — reject/delete application

### API — Casting MVP (New)
- `POST /api/auth/register` — register user (email, password, name, type)
- `POST /api/auth/login` — login, returns JWT
- `GET /api/auth/me` — verify token + get current user
- `GET /api/projects` — public project listing
- `GET /api/projects/:id` — project detail with applicant count
- `POST /api/projects` — create project (company only, requires Bearer token)
- `DELETE /api/projects/:id` — delete own project (company only)
- `POST /api/projects/:id/apply` — apply to project (artist only, plan limits enforced)
- `GET /api/projects/:id/applicants` — view applicants (project owner company only)
- `GET /api/dashboard` — returns artist or company dashboard data based on JWT type

### DB Tables
- `artists` — public artist profiles (approved/unapproved)
- `contact_requests` — contact form submissions
- `users` — auth accounts (email, password_hash, type, plan)
- `projects` — casting calls posted by companies
- `applications` — artist applications to projects

### Auth Notes
- Admin routes require `x-admin-key` header matching `ADMIN_KEY` env var
- Casting routes use `Authorization: Bearer <JWT>` header
- JWT secret: `SESSION_SECRET` env var (falls back to dev default)
- DB tables: `artists` (with `email`, `phone`, `approved` fields), `contact_requests`
- Seed script: `pnpm --filter @workspace/scripts run seed-artists`

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Structure

```text
artifacts-monorepo/
├── artifacts/              # Deployable applications
│   └── api-server/         # Express API server
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts (single workspace package)
│   └── src/                # Individual .ts scripts, run via `pnpm --filter @workspace/scripts run <script>`
├── pnpm-workspace.yaml     # pnpm workspace (artifacts/*, lib/*, lib/integrations/*, scripts)
├── tsconfig.base.json      # Shared TS options (composite, bundler resolution, es2022)
├── tsconfig.json           # Root TS project references
└── package.json            # Root package with hoisted devDeps
```

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all packages as project references. This means:

- **Always typecheck from the root** — run `pnpm run typecheck` (which runs `tsc --build --emitDeclarationOnly`). This builds the full dependency graph so that cross-package imports resolve correctly. Running `tsc` inside a single package will fail if its dependencies haven't been built yet.
- **`emitDeclarationOnly`** — we only emit `.d.ts` files during typecheck; actual JS bundling is handled by esbuild/tsx/vite...etc, not `tsc`.
- **Project references** — when package A depends on package B, A's `tsconfig.json` must list B in its `references` array. `tsc --build` uses this to determine build order and skip up-to-date packages.

## Root Scripts

- `pnpm run build` — runs `typecheck` first, then recursively runs `build` in all packages that define it
- `pnpm run typecheck` — runs `tsc --build --emitDeclarationOnly` using project references

## Packages

### `artifacts/api-server` (`@workspace/api-server`)

Express 5 API server. Routes live in `src/routes/` and use `@workspace/api-zod` for request and response validation and `@workspace/db` for persistence.

- Entry: `src/index.ts` — reads `PORT`, starts Express
- App setup: `src/app.ts` — mounts CORS, JSON/urlencoded parsing, routes at `/api`
- Routes: `src/routes/index.ts` mounts sub-routers; `src/routes/health.ts` exposes `GET /health` (full path: `/api/health`)
- Depends on: `@workspace/db`, `@workspace/api-zod`
- `pnpm --filter @workspace/api-server run dev` — run the dev server
- `pnpm --filter @workspace/api-server run build` — production esbuild bundle (`dist/index.cjs`)
- Build bundles an allowlist of deps (express, cors, pg, drizzle-orm, zod, etc.) and externalizes the rest

### `lib/db` (`@workspace/db`)

Database layer using Drizzle ORM with PostgreSQL. Exports a Drizzle client instance and schema models.

- `src/index.ts` — creates a `Pool` + Drizzle instance, exports schema
- `src/schema/index.ts` — barrel re-export of all models
- `src/schema/<modelname>.ts` — table definitions with `drizzle-zod` insert schemas (no models definitions exist right now)
- `drizzle.config.ts` — Drizzle Kit config (requires `DATABASE_URL`, automatically provided by Replit)
- Exports: `.` (pool, db, schema), `./schema` (schema only)

Production migrations are handled by Replit when publishing. In development, we just use `pnpm --filter @workspace/db run push`, and we fallback to `pnpm --filter @workspace/db run push-force`.

### `lib/api-spec` (`@workspace/api-spec`)

Owns the OpenAPI 3.1 spec (`openapi.yaml`) and the Orval config (`orval.config.ts`). Running codegen produces output into two sibling packages:

1. `lib/api-client-react/src/generated/` — React Query hooks + fetch client
2. `lib/api-zod/src/generated/` — Zod schemas

Run codegen: `pnpm --filter @workspace/api-spec run codegen`

### `lib/api-zod` (`@workspace/api-zod`)

Generated Zod schemas from the OpenAPI spec (e.g. `HealthCheckResponse`). Used by `api-server` for response validation.

### `lib/api-client-react` (`@workspace/api-client-react`)

Generated React Query hooks and fetch client from the OpenAPI spec (e.g. `useHealthCheck`, `healthCheck`).

### `scripts` (`@workspace/scripts`)

Utility scripts package. Each script is a `.ts` file in `src/` with a corresponding npm script in `package.json`. Run scripts via `pnpm --filter @workspace/scripts run <script>`. Scripts can import any workspace package (e.g., `@workspace/db`) by adding it as a dependency in `scripts/package.json`.
