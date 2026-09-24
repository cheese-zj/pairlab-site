# Homepage design: dark identity restored

## User direction

The cream redesign was rejected: it lost the original site's character. Prioritize the original black ground, animated striped wordmark and mosaic field rather than a small robotics image, video panel or prominent action buttons. News should belong to the same dark page.

## Plan and critique before implementation

- Ink `#11120f`: continuous header, hero, News and footer ground.
- Near-black `#0a0c0a`: photographic scrim and mosaic cells, inherited from the original animation.
- White `#ffffff`: wordmark, headings, links and focus.
- Sand `#cdb98b`: existing palette, naturally echoed by Sydney's sandstone; no new decorative accent.
- Existing Google Sans Flex: 28–40px supporting hero heading, 17–18px concise lab copy, 32–44px News, 14px dates. The original animated wordmark, not oversized marketing copy, is the hero.

```text
Dark navigation
┌──────────────────────────────────────────────────────────────┐
│               Animated Sydney / PAIR Lab                     │
│                  Physical AI & Robotics                       │
│              Concise lab + university intro                   │
│                                               Pause animation│
└──────────────────────────────────────────────────────────────┘
News                        Research, people and life at PAIR Lab.
Date                        White linked headline + short summary
Compact dark footer
```

Restore the full-size campus image as atmosphere, not a small content card. Per the user's refinement, use one vertical black fade: fully transparent at the top, solid ink at the bottom, blending directly into News. Apply the same direction on desktop and mobile; place both photo and mosaic below the scrim so neither interrupts the solid-black endpoint. Give the hero presence without requiring a full screen before News; preserve text contrast through the middle/lower gradient. Let navigation handle exploration, with no hero call-to-action buttons.

The animated wordmark and supporting text are horizontally centered as one group over the vertical fade, on desktop and mobile. News retains its left-aligned reading layout.

The memorable element is the original striped wordmark and drifting tiles. Do not introduce a new neon palette, card grid, video carousel, counters or animation on News rows. One small, text-like pause/resume control is an accessibility utility, not a promotional CTA. Keep the compact footer without another moving band on the homepage.

## Motion contract

- The original `hero-wordmark.webp` has56 frames alternating Sydney and PAIR Lab. Use it only when motion is enabled.
- `hero-wordmark-still.webp` is a lossless frame0 derivative of that asset. Use it for reduced motion and manual pause, including safe SSR output.
- Both wordmark and canvas respond to live OS reduced-motion changes and the same pause control.
- Canvas schedules no frames when paused, offscreen or in a hidden document; resize still paints a stable frame. Clean up observers/listeners/RAF on unmount.
- Do not claim a CSS animation check validates animated WebP or canvas; test image source selection and canvas pixels over time.

## Content and verification

Use only the existing lab affiliation and research focus. No invented news; retain `src/news.ts` and list sorting/date semantics. Other route designs and navigation destinations stay unchanged.

Verify desktop/tablet/mobile down to320px, keyboard/skip navigation, pause/resume, live reduced motion, dark-surface contrast, empty and long populated News fixtures, generated SEO and `npm run check`. Record existing cross-route hydration warnings separately; no deployment/push.
