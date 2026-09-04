#!/usr/bin/env bash
# Download the generated placeholder imagery into assets/img/.
#
# These renders live on Higgsfield's CDN, which the build environment that
# created this site could not reach. Run this once from the repo root on a
# machine with normal internet access:
#
#     ./scripts/fetch-assets.sh
#
# Then replace them with real shop photos whenever you like — keep the
# filenames and everything keeps working.

set -euo pipefail

BASE="https://d8j0ntlcm91z4.cloudfront.net/user_3GGqBW4zpaaDAVr4CQwHyT8geRQ"
OUT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/assets/img"
mkdir -p "$OUT"

# local-name : remote-file
FILES="
hero-wide:hf_20260904_212245_5f4462f5-a6ee-4851-a411-42d1efe36c57.png
hero-tall:hf_20260904_212245_eb2371ff-3f2f-42e2-8d0f-9815a21bcbff.png
work-rose:hf_20260904_212245_c2684942-b4ac-4df1-a976-093628eb6a04.png
work-blackgrey:hf_20260904_212245_a6ad1bed-ac54-481b-998c-4b6b938b4ea8.png
work-station:hf_20260904_212245_c2c7a381-f942-4e4d-8567-a992da500d1b.png
work-fineline:hf_20260904_212246_793905a2-b1c9-4a11-9898-821a0f836ac7.png
work-traditional:hf_20260904_212245_94e0a2f7-0816-46d0-9ac4-70cc007aab12.png
work-flash:hf_20260904_212246_939511c7-accc-4dc2-a7f9-ebfd9f6986ad.png
work-moth:hf_20260904_212246_93b3d637-9c1e-4aad-aa03-a22fb28bf508.png
studio-artist:hf_20260904_212246_a28ad925-f169-41b3-8600-ad78d6e8f9e5.png
"

fail=0
for entry in $FILES; do
  name="${entry%%:*}"
  remote="${entry#*:}"
  printf '  %-18s ' "$name.png"
  if curl -fsS --max-time 120 -o "$OUT/$name.png" "$BASE/$remote"; then
    echo "ok ($(du -h "$OUT/$name.png" | cut -f1))"
  else
    echo "FAILED"
    fail=1
  fi
done

if [ "$fail" -ne 0 ]; then
  echo
  echo "Some downloads failed. These are temporary CDN links — if they have"
  echo "expired, just drop your own photos into assets/img/ using the same"
  echo "filenames (see assets/img/README.md)."
  exit 1
fi

echo
echo "Done. Open index.html in a browser."
