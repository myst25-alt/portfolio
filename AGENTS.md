# Portfolio conventions

Static B.Ed portfolio (Firdous Fatima). No build step. GitHub Pages deploy = push to main.

## Architecture
- `index.html` homepage; `sem 1/`…`sem 4/` self-contained (own `assets/` + `styles.css`).
- ONE shared root `script.js`; semester pages load it as `../script.js`. Never re-add
  per-folder script copies.
- Nav header pattern: inline-styled `.nav-button`s (`← Semester N`, `🏠 Home`, `Semester N+1 →`).

## Slideshow rules (do not regress)
- Listeners on video slides attach ONCE at init — never inside `showSlide`.
- prev/next bind `click` only (no `touchend`).
- Video `ended` advances exactly one slide.
- `.slide-counter` must match `slides.length`.

## Media rules
- Videos: `controls`, `preload="none"`, `playsinline`, always closed tags.
- No `alt` on `<video>`; never hide nav on Android.

## Verification
- Serve: `python3 -m http.server`; sweep with the `browser-qa` skill (Playwright).
- Read the `portfolio-maintenance` skill for the full deep-dive.
