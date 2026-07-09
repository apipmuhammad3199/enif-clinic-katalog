# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

A React + Vite single-page catalog/CMS website for "Enef Clinic" (Indonesian aesthetic clinic). The actual app lives in `katalog-web/` — the repo root only holds deploy scripts. Content (treatments, promos, products, articles, before/after photos, testimonials, PDF catalogs) is managed through an in-app CMS backed by Firebase, and rendered on public-facing catalog pages.

## Commands

All commands run from `katalog-web/`, not the repo root.

```
npm run dev       # start Vite dev server
npm run build     # production build to dist/
npm run lint      # oxlint (see .oxlintrc.json — react + oxc plugins)
npm run preview   # preview a production build locally
npm run deploy    # predeploy runs build, then node deploy.js
```

There is no test suite configured in this project.

### Deployment

Two independent deploy paths exist — don't assume either is what's currently used without asking:
- `npm run deploy` (in `katalog-web/`) runs `deploy.js`, which force-pushes `katalog-web/dist` to the `gh-pages` branch of `github.com/apipmuhammad3199/enif-clinic-katalog`.
- `deploy_final.ps1` (repo root) does an orphan-branch (`gh-pages-temp`) push of `katalog-web/dist` to `origin`'s `gh-pages` branch instead.
- `.github/workflows/` exists but is currently empty — no CI is configured.

Both paths force-push to `gh-pages`; treat that as a real, hard-to-reverse action and confirm before running.

## Architecture

### Data flow: Firestore is the source of truth, seeded once from bundled JSON

`src/context/CMSContext.jsx` is the single hub for all app data. It wraps the app (`App.jsx`) in a `CMSProvider` and exposes every collection plus CRUD actions (`treatments`, `promos`, `videos`, `promoSettings`, `skincareProducts`, `perawatanPDFs`, `beforeAfterImages`, `users`, `testimonials`, `articles`) via `useContext(CMSContext)`.

On first load it seeds Firestore collections from local defaults (`src/data.json` for treatments, `src/data/articles.js` for articles, hardcoded arrays for promos/videos/before-after/skincare/testimonials/perawatan PDFs), gated by a `settings/seedStatusV6` doc so seeding only happens once. Bump that doc ID (e.g. `seedStatusV7`) when you need to force a re-seed after changing defaults. After seeding, it also does a one-time `forceSyncImages` pass to backfill missing `image` fields on `treatments`/`perawatan_pdfs` docs by matching against `data.json` by name.

All live data thereafter comes from `onSnapshot` listeners on the Firestore collections — components should read from `CMSContext`, not from the bundled JSON, except as a seed/fallback source.

Firebase config (`src/firebase.js`) is a public web API key hardcoded in source — this is normal for Firebase client SDKs (security is enforced via Firestore/Storage rules, not key secrecy), not a leaked secret to redact.

### Auth is not real auth

`ProtectedRoute` in `App.jsx` and the login flow gate `/admin` purely on `localStorage.getItem('cms_auth') === 'true'`. Users are plain documents in the `users` Firestore collection with a plaintext `password` field (a default `admin/admin123` is auto-created if the collection is ever empty). Do not treat this as a security boundary — if asked to hard security-review this app, flag it, but don't "fix" it unprompted since it's a deliberate simplicity tradeoff for a low-stakes internal CMS.

### PDF/treatment matching is name-based and layered

Treatment "cards" (`src/components/TreatmentCard.jsx`) resolve their PDF link through a fallback chain, checked in this order:
1. `treatment.pdfLink` set directly on the Firestore doc (including external links added via the CMS — see recent `feat(cms): add external PDF link option`).
2. A same-named doc in the `perawatan_pdfs` Firestore collection (matched by lowercase/trimmed `name`).
3. A same-named (or substring-matched) file in `src/data/localPdfs.json`, resolved to `assets/perawatan/<file>` in `public/`.
4. `treatment.filename`, resolved to `assets/treatments/<filename>` in `public/` (the disc45/disc50 folders referenced by `generate_data.js`).

Images follow a similar `treatment.image` → `localMatch` fallback pattern. When changing treatment/PDF data shapes, all four fallback layers need to stay consistent or catalog cards silently lose their PDF/image.

`generate_data.js` is a one-off script that regenerates `src/data.json` from the PDF files physically present in `public/assets/treatments/disc45` and `disc50` — rerun it manually after adding/removing files in those folders, it is not wired into the build.

### File uploads

Admin uploads (`src/pages/Admin.jsx`) go to Firebase Storage via `uploadFileToStorage` (returns a download URL saved onto the Firestore doc), with images alternatively compressed to base64 (`compressImageToBase64`) and stored inline rather than in Storage. `Admin.jsx` is a large single file (~1300 lines) organized as repeated per-section blocks (state + handlers + JSX) for each CMS section — when adding a new manageable content type, follow the existing section's pattern (state hooks → `handleAdd*`/`handleEdit*` → context CRUD call → toast notification) rather than introducing a new pattern.

### Routing

`HashRouter` (not `BrowserRouter`) is used in `App.jsx` — required because the site is deployed to GitHub Pages as static files with no server-side rewrite support. Keep this in mind when adding routes or reasoning about URLs (paths appear after a `#`).
