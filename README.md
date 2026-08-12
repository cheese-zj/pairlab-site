# PAIR Lab / aus.bot

The public website for PAIR Lab at the University of Sydney, led by Dr Weiming (William) Zhi.

## Local development

```bash
npm install
npm run dev
```

Production verification:

```bash
npm run lint
npm run build
npm run preview
```

## Routes

- `/` — homepage
- `/research` — image-led research project catalogue
- `/research/preview/:slug` — pre-rendered PAIR Lab project preview pages
- `/research/patch`, `/research/trimanpolicy`, `/research/autointervene` — canonical externally published project sites served through `aus.bot`
- `/people` — lab members
- `/join` — student and collaboration enquiries

The production build statically pre-renders every public route, writes `sitemap.xml`, and generates a custom `404.html`. Cloudflare serves the generated HTML with `404-page` fallback handling while React hydrates the pages for client-side navigation.

## Deploy with GitHub + Cloudflare Workers

1. Create a Cloudflare Workers Builds project named `pairlab-site` and connect the `cheese-zj/pairlab-site` repository.
2. Set `npm run build` as the build command and `npx wrangler deploy` as the deploy command.
3. Keep `main` as the production branch; Cloudflare's Git integration will deploy every push.
4. Add `aus.bot` as the custom domain and follow the DNS prompt.

Wrangler serves `dist/` as Worker static assets. The included GitHub Actions workflow is an optional second deployment path. To enable it, add `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` as repository secrets. Without those secrets, the workflow validates the production build and skips deployment.

## Search indexing

- Canonical production URL: `https://aus.bot`
- Sitemap: `https://aus.bot/sitemap.xml`
- Robots file: `https://aus.bot/robots.txt`

After deployment, verify the domain in Google Search Console, submit the sitemap, and inspect the homepage plus the research pages.

## Content notes

Research and biography copy is based on the lab lead's public profile and current University of Sydney research descriptions. The hero crossfades between supplied photographs of the lab's robotics systems.

Research demo videos are stored in `public/` and copied into `dist/` by Vite, so they deploy with the site without a backend. Cloudflare Pages currently limits each static asset to 25 MiB; compress new videos below that threshold before adding them to a project's `videos` array.
