# UI Themes

A theme is a CSS package that restyles Open WebUI through CSS custom properties — no
layout or markup changes. Themes are orthogonal to the light/dark/OLED mode setting:
the mode class (`.light`, `.dark`) and the theme class (`.theme-<id>`) coexist on
`<html>`, so every theme must look right in both modes.

## How it works

- Each theme is one CSS file in this directory, imported from `index.ts` and bundled
  with the app.
- `index.ts` exports the `THEME_STYLES` registry (id + display name) used by the
  admin default-theme selector and the user theme-style picker.
- The active theme is applied as a `theme-<id>` class on `document.documentElement`:
  before first paint by the inline script in `src/app.html`, and at runtime by
  `applyThemeStyle()` in `src/lib/utils/theme.ts`.
- The admin's instance-wide default (`default_theme` in `/api/config`) is cached in
  `localStorage.instanceThemeStyle`; a user override lives in `localStorage.themeStyle`.
  The override wins when set.
- `default` is the reserved id for the classic look — it has no CSS file and no class.

## Theme contract

All rules must be scoped under `html.theme-<id>` (id must match `/^[a-z0-9-]+$/`):

```css
html.theme-example {
	/* The three main levers, in order of visual impact:

	   1. --color-white / --color-black — Tailwind v4 theme variables. Nearly every
	      light-mode surface is `bg-white` and primary buttons are `bg-black`, so a
	      theme that skips these barely changes light mode at all.
	   2. The gray ramp (note the non-standard 850 step) — dark-mode surfaces, text,
	      borders. Use real chroma (0.02–0.05); below ~0.015 the tint is invisible.
	   3. The blue ramp — links, toggles, focus rings, selected states. Remap it to
	      the theme's accent hue. */
	--color-white: oklch(0.965 0.028 90);
	--color-black: oklch(0.27 0.045 60);
	--color-gray-50: oklch(0.945 0.03 88);
	/* ...all gray steps through 950, all blue steps you remap... */

	/* Optional: radii and font (hook defined in src/tailwind.css) */
	--radius-lg: 0.25rem;
	--theme-font-family: Georgia, serif;
}

/* Optional splash-screen and login-page backdrop (gradients allowed, no url()).
   The .dark variant needs the extra class to outrank the html.dark #splash-screen
   rule in src/app.html. */
html.theme-example #splash-screen,
html.theme-example #auth-page-bg {
	background: linear-gradient(160deg, #f8f3e7 0%, #eadfc4 100%);
}
html.theme-example.dark #splash-screen,
html.theme-example.dark #auth-page-bg {
	background: linear-gradient(160deg, #221a10 0%, #15100a 100%);
}
```

Rules:

1. Custom-property overrides only, plus the `#splash-screen` and `#auth-page-bg`
   hooks (the login page background hardcodes white/black, so variables can't
   reach it). No utility-class selectors, no `!important`, no layout properties,
   no external `url()`.
2. Provide the full gray ramp (50–950 including 850) or none of it — partial ramps
   mix tinted and neutral surfaces.
3. Check both `.light` and `.dark`. A single tinted ramp usually works for both; add
   an `html.theme-<id>.dark { ... }` block only if the dark end needs re-tuning.
4. The OLED mode intentionally wins over themes for grays 800–950 and
   `--color-black` (it pins them to near-black inline), so OLED users keep
   pure-black surfaces; the theme still tints text and borders.
5. If you override `--color-white`, remember it is also the `text-white` color used
   on filled buttons — keep it near-white so that text stays readable.

To add a theme: create the CSS file here, import it in `index.ts`, and add an entry
to `THEME_STYLES`. See [REFERENCE.md](./REFERENCE.md) for an element-by-element map
of which variable controls which part of the UI, plus a starter skeleton.

Admins can also apply instance-specific styling without rebuilding via
Admin Settings > General > Custom CSS, which is served at `/static/custom.css`.
