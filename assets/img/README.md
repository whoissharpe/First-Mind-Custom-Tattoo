# Site imagery

## Status: placeholders

Every image this site expects is a **generated placeholder**, not a photo of
real work from the shop.

The original ask was to pull gallery photos from the shop's Facebook and
Instagram. That was not possible: this build environment blocks outbound
traffic to `facebook.com`, `instagram.com` and their CDNs at the network
tunnel. A headless Chromium hits the same wall (`ERR_TUNNEL_CONNECTION_FAILED`),
so it is not a scraping or user-agent problem — there is no client-side way
around it.

**Before this site goes live, replace these with real photos of real work.**
Showing generated tattoo imagery on a tattoo studio's portfolio would
misrepresent the shop.

## Getting the placeholder files

They are not committed (they are large binaries). To download them:

```bash
./scripts/fetch-assets.sh
```

If that fails, the links have expired — go straight to swapping in real photos.

## Swapping in real photos

Keep these filenames and nothing else needs to change:

| Filename                | Ratio | Where it appears                    |
|-------------------------|-------|-------------------------------------|
| `hero-wide.png`         | 16:9  | full-bleed hero background          |
| `hero-tall.png`         | 9:16  | spare portrait crop for the hero    |
| `studio-artist.png`     | 3:2   | "The studio" section + wide gallery tile |
| `work-rose.png`         | 4:5   | gallery                             |
| `work-blackgrey.png`    | 4:5   | gallery                             |
| `work-fineline.png`     | 4:5   | gallery                             |
| `work-flash.png`        | 4:5   | gallery + "Visit" section           |
| `work-station.png`      | 1:1   | gallery + booking section background |
| `work-traditional.png`  | 1:1   | gallery                             |
| `work-moth.png`         | 1:1   | gallery                             |

To add, remove or reorder gallery tiles, edit the `PHOTOS` array at the top of
`assets/js/main.js`. Each entry needs `src`, `w`, `h`, `caption` and `alt` —
`w`/`h` reserve layout space so the page doesn't jump while images load, and
`alt` is what screen readers announce, so describe the actual tattoo.

Recommended: export at ~1600px on the long edge as `.webp` or `.jpg` and update
the filenames in `PHOTOS`. PNGs of photographs are needlessly heavy.
