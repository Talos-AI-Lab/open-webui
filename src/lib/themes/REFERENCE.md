# Theme Author's Reference

Companion to [README.md](./README.md) (the contract). This maps what you see in the
UI to the variable that controls it, so you can author a theme without digging
through DevTools. Everything here is a Tailwind v4 theme variable: utility classes
compile to `var(--color-…)`, so overriding a variable inside `html.theme-<id>`
restyles every element that uses it.

## The levers at a glance

| Variable                          | What it controls                                                                                                              |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `--color-white`                   | Nearly every light-mode surface (chat area, modals, cards, message input) and the label text on filled buttons (`text-white`) |
| `--color-black`                   | Primary/send buttons (`bg-black`), strongest text (`text-black`), modal backdrops (`bg-black/60`)                             |
| `--color-gray-50 … 950` (+ `850`) | All neutral surfaces, borders and text — step-by-step breakdown below                                                         |
| `--color-blue-50 … 950`           | The interactive accent: links, checkboxes, toggles, focus rings, selected states, info banners                                |
| `--radius-xs … --radius-4xl`      | Corner rounding (`rounded-full` is not a token; avatars and pill buttons stay round)                                          |
| `--theme-font-family`             | The UI font (hooked into `html`, `pre` and `.font-primary`)                                                                   |

The status palettes — red (errors, destructive actions), green (success), yellow/amber
(warnings) — are also overridable the same way, but themes normally leave them alone so
semantic colors stay recognizable.

## Where each gray step shows up

The single most useful table when tuning a ramp. Light and dark mode use the ramp
from opposite ends:

| Step  | Light mode                                  | Dark mode                                  |
| ----- | ------------------------------------------- | ------------------------------------------ |
| `50`  | Sidebar background, subtle panels           | Headings, brightest text                   |
| `100` | Hover/pressed fills, subtle borders         | Primary text                               |
| `200` | **Default border color** (global base rule) | Secondary text                             |
| `300` | Stronger borders, disabled text             | Muted text, icons                          |
| `400` | **Placeholder text** (global base rule)     | Placeholder text, captions                 |
| `500` | Muted/secondary text                        | Secondary text, icons                      |
| `600` | Body secondary text                         | Subtle borders                             |
| `700` | Strong secondary text                       | Borders, hover fills                       |
| `800` | Near-primary text                           | Input and menu hover fills, inner panels   |
| `850` | (dark-only step)                            | Dropdown/menu backgrounds, tooltip borders |
| `900` | Primary text                                | **Main app/chat/modal background**         |
| `950` | Strongest text                              | **Sidebar background**, tooltips           |

## Element map

Verified against the components; classes shown as `light / dark`.

| UI element                | Classes                                                           | Variables to override                                |
| ------------------------- | ----------------------------------------------------------------- | ---------------------------------------------------- |
| App shell & chat area     | `bg-white` / `dark:bg-gray-900`                                   | `--color-white`, `--color-gray-900`                  |
| Sidebar                   | `bg-gray-50` / `dark:bg-gray-950`                                 | `--color-gray-50`, `--color-gray-950`                |
| Sidebar item hover/active | `bg-gray-100` / `dark:bg-gray-850`–`900`                          | `--color-gray-100`, `--color-gray-850/900`           |
| Message input             | `bg-white` / `dark:bg-gray-900`, inner `dark:bg-gray-800`         | `--color-white`, `--color-gray-800/900`              |
| Send / primary buttons    | `bg-black text-white` (inverted in dark)                          | `--color-black`, `--color-white`                     |
| Modals                    | `bg-white` / `dark:bg-gray-900`, backdrop `bg-black/60`           | `--color-white`, `--color-gray-900`, `--color-black` |
| Dropdowns & menus         | `bg-white` / `dark:bg-gray-850`, hover `gray-100/800`             | `--color-white`, `--color-gray-850`                  |
| Tooltips                  | `bg-gray-950` + `border-gray-900` (dark in both modes)            | `--color-gray-900/950`                               |
| Borders & dividers        | default border = `--color-gray-200` (base rule in `tailwind.css`) | `--color-gray-200`                                   |
| Input placeholders        | `--color-gray-400` (base rule in `tailwind.css`)                  | `--color-gray-400`                                   |
| Checkboxes & focus rings  | checked `bg-blue-600`, `focus:ring-blue-500`                      | `--color-blue-500/600`                               |
| Links, toggles, selection | `blue-400`–`600`                                                  | `--color-blue-400/500/600`                           |
| Login page backdrop       | `#auth-page-bg` id hook (gradients allowed)                       | see README contract                                  |
| Splash screen             | `#splash-screen` id hook                                          | see README contract                                  |

## What variables can't reach

Hardcoded values a theme cannot restyle through tokens (admins can still target them
instance-wide via Admin Settings → General → Custom CSS, and users personally via
Settings → General → Custom CSS):

- **Scrollbar thumbs** — fixed `rgba(215,215,215,.6)` / dark `rgba(67,67,67,.6)` in `src/app.css`.
- **Code syntax highlighting** — fixed hex highlight.js palette in `src/app.css`; code font is JetBrainsMono.
- **Toasts** — svelte-sonner `richColors` internal palette; follows light/dark mode only.
- **`<select>` chevron** — inline SVG with stroke `#6B7280`.
- **Logos and splash images** — image assets, and branding must stay intact anyway.
- **OLED mode** — pins `--color-gray-800…950` and `--color-black` to near-black inline, on purpose.

## Starter skeleton

```css
/* src/lib/themes/mytheme.css — register it in index.ts */
html.theme-mytheme {
	/* pick one hue (0-360) and keep it consistent; chroma ≥ 0.02 or the tint
	   is invisible; keep --color-white at L ≥ 0.95 so button labels stay readable */
	--color-white: oklch(0.965 0.02 250);
	--color-black: oklch(0.25 0.05 250);

	--color-gray-50: oklch(0.945 0.02 250);
	--color-gray-100: oklch(0.905 0.03 250);
	--color-gray-200: oklch(0.87 0.035 250);
	--color-gray-300: oklch(0.8 0.04 250);
	--color-gray-400: oklch(0.7 0.045 250);
	--color-gray-500: oklch(0.6 0.048 250);
	--color-gray-600: oklch(0.49 0.05 250);
	--color-gray-700: oklch(0.41 0.05 250);
	--color-gray-800: oklch(0.33 0.048 250);
	--color-gray-850: oklch(0.28 0.045 250);
	--color-gray-900: oklch(0.235 0.04 250);
	--color-gray-950: oklch(0.185 0.035 250);

	/* accent — keep the lightness ordering so pairings stay readable */
	--color-blue-400: oklch(0.71 0.13 250);
	--color-blue-500: oklch(0.63 0.15 250);
	--color-blue-600: oklch(0.55 0.15 250);
	/* ...extend to the full 50-950 ramp if banners/badges look off */
}

html.theme-mytheme #splash-screen,
html.theme-mytheme #auth-page-bg {
	background: linear-gradient(160deg, #eef2fa 0%, #d4e0f0 100%);
}
html.theme-mytheme.dark #splash-screen,
html.theme-mytheme.dark #auth-page-bg {
	background: linear-gradient(160deg, #0d1420 0%, #060a10 100%);
}
```

Checklist before shipping a theme: both light **and** dark mode, the login page, a
chat with code blocks and markdown, a modal (Settings), a dropdown menu, and OLED
mode (surfaces must stay pure black).
