# Brand assets

`logo.svg` is a **placeholder** monogram, not the shop's real logo.

I could not download the real logo from the Facebook/Instagram profile picture:
this build environment blocks all outbound traffic to Meta's domains and CDNs at
the network layer, so neither `curl` nor a headless browser can reach them.

## To swap in the real logo

1. Save the profile picture from
   [Facebook](https://www.facebook.com/firstmindtattoo/) or
   [Instagram](https://www.instagram.com/firstmindtattoo/)
   (or, better, get the original vector/PNG from the shop).
2. Replace `assets/brand/logo.svg` — keep the filename, or update the two
   references in `index.html` (`.brand-mark` and the `<link rel="icon">`).
3. If the real logo has its own colours, update the palette at the top of
   `assets/css/style.css`. The whole site is driven by these tokens:

   | Token          | Current   | Used for                        |
   |----------------|-----------|---------------------------------|
   | `--ink`        | `#0B0A09` | page background                 |
   | `--bone`       | `#F5F1EA` | primary text                    |
   | `--ember`      | `#D4551E` | buttons, rules, accents         |
   | `--ember-soft` | `#E8843F` | small accent text (higher contrast) |

   Both accent values clear WCAG AA against `--ink` (4.8:1 and 7.5:1). If you
   change them, re-check contrast before publishing.
