# PAIR Lab / aus.bot

The public website for PAIR Lab at the University of Sydney, led by Dr Weiming (William) Zhi.

## Local development

Use a current Node 22 release (matching CI) and npm. Check the runtime in the shell that actually runs the command.

```bash
npm ci
npm run dev
```

Local release checks (no deployment):

```bash
npm run check
npm run preview -- --host 127.0.0.1 --port 4173 --strictPort
```

`check` runs lint, mocked project-proxy checks, news data/rendering checks, the TypeScript/client/SSR/prerender build, and Cloudflare asset checks. Individual commands remain available as `lint`, `check:project-proxy`, `check:news`, `build`, and `check:cloudflare`.

Vite development/preview does not run `src/worker.ts`. The publications hook also skips live refresh on localhost/127.0.0.1, so local browser checks exercise the bundled snapshot rather than `/api/publications`. Worker integration and live upstream availability need separate checks.

## Routes

- `/` — homepage
- `/research` — image-led research project catalogue
- `/research/preview/:slug` — pre-rendered PAIR Lab project preview pages
- `/research/patch`, `/research/trimanpolicy`, `/research/nestdex`, `/research/autointervene`, `/research/stereopatch` — canonical externally published project sites served through `aus.bot`
- `/people` — lab members
- `/join` — student and collaboration enquiries

The production build statically pre-renders every public route, writes `sitemap.xml`, and generates a custom `404.html`. Cloudflare serves the generated HTML with `404-page` fallback handling while React hydrates the pages for client-side navigation.

## Deploy with GitHub + Cloudflare Workers

1. Create a Cloudflare Workers Builds project named `pairlab-site` and connect the `cheese-zj/pairlab-site` repository.
2. Set `npm run check` as the build command and `npx wrangler deploy` as the deploy command. Changing these repository instructions does not update an existing Cloudflare Builds configuration; review that separately when authorized.
3. Keep `main` as the production branch; Cloudflare's Git integration will deploy every push.
4. Add `aus.bot` as the custom domain and follow the DNS prompt.

Wrangler serves `dist/` as Worker static assets. The included GitHub Actions workflow is an optional second deployment path. To enable it, add `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` as repository secrets. Without those secrets, the workflow runs `npm run check` and skips deployment. A push to `main` may deploy through either configured path; release verification alone is not authorization to push.

## Search indexing

- Canonical production URL: `https://aus.bot`
- Sitemap: `https://aus.bot/sitemap.xml`
- Robots file: `https://aus.bot/robots.txt`

After deployment, verify the domain in Google Search Console, submit the sitemap, and inspect the homepage plus the research pages.

## Project-specialized Pi workflow

Start Pi from this repository and approve project trust to load its local skills. `AGENTS.md` is the compact project contract; `.pi/README.md` explains model adaptation and the evaluation protocol.

- `/skill:frontend-design` — Anthropic's project-local design skill for intentional visual direction and frontend redesign. The homepage design direction is in `docs/homepage-design.md`; source revision/license are in `.pi/skills/frontend-design/UPSTREAM.md`.
- `/skill:pairlab-content-update` — sourced updates to news, people, research, publications, and media.
- `/skill:pairlab-release-check` — scoped verification across generated HTML, browser behavior, and Worker boundaries; never deploys.

The skills reuse your global browser/verification/process capabilities when available; no project package, model override, or new dependency is required. After adding or editing them, restart Pi if a new trust decision is needed, otherwise use `/reload`. Local handoffs and evidence live in ignored `.pi/handoffs/` and `.pi/artifacts/` directories; shared skills remain tracked.

## Homepage news

The homepage restores the original dark identity: an animated Sydney/PAIR Lab wordmark, campus backdrop and mosaic field lead into News on the same black surface. There is no small video/image panel or promotional hero button. A pause control stops both animations; reduced-motion users receive a still treatment. The Research archive remains unchanged. See `docs/homepage-design.md` and `docs/news-design.md`.

Add approved announcements to `newsItems` in `src/news.ts`. Each entry has a stable `id`, an actual announcement `date` (`YYYY-MM-DD`), a `title`, and optional `summary` and `href` (HTTPS or root-relative). The homepage renders newest first with a readable, timezone-stable date. Links use full navigation so Worker-proxied project destinations work too.

The list starts empty rather than inventing lab news. The homepage shows a short empty state with Research and People links until real items are supplied. Dates are labels, not a publishing scheduler: do not add embargoed announcements before they may be public. `npm run check:news` validates real entries and tests empty/populated rendering with test-only fixtures.

## Content notes

Research and biography copy is based on the lab lead's public profile and current University of Sydney research descriptions. The homepage uses the existing Sydney campus image and animated wordmark; `hero-wordmark-still.webp` is its source-derived reduced-motion/pause fallback.

Research demo videos are stored in `public/` and copied into `dist/` by Vite, so they deploy with the site without a backend. Cloudflare Pages currently limits each static asset to 25 MiB; compress new videos below that threshold before adding them to a project's `videos` array.
