---
name: screenshot-diff
description: Analyze a visual-regression PNG screenshot against its previous git version and classify the change as sub-pixel rendering, transition / animation flakiness, browser-update rasterization noise, or a legit content change. Use when investigating an updated visual baseline (e.g. after a Playwright/Chromium bump or a component change). Pass the path to the PNG as the argument.
tools: Bash, Read, Grep, Glob
---

# Screenshot Diff Analyzer

Classify a visual-regression baseline diff. The user has updated (or is about to update) a PNG baseline; figure out whether the change is benign rasterization noise, animation flakiness, or a real content change that warrants investigation.

**Argument:** `$ARGUMENTS` — relative or absolute path to a PNG screenshot tracked by git.

If `$ARGUMENTS` is empty, ask the user for the path and stop.

---

## Workflow

### 1. Resolve the file and pull the previous version

Substitute `$ARGUMENTS` (or the path the user gave) wherever you see `<path>`:

```bash
PATH_ARG="<path>"
ABS="$(cd "$(dirname "$PATH_ARG")" && pwd)/$(basename "$PATH_ARG")"
test -f "$ABS" || { echo "Not a file: $ABS"; exit 1; }
DIR="$(dirname "$ABS")"
REL="$(git -C "$DIR" ls-files --full-name -- "$ABS")"
test -n "$REL" || { echo "Not tracked by git: $ABS"; exit 1; }

# Working-tree change vs HEAD?
if ! git -C "$DIR" diff --quiet -- "$ABS"; then
  git -C "$DIR" show "HEAD:$REL" > /tmp/sda-before.png 2>/dev/null \
    || { echo "No HEAD version of $REL"; exit 1; }
  echo "Compare: working tree vs HEAD"
else
  LAST="$(git -C "$DIR" log -1 --format=%H -- "$ABS")"
  test -n "$LAST" || { echo "No git history for: $ABS"; exit 1; }
  git -C "$DIR" show "${LAST}^:$REL" > /tmp/sda-before.png 2>/dev/null \
    || { echo "No previous version (file added in $LAST): $REL"; exit 0; }
  echo "Compare: $LAST vs ${LAST}^"
fi
ls -la /tmp/sda-before.png "$ABS"
```

If `git show` fails because the file was renamed, retry with `git log --follow -1 --format=%H -- "$ABS"` and use the resulting commit's parent.

### 2. Run the pixel-level analysis

Substitute `<after-abs-path>` with the value of `$ABS`:

```bash
python3 - <<'PY'
from PIL import Image, ImageChops
AFTER = "<after-abs-path>"
BEFORE = "/tmp/sda-before.png"

a = Image.open(BEFORE).convert('RGB')
b = Image.open(AFTER).convert('RGB')

if a.size != b.size:
    print(f"DIMENSION_MISMATCH before={a.size} after={b.size}")
    raise SystemExit

W, H = a.size
total = W * H
diff = ImageChops.difference(a, b)
extrema = diff.getextrema()
max_delta = max(e[1] for e in extrema)

ad, bd = a.load(), b.load()
diff_count = 0
high_delta = 0
delta_hist = [0] * 256
diff_rows, diff_cols = set(), set()
for y in range(H):
    for x in range(W):
        ar, ag, ab = ad[x, y]
        br, bg, bb = bd[x, y]
        d = max(abs(ar - br), abs(ag - bg), abs(ab - bb))
        if d > 0:
            diff_count += 1
            delta_hist[d] += 1
            diff_rows.add(y); diff_cols.add(x)
            if d > 16:
                high_delta += 1

if diff_rows:
    bbox = (min(diff_cols), min(diff_rows), max(diff_cols) + 1, max(diff_rows) + 1)
    bbox_pct = 100 * ((bbox[2] - bbox[0]) * (bbox[3] - bbox[1])) / total
else:
    bbox = None
    bbox_pct = 0

samples = [
    ('TL', 5, 5),
    ('TR', W - 6, 5),
    ('BL', 5, H - 6),
    ('BR', W - 6, H - 6),
    ('CENTER', W // 2, H // 2),
    ('Q1', W // 4, H // 4),
    ('Q3', 3 * W // 4, 3 * H // 4),
]

print(f"DIM {W}x{H}")
print(f"DIFF_COUNT {diff_count}")
print(f"DIFF_PCT {100 * diff_count / total:.2f}")
print(f"MAX_DELTA {max_delta}")
print(f"PER_CHANNEL_MAX R={extrema[0][1]} G={extrema[1][1]} B={extrema[2][1]}")
print(f"HIGH_DELTA_COUNT {high_delta}")
print(f"BBOX {bbox}")
print(f"BBOX_AREA_PCT {bbox_pct:.2f}")
print("DELTA_HIST_NONZERO " + " ".join(f"{d}:{c}" for d, c in enumerate(delta_hist) if c))
for name, x, y in samples:
    print(f"SAMPLE {name} ({x},{y}) before={ad[x, y]} after={bd[x, y]}")
PY
```

