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
- **Visitors choose the order.** Research opens newest first as one grid;
  a row of pills offers Newest, Oldest, By theme and A–Z. The choice lives
  in the URL (`?order=oldest|theme|title`, omitted for newest) so it can be
  shared; the page is prerendered newest-first and applies the URL's choice
  after hydration. Where the browser supports view transitions (and motion
  is allowed) the plates glide to their new places. Outside the theme view
  a legend names the hue on each plate's top edge.
- **Newest is by date added.** Each project's `added` date is the first
  commit that put it in the catalogue (`git log --reverse -S "slug: '<slug>'"`);
  same-day ties fall back to catalogue position. Set it for every new
  project. The homepage's recent projects use the same order.
- **By theme** groups projects under the three themes (`researchThemes` in
  `src/researchProjects.ts`), newest first within each; each theme's accent
  marks its rule, its heading's marker wash and its plates. Grids fill
  evenly whatever a theme holds: one project spans the sheet, pairs and
  fours sit two across, threes three across.
- **Project plates.** The title sits centred on the project's still. Hover
  or keyboard focus plays the project's own demo loop, frames the plate in
  its theme's hue and moves the title down to the bottom edge, out of the
  footage's way. Loops are short muted MP4s
  in `public/media/hover-*.mp4` (128–440 KB, made by
  `scripts/encode-hover-clips.sh` from the reel's labelled segments and the
  former hover GIFs, which weighed up to 6 MB). Nothing downloads until the
  first hover; touch, reduced motion and Save-Data never load them. CASF and
  StereoPatch keep a still until footage of their own is approved.
- **Publications has its own page** at `/publications`, keeping the
  archive's own colouring: ink title and year index over the mosaic band,
  then the year-by-year ledger on the lab's blue, each year pinned beside its
  records while they scroll (stacked on phones). Research ends with a link
  to it.
- **Colour is kept, not traded away.** The claim's highlight, the five
  marker washes, theme headings marked in their wash, photographs in their
  own colour and the theme-coloured hover frame are all part of the system;
  only light diagrams are dimmed, to carry white type.

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
