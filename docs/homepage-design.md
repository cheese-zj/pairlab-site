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

## First-visit intro

October 2026 direction: open a first visit with the PAIR Lab logo in motion,
in the lab's colours, then hand over to the film.

- The flat mark (`public/pairlab-mark-flat.png`) is sampled into a tile grid,
  the same tile language as the mosaic band, so the logo is never redrawn by
  hand. Tiles assemble from the gripper up while a diagonal wave of the four
  research accents (lifted toward white for the night ground) runs through
  them with a soft glow; they then resolve into the crisp white mark and
  "PAIR Lab" fades in beneath.
- Hand-over: the camera flies through the P's ring. The ring's opening grows
  and drifts to the centre of the screen until it clears every corner, so
  the homepage, with the reel already playing, appears inside the logo.
  About 2.8 s in all.
- Plays once per browser (`localStorage` `pairlab:intro-seen`); `/?intro`
  replays it, and so does pressing the PAIR Lab logo in the site bar while
  on the homepage (`src/introReplay.ts`): the page returns to the top behind
  the ink and the intro runs again. Under reduced motion the logo only
  returns to the top; on every other page it is an ordinary link home. Any key, click, wheel or touch scroll skips straight to the
  hand-over. Never plays under reduced motion or Save-Data.
- `index.html` decides before first paint (`html[data-intro]`), so the overlay
  never flashes in or out. Without a script it never shows; if the script
  has not started it within ~3 s, a CSS failsafe hides the overlay. The
  overlay is decorative (`aria-hidden`): the page beneath stays the content.

## Wide screens: the whole film on the first screen

A 16:9 frame at full width is taller than what is left of a laptop screen
under the wordmark, so laptops used to see only its top half. On landscape
screens 900px and wider the intro is tightened and the frame rests scaled
down, uncropped, so the whole picture fits under it, then grows to full bleed
on the same scroll timeline as before. The resting scale (`--film-rest-scale`,
0.5–1) depends on where the frame starts, so `HomeFilm` measures it: once by
an inline script before first paint, then after resizes and webfont swaps.
Corners and controls are counter-scaled to keep their real size. Phones keep
their 4:5 crop; reduced motion keeps the static inset frame.

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
pause/resume, the intro (first visit, skip, replay, reduced motion), the
resting frame on 1280–1440px laptops, generated SEO and `npm run check` (which includes the Worker's
range cases). Vite dev/preview do not run the Worker; check ranges with
`wrangler dev` before release. No deployment or push.
