# Kawalees Static Workspace

Kawalees is a fully static Arabic talent directory and casting site published through GitHub Pages.
There is no internal API, database, auth layer, dashboard, or object storage service in this workspace.

## Active App

- Frontend app: `artifacts/kawalees`
- Published GitHub Pages output: `docs`
- Manual content guide: `CONTENT_GUIDE.md`

## Static Architecture

- Artist data lives in `artifacts/kawalees/src/data/artists.ts`.
- Project data lives in `artifacts/kawalees/src/data/projects.ts`.
- Images live in `artifacts/kawalees/public`.
- Forms submit to Formspree from static pages.
- Approved submissions are reviewed manually, added to the data files, then republished.

## Public Routes

- `/`
- `/artist/:id`
- `/projects`
- `/projects/:id`
- `/join`
- `/contact`
- `/pricing`

## Commands

- `pnpm dev` — run the Vite dev server.
- `pnpm typecheck` — typecheck the frontend.
- `pnpm build` — build the frontend only.
- `pnpm deploy:static` — build, replace `docs`, generate direct GitHub Pages route entries, and run the static audit.
- `pnpm audit:static` — fail if source or published files contain API/auth/dashboard references.

## Publishing Flow

1. Edit artists or projects in the static data files.
2. Add any local images under `artifacts/kawalees/public`.
3. Run `pnpm deploy:static`.
4. Commit the source changes and updated `docs`.
