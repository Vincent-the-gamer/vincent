# AGENTS.md - vincent

Agent entrypoint for this repository; use this file for repo-wide rules only.

## Project Knowledge

A personal blog built with Vue 3 + TypeScript + UnoCSS and statically generated with `vite-ssg`. Content is Markdown-first: posts and pages are `.md`, and interactive widgets are Vue components embedded straight into that Markdown (e.g. `<Typewriter />`).

- `pages/` — the routes. A file's path is its URL (`vite-plugin-pages`): `pages/posts/foo.md` → `/posts/foo`, `pages/lpd-detail/[id].vue` → `/lpd-detail/:id`. Posts are `.md`; feature pages may be `.vue`.
- `src/components/` — Vue components, embedded by name from Markdown.
- `src/logics/` — shared state and helpers (`~/logics`).
- `src/styles/` — global CSS (`main`, `prose`, `markdown`).
- `scripts/` — build helpers (`rss`, `copy-fonts`, `slugify`) used by the build.
- `public/` — static assets served at `/`.
- `~/` is an alias for `src/`.

## Content authoring

Posts live in `pages/posts/`. Frontmatter drives listing and SEO:

- `title`, `date` — a post needs both to appear in listings.
- `lang` — `zh` marks Chinese posts (badge in listings). The RSS feed includes only `lang: en` posts.
- `type` — `blog` (default), `note`, or `tool`; drives the listing filters.
- `art` — `dots` or `plum` renders the animated page background.
- `display` — overrides the rendered `<h1>` (use `''` to hide it).
- `desc`, `redirect`, `draft` — excerpt, external link, and hiding from listings.
- `lastModified` — auto-filled from the file's last git commit date when unset (falls back to file mtime outside a git checkout); set it explicitly in frontmatter to override. Requires full git history at build time (Netlify clones fully; disable shallow fetches in any other CI).

The build generates an Open Graph image from `title` into `og/<route>.png`; drop a sibling `<name>.png` next to the post to override it.

Markdown supports Shiki-highlighted code (dual light/dark), ` ```mermaid ` diagrams, GitHub `> [!NOTE]` alerts, and an auto table of contents from headings.

## Code style

- Vue components: Composition API with `<script setup lang="ts">`.
- Style with UnoCSS utilities and shortcuts (`bg-base`, `color-base`, `btn-*`), including attributify and `@apply`; reach for `<style>` only when utilities cannot express the result.
- Rely on auto-imports: `vue`, `vue-router`, `@vueuse/core`, and local components need no explicit import.
- Icons use the Iconify class form `i-<collection>-<name>` (e.g. `i-ri-menu-2-fill`).

## Forbidden operations

- CRITICAL: Do NOT run dangerous shell commands: e.g. `rm -rf`, `sudo`. Prefer scoped, reversible commands.
