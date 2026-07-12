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
- `/research/:slug` — individual research project pages
- `/people` — lab members
- `/join` — student and collaboration enquiries

The Cloudflare `_redirects` file serves these client-side routes through the Vite entry point.

## Deploy with GitHub + Cloudflare Pages

1. Create a Cloudflare Pages project named `pairlab-aus-bot` and connect the `cheese-zj/pairlab-site` repository.
2. Set `npm run build` as the build command and `dist` as the output directory.
3. Keep `main` as the production branch; Cloudflare's Git integration will deploy every push.
4. In Cloudflare Pages, add `aus.bot` as the custom domain and follow the DNS prompt.

The included GitHub Actions workflow is an optional second deployment path. To enable it, add `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` as repository secrets. Without those secrets, the workflow validates the production build and safely skips deployment.

## Content notes

Research and biography copy is based on the lab lead's public profile and current University of Sydney research descriptions. The hero uses the supplied University of Sydney Quadrangle photograph.

Research demo videos are stored in `public/` and copied into `dist/` by Vite, so they deploy with the site without a backend. Cloudflare Pages currently limits each static asset to 25 MiB; compress new videos below that threshold before adding them to a project's `videos` array.
