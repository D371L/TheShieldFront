# The Shield Front: Guardians of Balance

This repository contains the Svelte + Vite frontend for the civic organization "The Shield Front". The project delivers a fast static site with animated UI elements, dynamic report loading, and strengthened accessibility.

## Prerequisites

- [Bun](https://bun.sh/) ≥ 1.2 (already installed in the environment)

## Useful Commands

```bash
bun install        # install dependencies
bun run dev        # start dev server (default http://localhost:5173)
bun run build      # produce production build to dist/
bun run preview    # preview the production build locally
```

The build artefacts (HTML/JS/CSS) live under `dist/` and can be deployed to any static hosting/CDN.

## Project Structure

- `src/` – Svelte components, interactions, and global styles (`app.css`)
- `public/` – static assets served as-is (logo, sitemap, robots, reports data, etc.)
- `svelte.config.js` & `vite.config.js` – project configuration
- `bun.lock` – Bun lockfile

## Implementation Notes

- The reports list is fetched from `public/data/reports.json` with graceful error handling.
- Toasts, the progress bar, burger navigation, reveal-on-scroll animations, and grid walkers were reimplemented with Svelte and respect `prefers-reduced-motion`.
- CSP remains strict (`script-src 'self'`); only the JSON-LD script is whitelisted via a manual SHA-256 hash. Recalculate the hash if you edit the payload.

Feel free to extend components or localize the content—Svelte makes it straightforward to add new sections or dynamic behavior.
