# FIRSTMIND Custom Tattoo

Website for [FIRSTMIND Custom Tattoo](https://www.facebook.com/firstmindtattoo/) —
a family-owned custom tattoo studio at 12187 Beach Blvd #4, Jacksonville, FL 32246.

Static site: plain HTML, CSS and JavaScript. No build step, no dependencies,
no framework. Deployable to GitHub Pages, Netlify, or any static host by
copying the folder.

## Run it

```bash
./scripts/fetch-assets.sh     # downloads the placeholder imagery
python3 -m http.server 8000   # or: npx http-server
```

Then open <http://localhost:8000>. Opening `index.html` directly works too.

## Layout

```
index.html              all page content
assets/css/style.css    design tokens + all styling
assets/js/main.js       gallery data, reveals, lightbox, nav
assets/img/             photography  (see its README)
assets/brand/           logo + favicon (placeholder — see its README)
scripts/fetch-assets.sh downloads the placeholder images
```

## Design

Deep dark ground, ember-orange accent, condensed signage display type (Oswald)
against a neutral sans (Inter). One accent colour, two typefaces, near-square
corners — the restraint is deliberate.

The hero is full-bleed with restrained motion: a slow Ken Burns drift on the
background, animated film grain, a staggered text reveal on load, and a few
pixels of pointer parallax. Everything animates via `transform`/`opacity` only,
and the entire motion system is disabled under `prefers-reduced-motion`.

Colour, spacing and type are CSS custom properties at the top of `style.css`.
Change them there and the whole site follows.

## Before this goes live

Two things in this repo are stand-ins, and one section is unverified:

- [ ] **Replace the imagery.** Every photo is AI-generated placeholder art.
      Publishing generated tattoos as a studio's portfolio would misrepresent
      the shop. See `assets/img/README.md`.
- [ ] **Replace the logo.** `assets/brand/logo.svg` is a placeholder monogram,
      not the shop's real mark. See `assets/brand/README.md`.
- [ ] **Add real opening hours.** Marked with a `TODO` comment in the `#visit`
      section of `index.html`; the page currently tells visitors to call.
- [ ] **Verify all copy.** Address, phone, email and the owners' names
      (Natalie & Alex Braddock) came from public search results, not from the
      shop directly. Confirm each one.
- [ ] **Point the social links at the right profiles** if either has moved.

### Why the placeholders exist

The site was built in an environment whose network policy blocks
`facebook.com`, `instagram.com` and their CDNs at the network tunnel, so the
shop's own photos and profile picture could not be downloaded — a headless
browser fails identically (`ERR_TUNNEL_CONNECTION_FAILED`). The placeholders
keep the layout honest about its proportions until real assets replace them.
