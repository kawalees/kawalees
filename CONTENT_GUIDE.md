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
   `artist-name`
5. Reference local images like:
   `/artists/artist-name.jpg`
6. Run the static deploy command:
   `pnpm deploy:static`

Artist profile URLs are generated from the `id`:
`/kawalees/artist/artist-name`

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

The contact form supports general requests even when no artists are published yet. It collects email and phone details so the team can reply manually.

Artist photos are uploaded directly from the browser to Cloudinary using an unsigned upload preset, then the Formspree submission stores the image URL and Cloudinary public ID. This keeps the site fully static and avoids sending Base64 image payloads through Formspree.

Before launch, create a Cloudinary unsigned upload preset for pending artist photos. Recommended preset protections:

- Allow only image formats such as JPG, PNG, and WebP.
- Limit file size to match the form limit.
- Disable caller-supplied public IDs.
- Store uploads in a pending artists folder or asset folder.

Copy `artifacts/kawalees/.env.example` to `artifacts/kawalees/.env` and set:

```powershell
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=kawalees_pending_artists
```

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
