# PAIR Lab site: project contract

Maintain an accurate, accessible, visually consistent research website for PAIR Lab at the University of Sydney. Prefer small, reviewable changes over new infrastructure. This contract adds project knowledge to the harness's general verification, browser, process, and handoff workflows; it does not replace them.

## Architecture and sources of truth

React + TypeScript + Vite, with static prerendering and a Cloudflare Worker. Production origin: `https://aus.bot`.

| Concern | Read / edit here |
|---|---|
| Homepage news | `src/news.ts`; presentation in `src/components/HomeNews.tsx` |
| People and affiliations | `src/people.ts`; presentation in `src/pages/PeoplePage.tsx` |
| Research catalogue, preview copy, media references | `src/researchProjects.ts`; `src/pages/ResearchPage.tsx` and `ProjectPage.tsx` |
| Publications | `src/publications.ts` is a bundled snapshot; `src/publicationSource.ts` owns the upstream URL/parser; `scripts/sync-publications.mjs` refreshes it |
| Layout and interaction | `src/pages/`, `src/components/`, `src/App.tsx` |
| Design system | Tokens at the top of `src/styles.css`; consume existing spacing, colour, type, and motion tokens |
| SEO and generated routes | `src/seo.ts`, `src/components/Seo.tsx`, `src/entry-server.tsx`, `scripts/prerender.mjs` |
| Redirects, project proxies, publications API | `src/worker.ts`, `wrangler.toml`; proxy checks in `scripts/check-project-proxy.mjs` |
| Public assets / deployment | `public/`, `public/_headers`, `.github/workflows/deploy-cloudflare.yml` |

Do not edit generated `dist/` or `.prerender/` output. Do not silently refresh publications or upgrade dependencies during unrelated work. Preserve existing user changes, including local `.claude/` files.

## Project invariants

- Never invent affiliations, authorship, publication status, research results, or recruitment promises. Use user-approved material or authoritative sources; ask when conflicting or missing.
- Preserve the distinction between lab preview pages (`/research/preview/:slug`) and Worker-proxied project sites (`/research/:slug/`). A slug change may affect data, routes, SEO/sitemap, Worker mappings, Wrangler matching, and redirects.
- Preserve canonical `aus.bot` URLs, deliberate trailing-slash/legacy redirects, prerendered content, and the custom 404. Inspect HTML before hydration as well as the browser when changing SEO.
- Preserve the existing visual language, research-theme accents, keyboard focus/skip navigation, and reduced-motion behavior. Do not redesign a page as a side effect of a content edit.
- Media lives in `public/`. Keep assets within the current 25 MiB/file check; use appropriate poster images and avoid unnecessary large downloads.
- Pushes to `main` can deploy. Do not push, run Wrangler deployment, trigger a deployment workflow, or change Cloudflare/DNS/secrets without explicit authorization. A release check is not permission to release.

## Commands and verification

Run from the repository root. Use a current Node 22 release to match CI; check `node --version` in the actual command environment. Login shells can select a different Node or change directory: verify `pwd` and runtime before diagnosing a repository failure.

- `npm ci` — reproducible dependency setup when needed; do not reinstall working dependencies gratuitously.
- `npm run dev` — frontend development.
- `npm run check` — lint + mocked project-proxy checks + news checks + typecheck/build/prerender + Cloudflare asset checks. No deploy or publication sync.
- `npm run preview -- --host 127.0.0.1 --port 4173 --strictPort` — inspect the freshly built frontend.
- `npm run sync:publications` — networked, rewrites the bundled snapshot; only for an intended publication update, then inspect the diff.

| Change | Required evidence |
|---|---|
| Instructions/docs only | Inspect diff, verify paths/commands and skill discovery; application build may be skipped if no executable configuration changes |
| Content or frontend code | `npm run check`; inspect affected generated content and browser flow |
| Styling, navigation, motion | Above + desktop/mobile browser checks, keyboard focus and reduced motion where affected |
| Routing, Worker, publication parser, deployment config | Above + targeted cases for changed behavior; use a local Worker integration check when needed, and state any untested upstream/production behavior |

`vite dev` and `vite preview` do **not** run the Worker. `usePublications.ts` skips the live API on localhost/127.0.0.1. Proxy checks mock upstream fetch: passing them does not establish live upstream availability. Never label local frontend evidence as full production verification.

## Workflows and model adaptation

- Visual design/redesign tasks: load `.pi/skills/frontend-design/SKILL.md` and the relevant design brief. For the homepage, see `docs/homepage-design.md` for the unified hero/News design and `docs/news-design.md` for list behavior. Upstream creative framing is not lab fact; never invent content or change unrelated pages to satisfy a style suggestion.
- Content tasks: load `.pi/skills/pairlab-content-update/SKILL.md`.
- Completion/release validation: load `.pi/skills/pairlab-release-check/SKILL.md`.
- Adapt task size and scaffolding, not the acceptance criteria. Narrow edits need a short impact checklist; unfamiliar models, small context, cross-layer changes, or observed mistakes need explicit file scope, smaller steps, and checkpoints.
- Read only the relevant source map entries first. If uncertainty remains or checks fail, investigate or ask; do not expand scope, install tools, switch models, or relax checks silently.
- Model names alone are not evidence of capability. Use the small evaluation protocol in `.pi/README.md` before claiming a profile is better.
- Store local screenshots/logs in ignored `.pi/artifacts/` and pause/resume context in ignored `.pi/handoffs/`. Never put secrets there. Promote durable team decisions into reviewed documentation instead.
