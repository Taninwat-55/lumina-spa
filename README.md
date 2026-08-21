# Lumina Spa

A scroll-driven landing page for a fictional spa — a self-initiated piece to push
scroll-choreographed animation without a build step.

**Live:** _to be added_

## What it is

Ten sections choreographed to scroll position: a layered hero, a pinned arrival
sequence with a parallax image, essential-oil cards, hand and stone compositions
animated on scrub, water ripples, a horizontally-scrolled ritual carousel, and a
sequential benefit reveal.

No framework, no bundler, no `npm install` — three static files totalling
**11.5 KB gzipped**, with the animation libraries loaded from CDN.

## Stack

- **GSAP 3.12.5** + **ScrollTrigger** — scroll-scrubbed timelines and pinning
- **Lenis 1.0.29** — smooth scroll
- Vanilla HTML/CSS/JS — no build step

## Running it

Any static server; there is nothing to compile.

```sh
python3 -m http.server 3000
```

Then open <http://127.0.0.1:3000>.

## Notes

Responsive down to 320px across three breakpoints (1100 / 768 / 480). Full-height
sections use `100dvh` with a `100vh` fallback, and both scroll-pinned sections
unpin below 1100px — a `position: sticky` element taller than the viewport can
never scroll its own bottom into view, which strands content on phones.
