This README documents the optimization pipeline added to the repository.

What was added
- `package.json` with dev dependencies and scripts for building.
- `gulpfile.js` implementing image conversion (webp), responsive sizes (800/1200), CSS/JS minification and HTML minification.
- `assets/js/lazyload.js` runtime script that wraps <img> tags in <picture> with WebP source and lazy-loads them via IntersectionObserver.
- `.nojekyll` to ensure GitHub Pages serves the raw files.
- `.github/workflows/build.yml` CI workflow to build on pushes to `main` and upload `dist` as an artifact.

How to run locally

1) Install Node.js (v16+ recommended).
2) In the repository root run:

```powershell
npm ci
npm run build
```

3) The optimized site will be placed in `dist/`.

Notes & next steps
- The pipeline generates `-800` and `-1200` resized images and WebP equivalents in `dist/`.
- The client `assets/js/lazyload.js` wraps existing <img> tags at runtime so the HTML does not need mass editing.
- Next: update pages to include `<script src="assets/js/lazyload.js" defer></script>` before `</body>` (automatable in the build step).  Also add critical CSS inlining and more thorough HTML rewrites.

