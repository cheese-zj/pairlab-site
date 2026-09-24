---
name: pairlab-release-check
description: Validate PAIR Lab site changes before a completion or release-readiness claim. Check lint/build, prerendered SEO, proxy behavior, media limits, and affected desktop/mobile flows while distinguishing local checks from production evidence. Does not deploy.
---

# PAIR Lab release check

Read `AGENTS.md` and the current diff. This workflow verifies changes; it does not authorize a push or deployment. Use the general verification, browser, and managed-process workflows when available.

## 1. Establish the verification scope

Record the acceptance criteria, changed files, and runtime (`node --version`). Prefer current Node 22 to match CI. Confirm the repository directory inside the shell that actually runs the checks. Preserve unrelated work; do not reset files or refresh publications to get a green result.

For instructions-only edits, validate paths, commands, frontmatter, and Pi discovery. For code, content, scripts, or CI changes, run the mechanical gate below. Additional checks depend on the changed behavior, not model confidence.

## 2. Mechanical gate

```bash
npm run check
```

This runs:
1. `npm run lint`
2. `npm run check:project-proxy` — mocked Worker checks for the five existing project sites
3. `npm run check:news` — news data validation and empty/populated rendering, ordering, links, escaping and date formatting
4. `npm run build` — TypeScript, client and SSR builds, prerendered pages, sitemap and 404
5. `npm run check:cloudflare` — built asset size/count and required files

Inspect the full relevant output and exit status. A failure stops the aggregate; do not claim later checks ran. Fix in-scope failures and rerun, or report the blocker. Existing proxy cases are not exhaustive: add targeted assertions for any new behavior rather than relying on an unchanged green suite.

## 3. Generated HTML and SEO

For affected routes, inspect files in `dist/` **before** browser JavaScript can alter them:
- Expected page content and title/description.
- Exactly one intended canonical under `https://aus.bot`, with the established trailing slash.
- Appropriate social image and valid JSON-LD where relevant.
- Intended sitemap membership; no accidental removal of preview or canonical project URLs.
- Custom `dist/404.html` remains noindex.

Proxied project HTML comes from the Worker, not a generated local project-site file. Check rewritten canonical/asset paths at that layer. Do not hand-edit `dist/` to make a check pass.

## 4. Browser smoke

Check existing managed processes, then start/reuse a preview of the fresh build bound to loopback. An example command is:

```bash
npm run preview -- --host 127.0.0.1 --port 4173 --strictPort
```

Use a unique task-owned browser session. Inspect affected routes at a desktop viewport (e.g. 1440×900) and a mobile viewport (e.g. 390×844):
- Content, images/posters, wrapping, clipping, and horizontal overflow.
- Main navigation and actual destination; Research → project preview → intended project-site link.
- Publications anchor/year navigation when affected; People and Join links when affected. Do not submit inquiries or send email.
- Keyboard focus/skip link and reduced-motion behavior when relevant to the change.
- Console errors, missing local assets, and hydration warnings. Separate external service/font failures from local regressions.

Capture and inspect screenshots for visual changes. Store local evidence in ignored `.pi/artifacts/`. Close only the browser session and server this task owns when finished.

## 5. Worker / production boundary

- Vite preview is frontend-only. It cannot prove Worker redirects, upstream proxy behavior, response status/headers, or the live publications API.
- The publication hook deliberately skips live refresh on localhost/127.0.0.1. A local research page proves only the bundled snapshot path.
- Proxy tests mock fetch. For changes to routing/headers/integration, use the installed Wrangler's local dev mode after checking its help (`npx --no-install wrangler dev --help`); avoid remote mode and do not deploy. Local Worker execution may still contact external project/publication sources, so identify those dependencies.
- Test the changed redirect/status/query/asset/failure cases at the Worker layer. Document mocks and any unavailable upstream. Live production checks require an appropriate authorized scope and are separate evidence.

## 6. Completion report

List changed behavior, commands that passed/failed, browser routes/viewports checked, and anything unverified. Evidence becomes stale after a relevant edit; rerun affected checks. "Local checks passed; production not tested" is valid. "Production ready" based only on screenshots is not.
