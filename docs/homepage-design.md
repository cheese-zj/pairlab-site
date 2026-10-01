# Homepage design: film-first, dark identity kept

## User direction

October 2026: put the lab's one-minute film on the homepage, learning from
sunday.ai, and refresh the site so it feels fashionable, cool and smooth.
Earlier direction still holds: the cream homepage redesign was rejected, so the
original black ground, the animated striped wordmark and the sand accent stay.
The film replaces the campus photograph and the drifting mosaic canvas as the
hero's atmosphere; the mosaic survives as the band above footers and on Join.

## What we took from sunday.ai, and what we did not

Taken: a headline over an inset, rounded media frame that opens out to full
bleed as the page scrolls; a muted ambient loop with the full film one press
away; large, light, tightly tracked display type; a floating capsule nav;
pill-shaped controls; generous space instead of rules.

Not taken: their white ground, their sticky headline over the video (our
wordmark would fight the film's own captions), HLS streaming, and smooth-scroll
libraries (native scrolling keeps keyboard and assistive-technology behaviour).

## Plan

- Ink `#11120f` ground; Night `#090a08` behind the film and its dialog.
- White for type; Sand `#cdb98b` is the only accent (the play disc).
- Google Sans Flex only. Display weight 440, tracking −0.032em; labels in
  sentence case at 13–14px, no monospace or all-caps telemetry.
- Radius follows scale: 20px media frames (16px on phones), 12px photographs,
  full pills for anything pressed.
- Motion: one easing, `cubic-bezier(.16, 1, .3, 1)`.

```text
            ( ◆ PAIR Lab   Research  Publications  People  Join )

                      [ animated striped wordmark ]
                          Physical AI & Robotics
               We study how robots perceive, learn and act…

  ╭───────────────────────────────────────────────────────────────────╮
  │                    muted reel (footage only)                      │  ← inset, rounded;
  │                                                                   │    opens to full
  │                               ( ▶ Watch the film  1:00 ) ( ❚❚ )   │    bleed on scroll
  ╰───────────────────────────────────────────────────────────────────╯
  News                                   Research, people and life at PAIR Lab.
  Recent projects                                          ( All 8 projects → )
  Footer
```

The controls sit bottom right: the film's own captions use the other corners.

## Motion contract

- The frame's `clip-path` and the intro's fade run on the intro's view timeline
  (`exit 0%` → `exit 100%`), so the frame is fully open exactly when it reaches
  the top of the viewport. Browsers without scroll-driven animations, and
  reduced-motion visitors, keep the static inset frame.
- The reel's source is chosen on first play (1080p at ≥1100px wide, otherwise
  720p). It loads and plays only while motion is allowed, the frame is on
  screen, the tab is visible and the film dialog is closed.
- Reduced motion or Save-Data: the poster stays, nothing downloads, and the
  pause control is not offered. "Watch the film" always works.
- One pause control stops both the reel and the animated wordmark (WCAG 2.2.2).
- The film opens in a native modal `<dialog>`: focus moves to Close, Escape or a
  backdrop click closes it, focus returns to "Watch the film", page scroll is
  locked, and closing pauses and rewinds the film.

## Media pipeline and hosting

`scripts/encode-home-film.sh <master.mp4> [loop-start] [loop-end]` writes
`public/media/pairlab-film.mp4` (full cut with sound, ~19.5 MB),
`pairlab-reel-1080.mp4` (~12 MB) and `pairlab-reel-720.mp4` (~6 MB), plus
the two posters. Defaults match the v7 cut, whose footage runs 6.0–55.0 s
between the cream title and end cards; pass new bounds when the cut changes.

Cloudflare's static assets ignore `Range` and always answer 200 with the whole
file, and Safari will not play `<video>` without byte ranges. `/media/*` is
therefore routed through the Worker (`run_worker_first`), which answers ranges
itself. Everything is under the 25 MiB per-file limit. If the film grows or
traffic rises, Cloudflare Stream or R2 (both support ranges and, for Stream,
adaptive bitrate) is the next step; that needs account changes.

## Verification

Desktop/tablet/mobile down to 320px, no horizontal overflow, capsule fits at
320px, keyboard path through the film controls and dialog, live reduced motion,
pause/resume, generated SEO and `npm run check` (which includes the Worker's
range cases). Vite dev/preview do not run the Worker; check ranges with
`wrangler dev` before release. No deployment or push.
