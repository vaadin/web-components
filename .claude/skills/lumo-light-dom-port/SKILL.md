---
name: lumo-light-dom-port
description: Port a Vaadin component's original shadow-DOM Lumo CSS to the new light-DOM @vaadin/lumo package on the proto/lumo-light-dom branch.
triggers:
  - "port * to light DOM Lumo"
  - "port * styles to light DOM Lumo"
  - "port * to @vaadin/lumo"
  - "lumo light dom port"
---

# Lumo light-DOM port

Use this skill when working on the `proto/lumo-light-dom` branch and asked to port one Vaadin component (e.g. `packages/button/`) from its original shadow-DOM Lumo CSS (`packages/vaadin-lumo-styles/src/components/<name>.css`) to a new light-DOM CSS file at `packages/lumo/src/components/<name>.css`.

Skip this skill on `main` or any non-proto branch.

## Workflow

### 1. Explore (parallel reads)
- `packages/<name>/src/styles/vaadin-<name>-base-styles.js` — base CSS the new architecture already provides.
- `packages/<name>/src/vaadin-<name>.js` — JSDoc table of documented `--vaadin-<name>-*` properties + `exportparts="..."` line if it has an overlay.
- `packages/aura/src/components/<name>.css` — aura's port (reference for selector pattern, not values).
- `packages/vaadin-lumo-styles/src/components/<name>.css` — the original Lumo CSS to port.

### 2. Classify each rule in the original Lumo file
- **Cascades for free** (skip): e.g. `--vaadin-radius-m` already remaps to `--lumo-border-radius-m` in `packages/lumo/src/sizing.css`; `--vaadin-text-color-secondary` already maps to `--lumo-secondary-text-color` in `color.css`; `--vaadin-clickable-cursor` etc.
- **Documented var override**: set `--vaadin-<name>-X` at `:where(:root), :where(:host)`.
- **No documented var, needs Lumo styling**: target with `::part()` (host with exportparts forwarding) or `:where(vaadin-X)` for host-level rules.
- **Already in base** (drop): SVG icon masks (replaces lumo-icons font glyphs), focus-visible outline, RTL via logical properties, `display: contents` flatten on prefix/suffix/inner-container, forced-colors handling, host positioning for overlays.

### 3. Author `packages/lumo/src/components/<name>.css`

**Selector conventions (HARD rules):**

