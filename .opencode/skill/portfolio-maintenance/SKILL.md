---
name: portfolio-maintenance
description: Use when editing or maintaining the Firdous Fatima B.Ed portfolio in this repo — semester pages, slideshows, script.js, styles.css, assets, navigation, or GitHub Pages deploy. Use ONLY for this portfolio project.
---

# Portfolio maintenance

Static B.Ed student portfolio (Firdous Fatima), no build step, 5 HTML pages.
Deployed via GitHub Pages: push to `main` (remote `myst25-alt/portfolio`).

## Architecture
- `index.html` = homepage; `sem 1/`…`sem 4/` = self-contained semester folders,
  each with its own `assets/` + `styles.css`.
- ALL pages share the ONE root `script.js`. Semester pages load it as
  `../script.js` — never create per-folder script copies.
- Semester nav header: inline-styled `.nav-button`s (`← Semester N`, `🏠 Home`,
  `Semester N+1 →`). Homepage hero: 4 `.nav-button` links.
- Media lives per-semester under `assets/`; paths are relative to the page,
  not the script.

## Slideshow contract (do not regress)
- Markup: `.slideshow-container`/`.video-slideshow-container` → `.slides` with
  `<img>`/`<video>` children, `.prev`/`.next` buttons, sibling `.slide-counter`.
- Attach video `play`/`pause`/`ended` listeners ONCE at init. Never re-attach
  inside `showSlide` (listeners accumulate → erratic jumps).
- prev/next bind `click` ONLY — no `touchend` (double-fires on mobile).
- A video's `ended` must advance exactly one slide; no competing auto-advance.
- `.slide-counter` must equal `slides.length`; keep them in sync.

## Media rules
- Videos: `controls`, `preload="none"`, `playsinline`; always closed tags.
- `alt` is invalid on `<video>`; use it on `<img>` only.
- Never hide navigation on Android (e.g., no `display:none` on Home).

## Verification
- `python3 -m http.server` to serve; use the `browser-qa` skill (Playwright)
  for a 5-page × desktop/mobile sweep before considering changes done.
