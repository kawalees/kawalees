# Kawalees Static Content Guide

Kawalees is a static GitHub Pages site. There is no internal API, database, login system, or dashboard.
All approved content is edited manually, built, and published to `docs`.

## Add Or Update An Artist

1. Add the approved artist photo to:
   `artifacts/kawalees/public/artists/`
2. Open:
   `artifacts/kawalees/src/data/artists.ts`
3. Add or update one artist object.
4. Use a stable URL-safe `id`, for example:
   `ahmad-alrawani`
5. Reference local images like:
   `/artists/ahmad-alrawani.jpg`
6. Run the static deploy command:
   `pnpm deploy:static`

Artist profile URLs are generated from the `id`:
`/kawalees/artist/ahmad-alrawani`

## Add Or Update A Project

1. Open:
   `artifacts/kawalees/src/data/projects.ts`
2. Add or update one project object.
3. Use a stable string `id`, for example:
   `9`
4. Keep `status` as either `open` or `closed`.
5. Use ISO dates for `deadline`, for example:
   `2026-08-15`
6. Run:
   `pnpm deploy:static`

Project URLs are generated from the `id`:
`/kawalees/projects/9`

## Forms

The site uses Formspree for static intake forms:

- Join artist form: `artifacts/kawalees/src/pages/JoinAsArtist.tsx`
- Contact request form: `artifacts/kawalees/src/pages/ContactRequest.tsx`
- Project application form: `artifacts/kawalees/src/pages/ProjectDetail.tsx`

Submissions should be reviewed manually. Approved artists and projects are then added to the data files above.

## Publish

Run:

```powershell
pnpm deploy:static
```

This command:

- Builds the frontend.
- Replaces the root `docs` folder.
- Creates direct GitHub Pages entries for public routes.
- Runs a static audit to block `/api`, login, dashboard, and admin references.

## Before Committing

Run:

```powershell
pnpm typecheck
pnpm deploy:static
```

Commit the updated source files and `docs`.