1. Wrap host/tag selectors in `:where(...)` for zero specificity. Users override with plain `vaadin-X { ... }` (specificity 0,0,1) cleanly.
2. Attribute / theme variants: `:where(vaadin-X)[theme~='small']` (specificity 0,1,0).
3. Parts: `:where(vaadin-X)::part(name)` (0,0,1). Uses exportparts forwarding from the host's render template.
4. Combine attribute branches with `:is()`: `:where(vaadin-X):is([disabled], [theme~='tertiary-inline'])::part(thing)`. Note: `::before`/`::after` can't go inside `:is()` — keep them as separate comma-separated selectors.
5. **Never use `vaadin-*-overlay` selectors** in light-DOM CSS. The one exception is `vaadin-login-overlay-wrapper`. Target the host (`vaadin-dialog`, `vaadin-popover`, `vaadin-context-menu`, …) and reach inner parts via `::part(...)` — works because the overlay element carries `exportparts="..."`.
6. **Length zero always carries a unit**: `--vaadin-X-border-width: 0px`. Never bare `0`. Unitless 0 breaks consumer `calc(100% - var(--b))` math in the shadow tree — see `feedback_css_zero_units`. The popover arrow's clip-path silently degraded to an unclipped diamond until this fix.
7. **No `:host`, no `::slotted` in light DOM**. For slotted children (e.g. icons inside a button or avatar inside a menu item), use the direct child combinator: `:where(vaadin-X) > vaadin-icon { ... }`. Slotted children are in the host's light DOM.
8. **`::part()::after` / `::part()::before` are valid** (CSS Shadow Parts spec allows `::before`/`::after` after `::part()`). Use to style a part's pseudo-element from light DOM: `:where(vaadin-breadcrumbs)::part(overflow)::after { --vaadin-icon-visual-size: 75% }`. As an outer-context rule it beats the component's own shadow `[part='X']::after` rule via encapsulation precedence — even when the shadow rule sets the property via `::slotted(child)::after`. Note: a component's own shadow parts (e.g. breadcrumbs' `overflow`/`overflow-button`) are directly targetable via `vaadin-X::part(name)` — `exportparts` only matters for parts of *nested* shadow elements (e.g. a forwarded overlay's `overlay`/`content`).
9. **Cross-part state styling via an inherited custom property.** You CANNOT descend from one part into another: `::part(a):hover ::part(b)` is invalid — `::part()` can't be followed by a combinator into another part of the same shadow tree. So a shadow rule like `[part='splitter']:hover [part='handle'] { … }` (style child part B when parent part A is in a state) has no direct light-DOM equivalent. Work around it by putting the state on part A and letting a custom property **inherit** into part B (B is a shadow descendant of A):
   - Property B already reads as a var (e.g. handle background `var(--vaadin-split-layout-handle-background, …)`): just set that var on A's state — `:where(vaadin-split-layout)::part(splitter):hover { --vaadin-split-layout-handle-background: var(--lumo-contrast-40pct); }`. The handle inherits the nearer (splitter) value.
   - Property B is NOT var-driven by base (e.g. `opacity`): define your OWN private var, have B read it in a light-DOM rule, and flip it on A's state — `::part(handle) { opacity: var(--_lumo-split-handle-opacity, 0) }` + `::part(splitter):is(:hover, :active) { --_lumo-split-handle-opacity: 1 }`. Works for any non-inherited property (opacity/transform/etc.) because the var is what inherits, and your own `::part(B)` rule consumes it.
   - Note `inherited` properties that you might reach for instead don't help here: setting `opacity`/`visibility` directly on part A affects A's own rendering (A would fade/hide too), and `opacity` isn't inherited anyway. The private-var indirection is the clean path. This is distinct from pitfall #6 (host state-attribute reflection) — use that when the state lives on the host; use this when the state is a CSS pseudo-class (`:hover`/`:active`) on an inner part.
10. **Never use direction-dependent physical properties — RTL breaks silently.** A `padding`/`margin` shorthand with asymmetric left/right values (`padding: a b c 0`), or `left`/`right`/`padding-left`/`margin-right`/`text-align: left`, does NOT mirror under `dir="rtl"` and produces a wrong gap/offset. The original Lumo mixin paired every such rule with a `:host([dir='rtl'])` override; the new base uses logical properties instead — follow the base. Use `padding-block`/`padding-inline` (and `padding-inline: <start> <end>`), `margin-inline-start/end`, `inset-inline-start/end`, `text-align: start`, etc. Example: `padding: var(--lumo-space-xs) var(--lumo-space-s) var(--lumo-space-xs) 0` (leading 0, trailing `s`) → `padding-block: var(--lumo-space-xs); padding-inline: 0 var(--lumo-space-s)`. The checkbox/radio label gap doubled in RTL until this fix. Do NOT port the original's `:host([dir='rtl'])` rules — replace the whole physical/RTL pair with one logical rule.

**Cascade precedence (the spec quirk that simplifies overrides):**

Light-DOM `::part()` rules win over inner-shadow `:host([attr]) [part='X']` rules regardless of specificity, because the document is the outermost encapsulation context (CSS Cascade L5 §6.5). Examples:
- `:where(vaadin-dialog[has-footer])::part(content) { padding-bottom: ... }` at (0,0,1) beats base's `:host([has-footer]) [part='content']` at (0,2,0).
- Don't reach for `:is(*, #id)` or doubled attribute selectors to win specificity fights against inner shadow rules — they're unnecessary.

**State attributes:**

- `OverlayMixin`'s `setOverlayStateAttribute` (`packages/overlay/src/vaadin-overlay-utils.js`) reflects state attributes to both the overlay element AND its `owner` (the host). So `vaadin-dialog[opened]`, `vaadin-dialog[has-footer]`, `vaadin-popover[top-aligned]` etc. work.
- **Exception**: `vaadin-confirm-dialog-overlay.js` sets `has-footer` via plain `this.setAttribute('has-footer', '')` (not the helper), so the attribute is NOT mirrored to the host. Confirm-dialog always has a footer anyway, so use an unconditional `:where(vaadin-confirm-dialog)::part(content) { padding-bottom: ... }`.

**Cascade chain awareness:**

Verify in the base style which fallback chain each var has — they're NOT uniform:
- `--vaadin-popover-background` → `--vaadin-overlay-background` → `--vaadin-background-color` (3-level chain — setting overlay-level var reaches popover ✓).
- `--vaadin-tooltip-background` → `--vaadin-background-color` (no overlay middle layer — tooltip needs explicit override).
- `--vaadin-tooltip-shadow` → soft default (does NOT chain through `--vaadin-overlay-shadow`).
- `--vaadin-dialog-border-radius` → `--vaadin-radius-l` (direct — relies on the `sizing.css` remap to Lumo).

If you set `--vaadin-overlay-X` in `overlay.css` and need it to apply to a component whose var doesn't chain through it, set `--vaadin-<component>-X` explicitly too (duplicate the value or alias: `--vaadin-tooltip-shadow: var(--vaadin-overlay-shadow);` doesn't reliably propagate, so just duplicate the literal value).

