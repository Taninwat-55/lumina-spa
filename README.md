# Lumina

A website for a bathhouse on Copenhagen's harbour that does not exist. Cold water, warm wood, quiet.
It is a design concept, built to show what one strong scroll moment can do for a small business site.

**Live:** <https://lumina-spa-sample.netlify.app>

## What it is

Four pages:

- **Home.** A harbour hero, the ritual in one sentence, and the signature moment. A sticky stage takes
  you from 9 °C harbour water to an 85 °C sauna as you scroll. Steam rises to hide the swap, the
  number climbs, and the warm line comes into focus out of the blur.
- **Rooms** (`rooms.html`). The plunge, the sauna and the rest room, then prices.
- **The place** (`place.html`). Address, getting there, opening hours, water by season, house rules.
- **Book** (`book.html`). A working booking form. Time slots follow the session type and a summary
  totals the price as you choose. It sends nothing and says so on the page.

## Stack

- Plain HTML, CSS and JavaScript. No framework, no bundler, no `npm install`.
- **GSAP 3.12.5** with **ScrollTrigger** for the scrubbed timeline, and **Lenis 1.1.13** for smooth
  scroll, both from a CDN.
- **Newsreader** and **Hanken Grotesk**, self-hosted in `assets/fonts`.
- Photos in `assets/img` as AVIF and WebP at 640, 1280 and 1920 px wide.

The authored code for the homepage is 11.1 KB gzipped (HTML, CSS and JS together).

## Running it

Any static server works; there is nothing to compile.

```sh
python3 -m http.server 3000
```

Then open <http://127.0.0.1:3000>.

## Adding a photo

```sh
sh tools/images.sh ~/Downloads/photo.jpg name
```

This writes `assets/img/name-{640,1280,1920}.{avif,webp}`. It needs `ffmpeg` with SVT-AV1 and `cwebp`
(both from Homebrew). Commit the output, so the site stays build-free.

## Notes

- **Motion is an extra.** Without JavaScript, or with reduced motion turned on, nothing pins or
  scrubs. The passage shows the warm room with both lines as plain text, and the booking form still
  works.
- **The hero entrance is pure CSS**, so it never waits on the CDN.
- **Pages change with a native cross-document view transition.** Browsers without support just load
  the next page.
- **Phones keep every link.** The menu moves to a second row instead of hiding behind a button.

## Credits

Photos from Unsplash: Margo Evardson (harbour), Naja Bertolt Jensen (water), Lukas Kubica (sauna),
Auroom Wellness (benches), HUUM (ladle and pour), Taylor Ulmer (towel).

The first version of Lumina, a ten-section day spa page, lives in the history at commit `51282b0`.
