# Firstmind Custom Tattoo

Marketing site for Firstmind Custom Tattoo, 12187 Beach Blvd #4, Jacksonville, FL 32246.

The repo is also intended to hold a CRM for the shop. That has not been started;
everything here is the public site.

Static HTML, CSS and vanilla JS. No build step, no dependencies to install. Open
`index.html` or serve the folder and it runs.

```bash
python -m http.server 4173
```

## Deploying

Any static host works. For GitHub Pages, push to `main` and set Pages to serve from
the repository root.

## Brand

| Token | Value | Use |
| --- | --- | --- |
| Ink | `#0c0d0e` | page background |
| Apple green | `#8cc63f` | mark, CTAs, accents |
| Bone | `#f3f3f0` | body text and the hero wordmark |

The mark in `assets/img/logo.svg` is a vector rebuild of the studio's own badge,
simplified to one disc, one ring and sixteen tapered rays so it stays legible at
16px. The page defines it once as an SVG `<symbol>` and reuses it.

Type is Anton for display and Archivo for everything else, both from Google Fonts.
Icons are Phosphor Light from jsDelivr. Those are the only two external requests.

## Images

`assets/img/work/` and `assets/img/shop-door.webp` are the studio's own photographs,
pulled from the Instagram and Facebook accounts and re-encoded as WebP.

`assets/img/gen/` are generated atmosphere and texture plates, not photographs of
real work:

| File | Where it is used |
| --- | --- |
| `flash-green.webp` | drifting flash field behind the hero |
| `flash-ink.webp` | clipped inside the hero wordmark |
| `stencil-lightbox.webp` | "Draw" cell in the process grid |
| `sterile-flatlay.webp` | "Set up" cell in the process grid |
| `studio-station.webp` | studio section |
| `hero-studio.webp` | social share card only (`og:image`) |

## Logo

`assets/img/logo/` holds the generated tattooed-letter logos, cut out to
transparent PNG alpha so they sit on any background.

| File | Notes |
| --- | --- |
| `lockup-flash.webp` | **primary.** Wordmark, green rule, CUSTOM TATTOO. Used in the header and the footer |
| `wordmark-flash.webp` | wordmark alone, dense fill |
| `wordmark-outline.webp` | heavy outline, one motif per letter. The variant that survives shrinking best |
| `emblem-flash.webp` | FM in a green ring |

These are raster and only work large. The favicon cannot use one, so
`assets/img/favicon.svg` (and the standalone `assets/img/logo.svg`) keep an FM
monogram drawn as vector outlines in Anton's proportions, sharp down to 16px.

The letters in the generated logos carry small illegible marks inside the flash
texture, an artifact of image generation. They read as linework at size. If the
shop wants the logo for print or signage, it should be redrawn as vector art.

## The booking form

There is no backend. On submit the form validates, then hands a fully written
email to the visitor's mail client addressed to `firstmindartemporium@gmail.com`.

To post to a real endpoint instead (Formspree, Basin, a Worker), add the URL to the
form tag and the fetch path in `assets/js/main.js` takes over:

```html
<form class="form" id="bookForm" data-endpoint="https://example.com/your-endpoint" novalidate>
```

## Still needed from the shop

- **Opening hours.** Nothing verifiable was published, so the contact panel says
  "Appointments and walk-ins. Call ahead" instead of listing times. Replace the
  copy in the Hours block once the real hours are confirmed.
- **A real domain** for the `canonical` and `og:image` tags, which currently point
  at `firstmindcustom.com` and a relative path.
- **Artist bios.** The four descriptions are written from what each artist posts
  publicly. Worth having them confirm or rewrite their own line.

## Accessibility and motion

Every animation is gated behind `prefers-reduced-motion`. There are no scroll
event listeners; reveals and the nav state run on `IntersectionObserver`, and the
hero settle uses a scroll-driven CSS timeline where the browser supports one.