### 4. Update `packages/lumo/lumo.css`
Add `@import './src/components/<name>.css';` in alphabetical order in the components block.

### 5. Family components — widen, don't duplicate
When porting a component that shares structure with one already ported (e.g. `confirm-dialog` shares dialog rules, `context-menu-item` and `avatar-group-menu-item` share item rules):

- Widen existing selector lists: `:where(vaadin-item, vaadin-context-menu-item, vaadin-avatar-group-menu-item)`.
- Keep the new file tiny — only the rules genuinely unique to the new component.
- If the new component reduces to zero unique rules, skip the file and only widen.

### 6. Verify
```bash
yarn lint:css                                           # must pass
wc -l packages/lumo/src/components/<name>.css           # expect 30–80% reduction vs original
git grep -nE "lumo_components_<name>" packages/lumo/    # should be empty (no shadow-DOM injection markers)
```

**Validate RTL.** Any port with an asymmetric offset (label gap, prefix/suffix spacing, indicator position, alignment) must be checked in both directions. In the dev page (`?theme=wip`) set `document.documentElement.setAttribute('dir','rtl')` and confirm the measurement matches LTR — e.g. the box→label gap is identical. If it differs, a physical property leaked in (see HARD rule #10); replace it with the logical equivalent rather than adding a `[dir='rtl']` rule. Also grep the new file: `grep -nE "padding-left|padding-right|margin-left|margin-right|[^-]left:|[^-]right:|text-align: *(left|right)" packages/lumo/src/components/<name>.css` should be empty (a bare `padding`/`margin` shorthand with a `0` or differing left/right value is the same smell).

### 7. Commit (single, no push)
```bash
git add packages/lumo/lumo.css packages/lumo/src/components/<name>.css
git commit -m "proto: port <name> styles to light DOM Lumo"
```
Do NOT push. Per `feedback_proto_branches`: commit-and-push-only model, no PRs on `proto/*` branches. User handles pushing between turns; sometimes amends or reshapes commits without warning.

## Drops that consistently apply

These come up in nearly every port — drop them confidently:

| Original Lumo rule | Where it lives now |
|---|---|
| `lumo-icons` font + `var(--lumo-icons-X)` content | Base SVG mask via `--_vaadin-icon-X` |
| `:host([focus-ring]) { box-shadow: inset ... }` | Base outline-based focus ring via `--vaadin-focus-ring-color` (Lumo-tinted via `color.css`) |
| `[part='header'] { border-radius: var(--lumo-border-radius-l) ... }` Safari workaround | Base inherits border-radius onto header/footer parts |
| `font-family: var(--lumo-font-family)` on host | Body sets this in `typography.css`; component inherits |
| `-webkit-font-smoothing`, `-webkit-tap-highlight-color`, `font-smoothing` | Browser/base defaults |
| `:host([dir='rtl']) [part='X'] { margin-left/right: ... }` | Base uses logical properties (`margin-inline-start/end`) |
| Forced-colors `outline: 3px solid` | Base has equivalent forced-colors handling |
| `--_lumo-<name>-internal-var` cascade systems | Replaced by documented `--vaadin-X-*` vars or no longer needed under `display: contents` flatten |

## Pitfalls (debugged this session)

1. **Unitless 0 in a length var → calc breaks downstream.** `--vaadin-overlay-border-width: 0` propagated into `--_border-width` in popover, then into `calc(var(--b) * 1.4)` in the arrow clip-path. CSS `calc` rejects mixing unitless number with percentage/length → the entire clip-path declaration is dropped → arrow renders unclipped. Fix: `0px`. See `feedback_css_zero_units`.

2. **Menu overlay backdrop bypasses the overlay backdrop var.** `menuOverlayStyles` (base for context-menu) sets `[part='backdrop'] { background: transparent }` directly, ignoring `--vaadin-overlay-backdrop-background`. For Lumo's shaded backdrop on context-menu, re-route: `:where(vaadin-context-menu)::part(backdrop) { background: var(--vaadin-overlay-backdrop-background); }`.

3. **Confirm-dialog min/max width math includes content padding.** `--vaadin-confirm-dialog-min-width` is the OVERLAY's min-width, not the content area. Original Lumo's effective 448px = 25em (message intrinsic width) + 3em (`--lumo-space-l` × 2 padding). Set both `--vaadin-confirm-dialog-{min,max}-width: 28em` for parity.

4. **`display: contents` makes prefix/suffix margins inert.** Original Lumo's `[part='prefix'] { margin-left: -0.25em }` is dead in the new base — prefix/suffix have `display: contents`. Use `--vaadin-X-gap` for spacing instead; the base flex container's `gap` handles it.

5. **`::part()` outer-tree precedence has a corollary**: arrow-style `background: inherit` rules in base can fail silently if the parent's gradient-shorthand background doesn't propagate cleanly. The fix used in popover was: don't fight inherit; the actual bug was unrelated (the `0px` issue). But if `background: inherit` is suspect, set `:where(vaadin-X)::part(arrow) { background: var(--vaadin-X-background, var(--vaadin-overlay-background)); }` to bypass inheritance entirely.

6. **Light-DOM rules that need length-based-state-attr matching**: state attrs on the overlay reflect to the host via `setOverlayStateAttribute` (overlay-utils.js). When porting any state-dependent rule (`[opened]`, `[has-footer]`, `[overflow~='top']`, `[top-aligned]`, etc.), prefer the host selector; verify the attribute is reflected by grepping the relevant mixin for `setOverlayStateAttribute` vs raw `setAttribute`.

7. **Overlays CSS-reset font properties, so re-apply them on `::part(overlay)`, not the host.** The base `overlayStyles` (`packages/overlay/src/styles/vaadin-overlay-base-styles.js`) sets `font: initial` (plus `letter-spacing`/`text-align`/`white-space`/etc. `initial`) on `[part='overlay']`, then only restores `font-family: inherit`. So `font-size` and `line-height` inside an overlay fall back to the UA default (medium / normal), NOT the inherited Lumo body values from `typography.css` — setting `--vaadin-X-font-size` on the host does nothing for overlay content. Re-apply the Lumo font on the overlay part: `:where(vaadin-popover, vaadin-breadcrumbs, vaadin-dialog, …)::part(overlay) { font-family: var(--lumo-font-family); line-height: var(--lumo-line-height-m); }`. Group these shared overlay-font rules in `overlay.css` (widen the selector list as each overlay component is ported) rather than duplicating per component file. Corollary: for a NON-overlay component, font-size/line-height defaults that merely equal the `typography.css` body values are redundant — drop them (they inherit). The reset only bites *inside* the overlay part.

## Out of scope (defer / skip)

- **Animations** (enter/exit fade, scale ripple, backdrop fade) — usually skipped unless user asks. Note as deferred.
- **`:host([phone])` mobile bottom-sheet positioning** — needs new positioning API tracked in vaadin/web-components#11874.
- **`[part='label']` micro-typography** (font-smoothing, line-height in non-Lumo-token units) — accept base.
- **Slotted-tertiary-button padding inside dialog footer** — narrow edge case; add later if visual diff shows.

## Memory references

- `[[feedback-light-dom-lumo-selectors]]` — never `vaadin-*-overlay`; encapsulation precedence; state-attribute reflection.
- `[[feedback-css-zero-units]]` — `0px` not `0` for length-valued custom properties.
- `[[feedback-proto-branches]]` — commit-and-push-only on `proto/*` branches, no PRs.

## Verification evidence (23 components)

Line reductions vs original Lumo:
- avatar: 87 → 37 (~57%)
- badge: 83 → 56 (~33%)
- button: 337 → 176 (~48%; includes ::after blur, icon-only theme, slotted icons)
- dialog: 135 → 18 (~87%)
- confirm-dialog: 55 → 25 (~55%)
- item: 94 → 23 (~76%)
- list-box: 31 → 3 (~91%)
- popover: 20 → 8 (~60%)
- tooltip: 25 → 12 (~52%)
- context-menu (3 source files): combined → 1 [expanded] rule + 1 mobile media query + 1 backdrop fix
- accordion-details: ~180 → 80 (~56%)
- avatar-group (3 source files): combined → 4 theme variant rules + 1 menu-item rule + selector widening
- app-layout: 203 → 53 (~74%)
- drawer-toggle: 49 → ~12 (element-scoped var resets that beat button.css globals; shares button hover/active via selector widening)
- card: 27 + token wrapper → 32 (theme variants + token defaults)
- breadcrumbs (3 source files): ~91 → 56 (~38%; first use of `::part()::after` for the separator chevron size)
- split-layout: 53 → 42 (~21%; cross-part state via inherited custom property for handle hover/active color and minimal-theme handle opacity)
- master-detail-layout: token-wrapper only → 6 (one var; the other 3 wrapper vars equal base defaults or are dead)
- tabs (2 source files): ~530 → 204 (~62%; paradigm fork — restored classic Lumo underline marker over the base's pill control)
- scroller: zero-override (original was only a box-shadow focus ring; base outline focus ring covers it)
- virtual-list: zero-override (no original Lumo file ever existed; base + token mappings cover it)

Total: ~65% average line reduction with full visual parity (modulo intentional drops: animations, dead `[phone]` rule, decorative `::after` blur where excluded).

## Zero-override components (skip the file entirely)

Some components need NO Lumo CSS — the base styles plus the global token mappings (`color.css`, `sizing.css`) already produce the Lumo look. Two signals, either one is enough:

1. **No original Lumo file exists** — no `packages/vaadin-lumo-styles/src/components/<name>.css`, no `components/<name>.css` wrapper, no aura file. There was never any theme-specific styling (e.g. `virtual-list` — a pure scroll container; its only theme-sensitive value, `--vaadin-virtual-list-overflow-indicator-color`, defaults to `--vaadin-border-color-secondary` = `--lumo-contrast-10pct`).
2. **The original Lumo file contains only "confident drops"** — every rule is something the base already covers (focus ring, icon masks, font-family, etc.). E.g. `scroller`: the entire original was a box-shadow focus ring, which the base replaces with an outline focus ring already Lumo-tinted via `--vaadin-focus-ring-color`. Net unique rules: zero.

In both cases: **create no file, add no `lumo.css` import, make no commit.** Report the analysis and stop. Don't fabricate a file for symmetry. Distinguish from a paradigm fork (below): zero-override means base already matches Lumo; a fork means base actively diverges and must be fought.

## Default & variant differences (preserve Lumo's defaults)

Between zero-override and a full paradigm fork sits a common middle case: the base (or Aura) ships the **same mechanism** but a **different default value or default variant** than original Lumo. **Always restore Lumo's default** — the knob exists, just set it. Do NOT silently inherit Aura's or the base's default when original Lumo differed; Aura's defaults are Aura's design choices, not Lumo's.

This usually does NOT need a user question (it's a value, not a missing mechanism) — just restore it and note it. The exception is when the flip produces a clearly different default *appearance* a plain element shows (e.g. tabsheet gaining/losing its whole outer border); there, briefly confirm with the user (bias to restore-Lumo), as done for tabsheet.

Known differences to preserve when porting:
- **tabsheet border** — base is bordered-by-default (`theme='no-border'` opts out); Lumo is borderless-by-default (`theme='bordered'` opts in). Restore borderless: `:where(vaadin-tabsheet) { border: 0; border-radius: 0 }` + re-add on `[theme~='bordered']`.
- **checkbox-group / radio-group orientation** — Aura defaults to **vertical**, Lumo defaults to **horizontal**. When porting these, set Lumo's horizontal default (don't carry over Aura's vertical). Verify the exact knob in the base style (a `--vaadin-…-orientation`-style var or a `flex-direction` default on the group host) and set it to the horizontal value at `:where(vaadin-checkbox-group, vaadin-radio-group)`.

When in doubt, diff the base/Aura default against the original Lumo file value and restore the Lumo one.

## Paradigm forks (base redesigned the component)

Sometimes the new base styles implement a *different visual paradigm* than original Lumo — not just different values, but a different mechanism, with no base hook for the old look. `tabs` is the worst case: the base made tabs a boxed/pill segmented control (selected tab = filled `--vaadin-background-container` pill, no marker), while original Lumo is flat underline tabs (animated `::before`/`::after` marker, container border-line). Aura adopted the new base paradigm; that is NOT automatically the right call for Lumo.

**Default: prefer original Lumo for both visuals AND CSS selector specificity.** Restore the original Lumo look even when it means more CSS that fights the base — reintroduce the missing mechanism (e.g. the underline marker via `:where(vaadin-tab)::before/::after`) and neutralize the base's competing rule (e.g. `:where(vaadin-tab)[selected] { --vaadin-tab-background: transparent }` beats base `:host([selected])` via encapsulation precedence). Match original Lumo's selector specificity rather than inventing a leaner structure — fidelity over minimalism when the two conflict. Don't silently adopt the base/Aura paradigm to save lines. When a port hits a paradigm fork, surface it to the user with the two options (adopt-base vs restore-Lumo) before writing CSS, but bias the recommendation toward restore-Lumo.

## Open questions

- Some highly-interactive components (combo-box, date-picker, grid) likely need more than var overrides + part rules — they have shadow-internal layout that doesn't map cleanly to the new architecture. This skill covers components whose Lumo layer is mostly tokens + part styling. For deeper ports, capture findings during the work and update this skill.