If Pillow is missing, run `python3 -m pip install --user Pillow` and retry.

### 3. Decode the path → component, theme, test scenario

Try to match `<path>` against `packages/<component>/test/visual/<theme>/screenshots/.../<test_name>.png` and extract `component`, `theme` (`base` / `lumo` / `aura`), and `test_name`.

If the match succeeds, read these (skip whichever don't exist):

- `packages/<component>/src/` — grep `transition:|animation:|@keyframes`
- `packages/<component>/test/visual/<theme>/<component>.test.js` — read fully to learn what state the test captures (`opened`, `error`, RTL, dark, etc.)
- Theme CSS, by theme:
  - `lumo` → `packages/vaadin-lumo-styles/components/<component>.css`
  - `aura` → `packages/aura/src/components/<component>.css`
- For overlay-based components also check the parent surface package (`overlay`, `dialog`, `popover`, `select`, `combo-box-overlay`, etc.).

If the path doesn't match the vaadin layout, skip this step and proceed with the pixel data alone.

### 4. Apply the classification heuristics

Walk top-to-bottom; pick the first verdict that matches.

| # | Verdict | Conditions |
|---|---|---|
| 1 | **Legit content change** (geometry) | `DIMENSION_MISMATCH` |
| 2 | **Legit content change** (color/structure) | `MAX_DELTA > 32` OR `HIGH_DELTA_COUNT >= 50` |
| 3 | **Transition / animation flakiness** | `BBOX_AREA_PCT` < ~25% AND the related source has `transition:` / `animation:` / `@keyframes` on an element whose geometry overlaps the bbox AND `MAX_DELTA` ≤ 32 |
| 4 | **Browser-update rasterization noise** | `MAX_DELTA` ≤ 4 AND `DIFF_PCT` > 5 AND solid opaque corner/center samples are byte-identical AND most differing pixels lie in translucent regions (page background, shadows, semi-transparent overlays) |
| 5 | **Sub-pixel rendering / antialiasing** | `MAX_DELTA` ≤ 8 AND `DIFF_PCT` ≤ 5 AND diff bbox is dispersed (matches glyph/curve edges, not a contiguous block) |
| 6 | **Ambiguous** | none of the above — report top two candidates with the data behind each |

Notes:
- "Solid opaque" sample = `before == after` byte-for-byte AND not a near-white/near-black gradient.
- "Translucent region" cue = the differing samples were near-white or near-black with low channel variance.
- If the verdict is *Transition / animation flakiness*, name the file:line and the property (e.g. `transition: opacity 200ms`).

### 5. Emit the report

Use **exactly** this format:

```markdown
## Analysis of `<path>`

**Bottom line:** <one-sentence verdict, naming the class and the single strongest data point that drove it>.

### What the pixels say

| Metric | Value |
|---|---|
| Image size | <W × H> |
| Differing pixels | <N> / <Total> (<%>) |
| Max per-channel delta | <D> (out of 255) |
| Per-channel max | R=<r> G=<g> B=<b> |
| Diff bounding box | <W' × H' at (x,y)> (<bbox %> of canvas) |
| High-delta pixels (>16) | <N> |
| Sample points (TL/TR/BL/BR/CENTER/Q1/Q3) | <table or list of before → after> |

### Why it's [not] each class

- **Sub-pixel rendering**: <evidence>
- **Browser-update rasterization**: <evidence>
- **Transition / animation flakiness**: <evidence — cite the file:line that has `transition:` / `animation:` if found, or note absence>
- **Legit content change**: <evidence>

### Recommendation

<rebaseline as-is / investigate further / inspect specific element X / verify on related screenshots> — one or two sentences, concrete next action.
```

---

## Notes & edge cases

- **Newly added file (no previous version)**: report "first baseline, nothing to compare" and stop.
- **File renamed**: try `git log --follow -1 --format=%H -- <path>` to recover history.
- **Uncommitted change**: the workflow above already detects this via `git diff --quiet` and compares working tree against HEAD.
- **Large screenshots**: the Python pixel walk is O(W·H) without numpy; expect a few seconds for full-viewport (1024×768+) baselines.
- **Theme-specific path layouts**: aura puts dark/default screenshots under `packages/<c>/test/visual/aura/screenshots/{default,dark}/<c>/baseline/...` — accept either layout when decoding.
- **Multiple "after" interpretations**: this skill always compares current-on-disk vs the immediately-previous git version. It does not support arbitrary commit ranges; if the user wants that, they can call git themselves.
