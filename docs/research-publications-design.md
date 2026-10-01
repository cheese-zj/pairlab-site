# Research and Publications design

## Direction

October 2026: remove the small generated-looking details (decorative
numbering, counters, eyebrow labels), split Research and Publications into
two pages, and make the project plates show the robots working.

## What changed, and why

- **No ordinals unless the content is a sequence.** Project ids (`01`–`08`),
  the "Showcase 01–08" strip, the numbered approach columns, People ordinals
  and zero-padded counts, demo-video numbers and publication record ids were
  all removed. None of them was a real order. The `id` field left the
  research catalogue; publication ids stay in data only as React keys.
- **Research is organised by theme.** The three themes and their summaries
  (`researchThemes` in `src/researchProjects.ts`) were a disconnected strip
  at the foot of the page; they now head the groups of projects, and each
  theme's accent marks its rule and its plates. Grids fill evenly whatever a
  theme holds: one project spans the sheet, pairs and fours sit two across,
  threes three across. The claim headline and its paragraph lost their
  marker highlights (the one-phrase accent was the commonest tell).
- **Project plates.** The title sits centred on a dimmed still. Hover or
  keyboard focus plays the project's own demo loop and the title steps down
  to the bottom edge, out of the footage's way. Loops are short muted MP4s
  in `public/media/hover-*.mp4` (128–440 KB, made by
  `scripts/encode-hover-clips.sh` from the reel's labelled segments and the
  former hover GIFs, which weighed up to 6 MB). Nothing downloads until the
  first hover; touch, reduced motion and Save-Data never load them. CASF and
  StereoPatch keep a still until footage of their own is approved.
- **Publications has its own page** at `/publications`: the same cream
  ground as Research and People, a year index, and a ledger in which each
  year stays pinned beside its records while they scroll (stacked on
  phones). Research ends with a link to it.

## Routing and compatibility

- `/publications` is prerendered, in the sitemap, and has its own title,
  description and breadcrumb. The Worker's old 301 from `/publications` to
  `/research` is gone; the mocked proxy check asserts it.
- Browsers that followed that permanent redirect may have cached it, so a
  returning visitor's bookmark can still land on `/research` until their
  cache forgets it. The nav link is the way across.
- Old `/research#publications` and `/research#publication-year-YYYY` links
  are forwarded client-side to `/publications` (fragments never reach the
  Worker).
