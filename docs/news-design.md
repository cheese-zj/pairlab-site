# News section design

## Direction

A readable lab bulletin, not a promotional card grid. News replaces the homepage's lower introduction, research-theme cards, and publication preview. It follows the restored animated hero described in `docs/homepage-design.md`, sharing its black ground, content edges, and typography. Motion stays in the hero; News remains still. Navigation destinations and the research archive remain unchanged; the homepage footer no longer has an animated mosaic.

```text
Animated wordmark + dark campus atmosphere + brief lab introduction

News                      Research, people and life at PAIR Lab.
───────────────────────────────────────────────────────────────
19 Sep 2026    Descriptive announcement headline
               Optional short summary, wrapping naturally.
───────────────────────────────────────────────────────────────
Earlier date   Another announcement

Existing footer
```

The dates/headlines above describe structure only, not real lab announcements. On mobile, date sits above headline; preserve DOM order and full text. With no approved news, show one short honest message plus working Research and People links. No made-up timestamps, counts, badges, carousel, empty filters, or archive destination.

## Visual choices

- Ink `#11120f`: a continuous reading surface shared with the hero.
- White `#ffffff`: headings, underlined links and keyboard focus.
- Muted white, derived from existing `--on-dark-2`: dates and supporting text; verify contrast on ink.
- Existing Google Sans Flex, normal sentence case; no new font download or tiny monospace labels.
- Heading 32–44px, headlines 22–28px, body 16–18px, dates 14px; existing spacing tokens.
- One separation rule at the top and between records encodes the list, rather than framing each item as a card. No entrance animations or hover movement.

## Critique before implementation

The initial dark sidebar treatment gave a short heading and empty-state label too much space, repeated generic uppercase decoration, and competed with the adjacent publication list. Replace that with a simple header and full-width chronological content. Distinctiveness should come from real lab updates, not fake editorial embellishment. Without approved content, keep the section useful but modest; a fabricated feature story is not a design solution.

## Verification

- Empty, one-entry, multiple-entry, unlinked, and long-title states; chronology and input immutability.
- Full navigation for links, including Worker project URLs; date semantics and timezone-stable rendering preserved.
- Desktop/tablet/mobile (1440/768/390/320), keyboard focus, reduced motion, readable contrast, and no horizontal overflow.
- Test-only populated preview marked as a fixture and stored outside `dist`; never imported into production data.
- `npm run check`, generated HTML structure, browser screenshots, and unchanged Research archive/navigation.

## Revision: one sheet with the rest of the site

The first dark News pass read as a separate block: rails began mid-page, the
header used a free-floating tagline, and the empty state closed the homepage on
a dead end. The homepage now speaks the site's own vocabulary:

- Rails run from the top of the hero to the footer; each homepage section opens
  with a viewport-wide dashed cut. The hero ends in a mono telemetry row that
  also hosts the pause control (with `aria-pressed`).
- News and the recent-work row use the stamped kicker + heading pattern from the
  publications archive. Dates are mono telemetry; linked rows are clickable
  across their width through the headline link (one tab stop), with an arrow
  that fills sand on hover. The newest item sets a larger headline.
- A "Recent projects" row shows the last three entries in
  `src/researchProjects.ts` with the shared `ProjectCard`. It follows News when
  there are announcements and precedes it while `newsItems` is empty, where
  News folds into one compact row with an honest note and onward links.
- On the homepage the site bar floats clear over the photograph until scroll.
