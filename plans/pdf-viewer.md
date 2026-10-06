# `vaadin-pdf-viewer` — implementation plan and tracker

Single source of truth for agents building the PDF viewer component. Read this
file in full before starting a slice, and update the **Tracker** and
**Progress log** when you finish one.

Before writing code also read, in full: `CONVENTIONS.md`, and from `guidelines/`:
`design.md`, `package-structure.md`, `component-implementation.md`,
`common-packages.md`, `dom.md`, `events.md`, `theming.md`, `a11y.md`,
`testing.md`, `documenting.md`, `typescript.md`. This plan only records what is
specific to the PDF viewer. It does not repeat those documents.

> This file is a working document for the `pdf-viewer` branch. Remove it (or
> move what is still useful into the package README) before the branch is merged.

---

## Tracker

Status values: `todo`, `in progress`, `in review`, `done`, `blocked`.

| #   | Slice                                    | Status    | Reviews (code / visual) | Notes                  |
| --- | ---------------------------------------- | --------- | ----------------------- | ---------------------- |
| 0   | Tracer bullet: package + first page      | done      | ✅ / ✅                 | 561906b4d0, 59ff4a2850 |
| 1   | Continuous scroll, zoom, page tracking   | done      | ✅ / ✅ (+ re-review)   | 1e173c331e, b2d2a73c16 |
| 2   | Toolbar: page navigation + zoom controls | done      | – / –                   |                        |
| 3   | Text layer, links, keyboard, a11y basics | todo      | – / –                   |                        |
| 4   | Find                                     | in review | – / –                   |                        |
| 5   | Sidebar: thumbnails                      | todo      | – / –                   |                        |
| 6   | Sidebar: outline                         | todo      | – / –                   |                        |
| 7   | Download and print                       | todo      | – / –                   |                        |
| 8   | Tagged PDFs, AT audit, forced colors     | todo      | – / –                   |                        |
| 9   | API docs, typings, README, release prep  | todo      | – / –                   |                        |

---

## 1. Goal and scope

A PDF viewer web component that looks and behaves like the rest of Vaadin's components
(base styles, Lumo, Aura), meets WCAG 2.1 AA, and can be used from Flow.

**In scope for v1**

- Render a PDF from a URL in one continuous, vertically scrolling list of pages.
- Page navigation, zoom (fit page, fit width, fixed percentages).
- Text selection (text layer) and in-document links.
- Find in document with match highlighting.
- Sidebar with page thumbnails and the document outline (bookmarks).
- Download the original file, print the document.
- A built-in toolbar made of Vaadin components.
- Accessible reading of the document text, including tagged-PDF structure.

**Out of scope for v1** (do not build, do not add hooks "just in case")

- Single-page / spread / horizontal layout modes.
- Password-protected PDFs (fire `error` with a clear reason instead).
- Form filling, annotation editing, XFA forms, PDF JavaScript.
- Binary input (`ArrayBuffer`/`Blob`). `src` takes a URL only.
- Rotation, presentation mode.

---

## 2. Decisions

Each decision has an ID. Refer to it in commits, reviews and the progress log.
To change a decision, ask the user, then update the entry and add a dated note.

**D1 — Package, tag, license.** Package `@vaadin/pdf-viewer` at `packages/pdf-viewer/`,
element `<vaadin-pdf-viewer>`, class `PdfViewer`. Vaadin Commercial License, like
`map` and `charts`: copy the license header, `LICENSE` file, and `package.json` fields
from `packages/map/`. Copy the `cvdlName` pattern from `vaadin-map.js`.

**D2 — Experimental.** `static get experimental() { return true; }`, giving the flag
`window.Vaadin.featureFlags.pdfViewerComponent`. Dev pages and tests enable it.

**D3 — Rendering engine: pdf.js low-level API.** Use `pdfjs-dist` (Apache-2.0). Use
`getDocument`, `page.render`, `TextLayer`, `AnnotationLayer` (links only), and
`page.getStructTree()`. **Do not use `PDFViewer` / `pdf_viewer.mjs` / `pdf_viewer.css`.**
They need an absolutely positioned container, put their CSS on `:root`, and call
`document.getElementById` / `document.querySelector`, which all break in shadow DOM.
Small parts of `pdf_viewer.mjs` (e.g. find normalization, struct-tree role mapping)
may be ported into our source with attribution, as long as the code they contain
uses no `document`-level lookups.

**D4 — Pin an exact pdf.js version, ≥ 6.2.108.** Pin exactly, like `ol` and `highcharts`.
6.2.108 fixes GHSA-hq66-cqwq-w95j (code execution via PDF scripting). At the time
of writing the latest version is 6.4.299. **Pinned: `pdfjs-dist@6.3.289`** (slice 0,
2026-10-06). 6.4.299 was only three days old, and the user's npm config has a release-age
cooldown (`before=`) that refuses it. Respect that cooldown when upgrading: only move to a
version that `npm install` accepts with the user's config.

**D5 — Use the legacy build (`pdfjs-dist/legacy/build/*`).** Vaadin 25 supports
Safari / iOS Safari 17+ and evergreen Chrome / Firefox / Edge (`README.md`). The
modern build calls these without guards or polyfills (checked in 6.4.299 against MDN
browser-compat-data 8.1.4):

| API used by modern build  | Chrome | Firefox | Safari / iOS |
| ------------------------- | ------ | ------- | ------------ |
| `Map#getOrInsertComputed` | 145    | 144     | 26.2         |
| `Math.sumPrecise`         | 147    | 137     | 26.2         |
| `Uint8Array.fromBase64`   | 140    | 133     | 18.2         |
| `Promise.try`             | 128    | 134     | 18.2         |

`getOrInsertComputed` is on hot paths (message handler, font loading), so the modern
build fails outright on any Safari before 26.2. The legacy build adds core-js polyfills
for about +19 KB gzipped (main 128→147 KB, worker 366→383 KB). pdf.js documents the
legacy build as "Safari 18+ (mostly)". **The component's minimum is Safari / iOS Safari 18**
(decided by the user on 2026-10-06), one version above Vaadin 25's general Safari 17
minimum. Document this in the README (slice 9). Don't add polyfills for Safari 17.

**D6 — Worker loading.** pdf.js needs a module worker. Plan:

- Ship `src/pdf-viewer-worker.js` in our package, which only imports
  `pdfjs-dist/legacy/build/pdf.worker.mjs`.
- Create it with `new Worker(new URL('./pdf-viewer-worker.js', import.meta.url), { type: 'module' })`
  and pass it per document via `getDocument({ worker: new PDFWorker({ port }) })`.
  Do **not** set `GlobalWorkerOptions`, which is global state shared with any other pdf.js user on the page.
- Bare-specifier `new URL('pdfjs-dist/...', import.meta.url)` does **not** work inside a dependency
  under Vite (vitejs/vite#10837). That's why we use a relative file of our own.
- **Verified in slice 0** with Vite 8.3.2, installing the packed tarballs into a throwaway app
  (so the package sits in `node_modules` and is pre-bundled, as in a Flow app): dev server and
  production build (`vite build` + `vite preview`) both load the worker with **no Vite config**.
  Vite rewrites the pattern to `pdf-viewer-worker.js?worker_file&type=module` in dev, and emits
  `assets/pdf-viewer-worker-<hash>.js` in production. `@web/dev-server` (`yarn start`) works as well.
- The worker is shared by all viewers on the page (`pdfjs-loader.js`), counted per document,
  and terminated when the last document is destroyed.
- pdf.js does not notice when a worker passed as a port fails to load. The loader listens to the
  worker's `error` event and fails the load, so the viewer fires `document-error` instead of
  waiting forever.
- No `workerSrc` escape hatch for now (not needed by Vite or `@web/dev-server`). Add one only if
  a real bundler or CSP needs it.

**D7 — Lazy loading.** Importing `@vaadin/pdf-viewer` must not load pdf.js. Load it with
dynamic `import()` the first time `src` is set on a connected element, and cache the
module promise at module level.

**D8 — Static assets (`cmaps/`, `standard_fonts/`, `wasm/`).** The worker needs these for
CJK text, PDFs without embedded standard fonts, and fast JPEG2000/JBIG2 decoding. Without
them pdf.js still renders most business PDFs, but with warnings and slower or degraded
output in those cases. **Outcome of slice 0: don't ship them.** Together they are about
4 MB, and a bundler can't pick up a folder through `import.meta.url`. A PDF with a
non-embedded Helvetica (`test/fixtures/standard-font.pdf`, typical of report generators)
renders correctly with the browser's font fallback and no warnings. Revisit if real
documents with CJK text or JPEG2000/JBIG2 images need it. The fix then is a static
config property for the asset base URLs.

**D9 — Security settings.**

- Never load `pdf.sandbox.mjs`, and keep `enableScripting` off.
- Keep `enableXfa: false`.
- `AnnotationLayer` renders links only. No form or editor layers.
- External links: `target="_blank"` and `rel="noopener noreferrer"`. Only allow
  `http:`, `https:` and `mailto:` URLs, and ignore anything else.
- **As built in slice 3:** links don't use pdf.js `AnnotationLayer` (it needs a full link service
  and does `document`-level lookups). The viewer reads `page.getAnnotations()` and creates its
  own `<a>` elements for link annotations, positioned in % of the page. pdf.js already drops
  `javascript:` URLs but passes `ftp:` and `tel:`, which the allowlist removes
  (`test/fixtures/unsafe-links.pdf`). Internal links (`dest`, and the named actions
  First/Last/Next/PrevPage) use `href="#"` with a click handler, so the page URL never changes.
  A link's accessible name is the text of the text layer inside it, with the URL or the
  `link` i18n string as fallback.
- `isEvalSupported` no longer exists in 6.x, so don't set it.

**D10 — Layout: continuous vertical scroll only.** All pages are stacked in one scroller.
Page placeholders get their size from each page's viewport, so the scroll height is
right before anything renders. Only pages inside the viewport plus a buffer (±1 page)
get a canvas, text layer and link layer. Pages that move far away release their
canvas. Re-render on zoom change, on `devicePixelRatio` change, and on resize when zoom
is `page-width` / `page-fit` (use `ResizeMixin` from component-base). Cap the
canvas size (pdf.js `maxCanvasPixels`, about 16M pixels) so iOS doesn't run out of memory.

As built in slice 1 (`src/vaadin-pdf-viewer-mixin.js`, `src/pdf-viewer-page.js`):

- **Progressive sizing:** after load, every placeholder gets the size of page 1, and the real
  sizes arrive in the background (`getPage()` per page). Changed sizes are applied once per
  frame while keeping the current page anchored. This shows long documents right away.
- Rendering is one page at a time: the visible pages by visibility, then one page ahead on each
  side. Canvases are kept for ±1 page around the view, and pages outside the view are released
  further when all canvases together exceed 3 × 16M pixels.
- A viewer without a size (hidden tab, `display: none`) does nothing. It remembers its scroll
  position and a `page` set meanwhile, and applies them when it gets a size again.
- A `page` set by the app (also out of range) stays as set until the user scrolls, so pages that
  can't scroll to the top of the view (the last ones) and relayouts don't overwrite it.
- Zoom keeps the point of the current page that is in the middle of the view. Horizontally it
  works with element rectangles, so RTL (negative `scrollLeft`) works the same, and a page that
  fits the width is centered.
- The internal `render-idle` event only fires after actions (load, zoom, resize, page change,
  device pixel ratio change) or renders, and only once all page sizes are known.

**D11 — Toolbar built from Vaadin components.** Use `vaadin-button` (icon buttons),
`vaadin-integer-field` (page number), `vaadin-select` (zoom), and `vaadin-text-field`
(find). **They must be rendered in the viewer's light DOM and slotted** (like the buttons of
`vaadin-menu-bar`, see `guidelines/dom.md`, "Internal elements in light DOM"). Aura styles
components with global CSS that targets their tag names, which does not reach into a shadow
root. Never apply hard-coded ids to them (`CONVENTIONS.md`). Add them as package dependencies,
as `crud` does with its dependencies. Pass the host `theme` on to the inner components
where that makes sense (`ifDefined(this._theme)`). Icons: use the shared
`--_vaadin-icon-*` masks where they exist (plus, minus, chevron-down/right, file,
fullscreen). Any icon that's missing (print, download, search, sidebar, chevron-up)
is added to component-base's icon set the same way as the existing ones.
Don't use an icon font or SVG files.

As built in slice 2:

- Icon buttons are an internal `vaadin-pdf-viewer-button` (`ButtonMixin`, like `vaadin-drawer-toggle`),
  rendered with `theme="tertiary icon"`. The `icon` attribute selects the icon. Base styles use
  `mask` with `--vaadin-pdf-viewer-icon-<name>` falling back to `--_vaadin-icon-*` (a
  `--_vaadin-icon-chevron-up` was added to component-base). Lumo replaces the base styles of the
  button, so its own `pdf-viewer-button` module shows `lumo-icons` font glyphs, like `vaadin-map`.
  Aura lists the button next to `vaadin-drawer-toggle` in `aura/src/components/button.css`.
- The controls are rendered with Lit `render()` into the host's light DOM, assigned to named
  slots (`toolbar-navigation`, `toolbar-zoom`, later more), each slot inside a `toolbar-group` part.
- The toolbar has `role="toolbar"` but keeps plain Tab navigation (no roving tabindex), because
  it contains a text field and a select that use the arrow keys themselves.
- One shared `vaadin-tooltip` (with `ariaLinkMode = 'none'`) shows the button labels on hover
  and keyboard focus, like the Rich Text Editor toolbar.
- The toolbar wraps onto more rows when narrow (`flex-wrap`). Whether it fits one row at 375 px
  depends on the theme and fonts; wrapping is clean in all themes.
- When a focused button becomes disabled (e.g. "next page" on the last page) while the keyboard
  is used, focus moves to the field or select of its group. Pointer users keep their focus, so
  touch devices don't open the on-screen keyboard (slice 2 review).
- The tooltip uses its own slot `toolbar-tooltip`, so that a `vaadin-tooltip slot="tooltip"`
  of the application (e.g. Flow's `Tooltip.forComponent`) is not taken over.
- The `change` events of the page field and the zoom select are stopped at the viewer. Apps
  listen to `page-changed` / `zoom-changed`. Enter in the page field does not submit a form.
- The page field's accessible name includes the page count ("Page of 6", i18n `pageOf`), since
  the visible "/ 6" suffix is hidden from assistive technology.
- Percentages are formatted with `Intl.NumberFormat` in the language of the page.
- The host `theme` is **not** forwarded to the toolbar controls in v1, as the viewer defines no
  theme variants (decided in slice 2 review). Revisit if a compact variant is needed.
- `--vaadin-pdf-viewer-icon-*` take a mask image in base and Aura, but a `lumo-icons` glyph in
  Lumo, like `vaadin-map`. This is documented in the class JSDoc.
- Prev / next use up / down chevrons, so they don't need mirroring in RTL.
- `zoom` is `notify: true`, because the toolbar changes it. Zoom in / out step through
  25 % – 400 % (`ZOOM_LEVELS`). A zoom set by the app that is not a level is added to the select.
- Announcements: "Page {page} of {pageCount}" after page changes from the toolbar, and the zoom
  percentage after zoom button clicks.

**D12 — `src` is a URL only.** Flow serves the file through a `DownloadHandler` /
resource URL. `withCredentials` and range requests are left at pdf.js defaults
(range requests need `Accept-Ranges: bytes` from the server).

**D13 — Default zoom is `page-width`.** It works best on narrow screens and matches
how most business documents are read. `page-width` and `page-fit` fit the **first page**
(decided in slice 1 review), so the scale does not change with the current page. Wider pages
(e.g. a landscape page in a portrait document) then scroll horizontally.

**D14 — Download.** An `<a href=src download=fileName>`. `fileName` defaults to the last
path segment of `src`, or the document title if there is none.

**D15 — Print.** `print()` renders every page at about 150 DPI into a hidden `<iframe>`
created for printing, calls `iframe.contentWindow.print()`, and removes the iframe
afterwards. Pages render one after another to keep memory use bounded. The
component shows progress and allows cancelling. If `print()` is called while not
connected or with no document loaded, it does nothing (see `CONVENTIONS.md`).

**D16 — Find.** Search the text from `page.getTextContent()`, normalized for case,
diacritics and whitespace (port the normalization from pdf.js `PDFFindController`).
Do not search the DOM. Highlight matches by wrapping text-layer spans. Ctrl/Cmd+F
opens find **only when focus is inside the viewer**. Enter / Shift+Enter in the find
field go to the next / previous match. The "N of M" result is announced with `announce()`.

As built in slice 4 (`src/vaadin-pdf-viewer-find-mixin.js`, `src/pdf-viewer-find.js`):

- The text of each page comes from `getTextContent()` with the same options as the text layer,
  so its text items map 1:1 to the text layer's `textDivs`. Items are joined with a line break
  after items that end a line.
- Normalization (`normalizeText`): case, diacritics (NFKD without marks), ligatures and runs of
  white space, keeping a map back to the original offsets.
- Highlights are separate boxes in a `.find-layer` below the text layer, from
  `Range.getClientRects()` over the text nodes, so the text layer itself stays unchanged for
  selection and assistive technology. Colors use the `Mark` system color with
  `mix-blend-mode: multiply`. They are redrawn when a page renders (e.g. after zoom).
- Searching walks all pages and caches their text per document. A new query or document drops
  the results of the previous search. A match on a page that is not rendered scrolls to the
  page, then to the match once rendered.
- The find bar is a `role="search"` part below the toolbar with a text field, "N of M", previous /
  next match and close buttons. Its controls are rendered by the toolbar mixin, because all light
  DOM controls come from a single Lit `render()`. Escape closes it and returns focus to where it
  was before opening. `input` / `change` events of the field are stopped at the viewer.

**D17 — Sidebar.** Hidden by default and opened with a toolbar toggle. Two views:

- **Thumbnails:** low-resolution renders of the pages, made only when they scroll
  into view, with `aria-current="page"` on the current page. Evaluate `vaadin-virtual-list` first.
- **Outline:** from `getOutline()`, shown as `role="tree"` with the standard tree keyboard
  pattern (arrows, Home/End, expand/collapse). The outline view is hidden when the PDF
  has no outline.

On narrow viewports the sidebar overlays the pages instead of pushing them aside.

**D18 — Accessibility model.**

- The host gets `role="region"` (only if the application hasn't set a role).
  Its accessible name comes from `aria-label` / `aria-labelledby` on the host, with the
  PDF title as fallback.
- The page scroller is focusable (`tabindex="0"`) so it can be scrolled with the keyboard.
- The canvas is `aria-hidden="true"`. The text layer, or the structure tree for tagged
  PDFs, is what assistive technology reads.
- Keys while the scroller has focus: PageUp/PageDown scroll by a viewport,
  Ctrl/Cmd+Home/End go to the first/last page, Ctrl/Cmd+`+`/`-`/`0` zoom in/out/reset.
  Don't override the browser's default Space / arrow scrolling.
- Page changes caused by toolbar actions are announced with `announce()` ("Page 3 of 12").
  Plain scrolling is **not** announced, to avoid noise.
- All built-in strings go through `I18nMixin` (`i18n` property).

As built in slice 3:

- The host gets `role="region"` and, unless the app set `aria-label` or `aria-labelledby`, an
  `aria-label` with the PDF title (fallback: i18n `document`). The viewer only replaces a name it
  set itself.
- The scroller (`content` part) has `tabindex="0"`, `role="document"` and the i18n `pages` name.
  The viewer handles the arrow keys, PageUp / PageDown, Space / Shift+Space and Home / End on it
  itself, because Safari does not scroll a focused scroll container with the keyboard.
- Ctrl/Cmd + `+` / `=` / `-` / `0` zoom anywhere in the viewer. Ctrl/Cmd + Home / End on the
  scroller go to the first / last page and announce it.
- Only rendered pages (visible ±1) have a text layer, like the pdf.js viewer. A screen reader in
  browse mode therefore only reaches the text of pages near the view. Revisit in slice 8.
- After the slice 3 reviews: links are moved into the text layer right after the text they cover,
  and that text gets `aria-hidden`, so each link is read once, in reading order. Links without
  text get "Go to page {page}"; external links get "(opens in a new tab)". Each page is a
  `role="group"` named "Page {page}". The page area is not focusable while there is no document.
  Releasing a page that contains the focused link moves focus to the page area (restoring the
  scroll position, which WebKit would otherwise reset). Following an internal link moves focus
  to the page area too. Ctrl/Cmd zoom shortcuts don't apply inside text fields, so the browser
  zoom stays available there. The page area's focus ring is an overlay above the pages.

**D19 — Testing fixtures.** Store small PDFs we generated ourselves in
`packages/pdf-viewer/test/fixtures/` (each ideally under 50 KB):
`multi-page.pdf` (≥ 5 pages, plain text, 2 page sizes), `links.pdf` (internal and
external links), `outline.pdf` (nested bookmarks), `tagged.pdf` (headings, list,
table, figure with alt text), `encrypted.pdf`, `invalid.pdf`. Record in
`test/fixtures/README.md` how each was made, so they can be regenerated. Don't use
third-party PDFs. Use the same fixtures on `dev/pdf-viewer.html`.

---

## 3. API draft

This is a draft. Slices refine it. Update this section whenever the API changes,
because reviewers check against it.

```html
<vaadin-pdf-viewer src="/files/report.pdf" aria-label="Quarterly report"></vaadin-pdf-viewer>
```

| Kind       | Name                                                                                                   | Notes                                                                                                                                                              |
| ---------- | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| property   | `src: string`                                                                                          | Document URL. Changing it loads a new document and resets `page` to 1 (unless `page` is set in the same update). `zoom` is kept.                                   |
| property   | `page: number`                                                                                         | Current page, 1-based. `notify: true` (changed by scrolling). Setting it scrolls to that page. Out-of-range values are kept and a warning is logged (no clamping). |
| property   | `pageCount: number`                                                                                    | Read-only, 0 until loaded.                                                                                                                                         |
| property   | `zoom: string \| number`                                                                               | `'page-width'` (default), `'page-fit'`, or a scale factor (`1` = 100%).                                                                                            |
| property   | `sidebarOpened: boolean`                                                                               | `@attr sidebar-opened`. Reflected, used for styling.                                                                                                               |
| property   | `fileName: string`                                                                                     | Download file name override (`@attr file-name`).                                                                                                                   |
| property   | `i18n: PdfViewerI18n`                                                                                  | Partial object, deep-merged with the defaults.                                                                                                                     |
| method     | `print(): void`                                                                                        | See D15.                                                                                                                                                           |
| event      | `zoom-changed`                                                                                         | From `notify` (the toolbar changes `zoom`).                                                                                                                        |
| event      | `page-changed`                                                                                         | From `notify`. Documented with `@fires`.                                                                                                                           |
| event      | `document-load`                                                                                        | Document loaded. `detail: { pageCount, title }`.                                                                                                                   |
| event      | `document-error`                                                                                       | Load failed. `detail: { reason: 'network' \| 'invalid' \| 'password', error }`.                                                                                    |
| state attr | `loading`, `has-error`                                                                                 | For styling.                                                                                                                                                       |
| parts      | `toolbar`, `sidebar`, `content`, `page`                                                                | Final list decided per slice.                                                                                                                                      |
| CSS props  | `--vaadin-pdf-viewer-background`, `--vaadin-pdf-viewer-page-gap`, `--vaadin-pdf-viewer-page-shadow`, … | Full names only, each falling back to a shared token.                                                                                                              |

The load events are called `document-load` / `document-error` and not `load` / `error`, because
`HTMLElementEventMap` already types `load` as `Event` and `error` as `ErrorEvent`, so the typed
event map would not compile (found in slice 0).

The internal `render-idle` event (marked `@internal`) fires when the viewer has finished rendering
what it currently shows. Tests and visual tests wait for it instead of using timeouts (R3).

Every event must follow the `CONVENTIONS.md` checklist: `@fires` in both `.js` and
`.d.ts`, an exported event type, an entry in the `*CustomEventMap`, and a typings test.

---

## 4. Environment facts agents keep getting wrong

- **The dev server is `@web/dev-server`, not Vite** (`yarn start`, `web-dev-server.config.js`,
  `--node-resolve` + esbuild). Something that works in `yarn start` is not proven to work in
  Vite. Slice 0 sets up a throwaway Vite check (in the scratchpad, not committed) and
  records the result.
- Dev page themes are chosen with the query parameter `?theme=base|lumo|aura:light|dark`,
  for example `dev/pdf-viewer.html?theme=aura:dark`.
- Visual tests run in Docker: `yarn test:base|test:lumo|test:aura --group pdf-viewer`,
  and to update screenshots `yarn update:base|update:lumo|update:aura --group pdf-viewer`.
- Unit tests: `yarn test --group pdf-viewer`, plus `yarn test:firefox` and `yarn test:webkit`.
  Snapshots: `yarn test:snapshots --group pdf-viewer`.
- **Playwright's Firefox does not start on the user's machine** (macOS 27 beta, "Could not find
  profile folder", for every package and also outside the sandbox). Run `yarn test` (Chromium)
  and `yarn test:webkit` locally, and say in reviews that Firefox was not run. CI covers it.
- Visual tests need Docker Desktop running (`open -a Docker`).
- The dev server for the in-app browser is configured in `.claude/launch.json` as `dev`
  (port 8000). That file is local and not committed.
- Lint before every review: `yarn lint:js`, `yarn lint:css`, `yarn lint:types`.
- Lumo styles go in `packages/vaadin-lumo-styles/{components,src/components}/pdf-viewer.css`.
  Aura styles go in `packages/aura/src/components/pdf-viewer.css`, imported from `packages/aura/aura.css`.
- Canvas output can differ slightly between runs. Visual tests should use simple
  fixtures and wait for rendering to finish. Expose an internal promise or event for
  "render idle" (marked `@internal`) instead of using timeouts.
- Tests that wait for pdf.js must not use fake timers around the worker. Use
  `sinon.useFakeTimers` only for our own debounce logic.
- Commit format follows `.claude/rules/commits-and-prs.md` (`feat: …`, imperative, <72 chars).

---

## 5. How to work a slice

Every slice is **vertical**: it delivers something a person can try on
`dev/pdf-viewer.html`, with tests, base styles **and** Lumo + Aura styles for whatever
it adds. Never leave theming or tests to "later".

1. Set the slice to `in progress` in the Tracker. Note the starting commit
   (`git rev-parse HEAD`) in the Progress log.
2. Implement with tests (TDD where it helps). Keep the dev page working.
3. Check the **Definition of done** below.
4. Commit (one or more commits). Set the slice to `in review`.
5. Run the **review gate** (section 6).
6. Fix the findings, or record why one is not fixed. Re-run the reviewer whose findings
   needed non-trivial changes.
7. Set the slice to `done`, fill in the review columns, and add a Progress log entry:
   what shipped, decisions made or changed, review outcome, follow-ups.

**Definition of done (every slice)**

- [ ] Acceptance criteria of the slice met, and verified by hand on the dev page.
- [ ] Unit tests for new behavior. DOM snapshot updated. Visual tests (base, Lumo, Aura)
      for every new visual state.
- [ ] Detach / reattach, setting properties while detached, and a hidden (zero-size) viewer
      are covered by tests for any new async work.
- [ ] `.d.ts` matches `.js`. Typings tests cover new properties and events.
- [ ] JSDoc styling tables list every new part, state attribute and CSS property.
- [ ] Every new string goes through `i18n`.
- [ ] RTL works (logical properties, mirrored directional icons). Visual tests include an `rtl`
      case, and `yarn update:aura:dark` is run for Aura dark baselines.
- [ ] Usable at 375 px width.
- [ ] `yarn lint` passes. Tests pass in Chromium, Firefox and WebKit.
- [ ] This plan is updated (API draft, decisions, tracker, log).

---

## 6. Review gate

After each slice, the orchestrating session starts **at least two fresh, independent
agents**. Neither of them may be the agent that implemented the slice. They review
in parallel and report findings. They don't fix anything.

### 6.1 Code reviewer

Prompt template (fill in `<base>` and `<slice>`):

> Review the changes in `git diff <base>..HEAD` for slice `<slice>` of the PDF viewer.
> Read `plans/pdf-viewer.md` (sections 2, 3 and the slice's acceptance criteria),
> `CONVENTIONS.md` in full, and the `guidelines/` chapters that the change touches.
> Check for:
> (1) every `CONVENTIONS.md` rule;
> (2) whether it matches the plan's decisions (D1–D19) and API draft;
> (3) defects: race conditions when `src` changes during a load (stale renders from an
> old document or page), `PDFDocumentProxy` / page / render tasks not destroyed or
> cancelled on disconnect or on `src` change, Worker or memory leaks, global listeners
> not removed, behavior that depends on whether properties are set before or after
> connect, throwing on bad input;
> (4) antipatterns: `document`-level lookups, pdf.js `GlobalWorkerOptions`,
> hard-coded ids or strings, physical CSS properties, class-field defaults,
> unconditional `updated()` work;
> (5) security settings from D9;
> (6) test quality: user-observable assertions, no real timers over 100 ms, cleanup.
> Run `yarn lint` and `yarn test --group pdf-viewer`.
> Report each finding with `file:line`, severity (blocker / should-fix / nit), the
> scenario that fails, and the suggested fix. Report "no findings" if there are none.
> Do not edit files.

The `/code-review` skill may be used for the standards and spec parts of this review.

### 6.2 Visual and interaction reviewer

Prompt template:

> Review slice `<slice>` of the PDF viewer visually and by interaction. Read
> `plans/pdf-viewer.md` (sections 2, 3 and the slice's acceptance criteria) and
> `guidelines/theming.md` + `guidelines/a11y.md`. Start the dev server with `yarn start`
> using the in-app browser pane (`preview_start`), and open `dev/pdf-viewer.html`.
> For each of `base:light`, `lumo:light`, `lumo:dark`, `aura:light`, `aura:dark`
> (`?theme=` parameter), take screenshots and check:
>
> - Does it fit visually with other Vaadin components in the same theme? Open
>   `dev/button.html`, `dev/text-field.html` and `dev/select.html` side by side to compare
>   spacing, radius, colors, focus ring, icon size and typography.
> - Pages render sharp (no blurry canvas at the current DPR or zoom), with no layout
>   shift when pages load, and the text layer is lined up with the canvas
>   (select text to check).
> - Keyboard only: tab order matches visual order, focus ring visible on every control,
>   every shortcut from D18 works, no focus traps.
> - `dir="rtl"` on `<html>`, a 375×812 viewport, and 200% page zoom: nothing overflows
>   or overlaps, and controls stay at least 24 px.
> - Accessibility tree (`read_page`): every control has a name, and the region and page
>   text are exposed.
>   Also run `yarn test:base --group pdf-viewer`, `yarn test:lumo --group pdf-viewer` and
>   `yarn test:aura --group pdf-viewer` if Docker is available. If it isn't, say so.
>   Report findings with screenshots and a theme / viewport / step to reproduce, plus
>   severity (blocker / should-fix / nit). Do not edit files.

Add a third reviewer when a slice has heavy accessibility work (slices 3, 6 and 8):
an a11y reviewer who goes through the ARIA patterns against WAI-ARIA APG and
`guidelines/a11y.md`.

Forced-colors mode cannot be emulated from the in-app browser. Slice 8 includes a
manual check on Windows High Contrast, done by the user.

---

## 7. Slices

### Slice 0 — Tracer bullet: package and first page

Goal: prove the riskiest assumptions end to end, with the thinnest real component.

- Scaffold `packages/pdf-viewer/` per `guidelines/package-structure.md` (D1, D2), with root
  entry files, base styles, an empty Lumo/Aura file wired in, and a typings test stub.
- `src` loads the document in our own worker (D6, D7) and renders **page 1 only** onto a
  canvas, sharp at the current DPR. Fires `load` / `error`.
- `dev/pdf-viewer.html` with the `multi-page.pdf` fixture and a broken-URL example.
- **Verify and record in section 2:** (a) works in `yarn start` in Chromium, Firefox and WebKit;
  (b) works in a throwaway Vite 6+ app in **dev and production build** that installs the
  package from the workspace (record any Vite config it needs, D6); (c) a `TextLayer`
  rendered inside shadow DOM lines up with the canvas, and text can be selected (throwaway
  check is fine); (d) how assets are shipped (D8); (e) the pinned version (D4);
  (f) gzipped size of what an app ends up loading.

Acceptance: page 1 of the fixture shows up in all three browsers and in the Vite build.
Changing `src` loads the new document with no stale render. A broken URL fires `error`
and shows an error state with an i18n message.

### Slice 1 — Continuous scroll, zoom, page tracking

- All pages in one scroller, rendering only visible pages (D10). Page gap, page shadow,
  and a background that comes from the theme.
- `zoom` property (D13), and re-rendering on resize and DPR change.
- `page` follows the page that fills most of the viewport. Setting `page` scrolls to it.
- `pageCount`, `loading` state with a loading indicator.

Acceptance: a 5-page fixture scrolls smoothly, zoom changes keep the current page in view,
`page-changed` fires once per page change, and canvases are released for pages far off-screen.

### Slice 2 — Toolbar: page navigation and zoom

- Toolbar (D11): previous / next page, page field showing "of N", zoom out / select / in.
- `i18n` for all labels. Icon buttons have accessible names (and a `vaadin-tooltip` if
  that matches existing components; check how other components label icon-only buttons first).
- Toolbar actions announce the page (D18).
- At 375 px the toolbar wraps or folds into a menu without overflowing. Decide which and record it.

Acceptance: everything can be reached and used by keyboard, labels are localizable,
the toolbar looks native in all three themes, and RTL mirrors the prev/next icons.

### Slice 3 — Text layer, links, keyboard, accessibility basics

- `TextLayer` per rendered page, so text can be selected and is readable by screen readers.
  The selection highlight follows the theme.
- `AnnotationLayer` with links only (D9). Internal links scroll to their target.
- Host region role and name, focusable scroller, the keyboard shortcuts from D18.

Acceptance: VoiceOver can read the text of page 1. Copying a selected paragraph gives
the right text. External links open safely and internal links navigate.

### Slice 4 — Find

- Find toggle in the toolbar, plus Ctrl/Cmd+F inside the viewer, opening a find field (D16).
- Highlights for all matches and the current match, next / previous, "N of M" with announcement.
- Escape closes find and returns focus to where it was before.

Acceptance: finds matches across pages, including pages not yet rendered. Typing
quickly cancels outdated searches. Highlights stay correct after zooming.

### Slice 5 — Sidebar: thumbnails

- Sidebar toggle, `sidebarOpened` property, thumbnails view (D17).
- Clicking or pressing Enter on a thumbnail goes to that page. The current page is
  marked and scrolled into view in the sidebar.

Acceptance: a 200-page document stays responsive (create a large fixture by
duplicating pages, or generate one in tests). Overlay behavior on narrow screens.

### Slice 6 — Sidebar: outline

- Outline view as a `role="tree"`, with switching between thumbnails and outline (D17).

Acceptance: follows the APG tree pattern for keyboard and ARIA. Selecting an
entry goes to its destination. The view is hidden when there is no outline.

### Slice 7 — Download and print

- Download button (D14) and `print()` with progress and cancel (D15).

Acceptance: the downloaded file is byte-identical to the original. Print preview shows
every page at the right size in Chromium, Firefox and WebKit. Cancelling releases memory.

### Slice 8 — Tagged PDFs, assistive technology audit, forced colors

- Port the struct-tree to ARIA mapping (headings with `aria-level`, lists, tables, figure
  alt text) without `document` lookups (D3).
- `@media (forced-colors: active)` rules in base styles.
- Manual AT pass: NVDA + Chrome/Firefox, JAWS + Chrome, VoiceOver + Safari macOS / iOS.
  The user or a human tester runs this. The agent prepares a checklist.

### Slice 9 — API docs, typings, README, release prep

- Complete JSDoc, checking that CEM / web-types are generated correctly. README with the
  feature flag, worker and Vite notes (from D6, D8), and the Safari 18+ minimum (D5).
- Remove or relocate this plan file.

---

## 8. Open questions and risks

- ~~Q1: Safari 17~~ — resolved 2026-10-06: Safari 18+ is the minimum for this component (D5).
- **R1:** Vite pre-bundling and the worker URL (D6). Mitigation: slice 0 verifies it, with a
  `workerSrc` escape hatch.
- **R2:** Bundle size. Measured in slice 0 (Vite 8 production build, gzipped): viewer chunk
  16 KB, pdf.js main chunk 148 KB (loaded on first `src`), worker 374 KB.
  Report the actual number in slice 0.
- **R3:** Flaky visual tests from canvas rendering. Mitigation: the "render idle" hook and simple fixtures.
- **R4:** Memory on iOS with large pages and high zoom. Mitigation: `maxCanvasPixels` and releasing canvases (D10).

---

## 9. Progress log

Newest entry at the top. Format:

```
### YYYY-MM-DD — Slice N: <title> — <status>
- Base commit: <sha>  Head: <sha>
- Shipped: …
- Decisions added or changed: …
- Code review: <summary, counts by severity, what was fixed or deferred>
- Visual review: <summary>
- Follow-ups: …
```

### 2026-10-06 — Slice 3: Text layer, links, keyboard, a11y basics — done

- Base commit: 538b068c2c Head: a4f29b51f9, review fixes committed together with slice 4
- Shipped: pdf.js text layer per rendered page, own link elements with a URL allowlist, internal
  link navigation, host region and name, focusable page area with keyboard scrolling, Ctrl/Cmd
  shortcuts, `unsafe-links.pdf` fixture, slice 2 review fixes.
- Code review: 0 blockers, 6 should-fix (stale text layer scale, ligatures in copied text, focus
  lost on release, stale host name after error, links for unsupported actions, pdf.js measuring
  canvas left in the document), several nits. All fixed (`TextLayer.cleanup()` on the last
  worker release, `pdfjs.AnnotationType.LINK`, XYZ / FitH link targets, `event.code` for zoom
  keys, Shift+Arrow left for selection, `lang` from the element's ancestors).
- Visual review: 1 blocker (no focus ring on the page area and links in Lumo), 3 should-fix
  (selection lost when dragging into blank space, focus ring covered by pages, toolbar clipped
  with large text on narrow viewers). All fixed.
- A11y review: 2 blockers (Lumo focus ring, focus lost on release), 3 should-fix (links read
  twice and out of order, fallback link names, empty state focusable). All fixed. Deferred to
  slice 8: text only near the view, reading order of untagged PDFs, links on far pages, forced
  colors details, loading state announcement, real AT audit.
- Note for the user: the viewer handles arrow keys / PageUp / PageDown / Space / Home / End on
  the page area itself (Safari does not scroll a focused scroll container), which replaces the
  original D18 wording "don't override the browser's default Space / arrow scrolling". The
  behavior is the same as native scrolling.

### 2026-10-06 — Slice 2: Toolbar — done

- Base commit: b2d2a73c16 Head: 538b068c2c, review fixes committed together with slice 3
- Shipped: toolbar with previous / next page, page field, zoom out / select / in, shared tooltip,
  i18n, announcements, internal `vaadin-pdf-viewer-button`, Lumo and Aura styling, `zoom-changed`.
  Also slice 1 re-review fixes: relayout while hidden, batched page size requests, render budget.
- Code review: 0 blockers, 7 should-fix (app tooltip taken over, internal `change` events
  leaking, page count hidden from screen readers, focus moved into the field after pointer clicks,
  theme not forwarded, icon property meaning differs per theme, test gaps), 6 nits. Fixed, except:
  theme forwarding (decided against, D11), icon property per theme (documented, like map),
  `_requestValidation()` kept because the repo's lint rule forbids calling `validate()`.
- Visual review: 0 blockers, 4 should-fix (Lumo buttons too wide with icons too high, Aura icons
  accent-colored because the button was missing from `aura/src/color.css`, page count, icon
  property). Fixed. Nits: plan text on 375 px corrected, select widened, RTL note added.
- Follow-ups: Lumo toolbar background and button color differ from the RTE toolbar (kept as
  standard tertiary buttons). Page field digits follow RTL in base but not in Lumo (field behavior).

### 2026-10-06 — Slice 1: Continuous scroll, zoom, page tracking — done

- Base commit: 59ff4a2850 Head: 1e173c331e + review fix commit
- Shipped: all pages in one scroller with progressive sizing, rendering of visible pages only,
  canvas release with a memory budget, `page` (notify) and `zoom` (`page-width`, `page-fit`,
  number) properties, re-render on resize and device pixel ratio change, loader, visual `zoom` test.
- Decisions added or changed: D10 details, D13 fits the first page, `src` resets only `page`.
- Code review: 0 blockers, 5 should-fix (stray page change when hidden, out-of-range page with
  `src` left the view blank, pin blocked page tracking, RTL zoom position, all pages fetched
  before first paint), 7 nits (idle firing early or hanging, canvas reattached after release,
  scroll frame not cancelled, anchor for out-of-range page, scale depending on current page,
  iOS memory budget, test gaps). All fixed, with tests.
- Visual review: 0 blockers, 2 should-fix (page-width depending on current page, horizontal
  position on zoom / RTL), both fixed. Found that `render-idle` could fire before page sizes
  arrived, which made the RTL baseline flaky; fixed.
- Follow-ups: pages wider than the view have no end padding when scrolled fully sideways (nit).
  Background contrast against white pages in Lumo / Aura light (judgement, revisit in slice 8).

### 2026-10-06 — Slice 0: Tracer bullet — done

- Base commit: 794e89c348 Head: 561906b4d0 + review fix commit
- Shipped: package scaffold (commercial license, experimental flag), lazy pdf.js loading,
  shared worker with reference counting, first page rendered sharp at the device pixel ratio,
  `document-load` / `document-error` events, `loading` / `has-error` state attributes, error
  message with i18n and `announce()`, Lumo and Aura files, dev page, generated fixtures,
  unit / snapshot / typings / visual tests (base, Lumo, Aura light + dark, RTL).
- Decisions added or changed: D4 pinned 6.3.289 (npm cooldown), D6 verified with Vite 8 dev +
  build without config, D8 don't ship assets, D11 toolbar components go in light DOM, events
  renamed to `document-load` / `document-error`, internal `render-idle` event.
- Code review: 0 blockers, 4 should-fix (leaks when detached during load or when `src` is set
  while detached, zero-width render, missing tests), 6 nits (failed worker reused, sync
  `getDocument` throw leaking a worker count, render errors reported as load errors, stale
  comment, hard-coded page color, error not announced). All fixed.
- Visual review: 1 blocker, RTL garbled text because the canvas inherited `direction: rtl`;
  fixed with `direction: ltr` on pages and an `rtl` visual test. Nits fixed: error message
  wrapping at huge font sizes, `--vaadin-pdf-viewer-page-background`, Aura dark baselines.
- Follow-ups: focusable scroller and host `role="region"` (slice 3, D18). Re-render on resize
  (slice 1). Firefox not run locally (environment).

### 2026-10-06 — Planning

- Researched pdf.js 6.4.299 and wrote this plan.
- Settled with the user: commercial license, v1 scope (find, sidebar, print/download),
  toolbar built from Vaadin components, continuous scroll only, vertical slices with
  two reviews per slice, Safari 18+ minimum with the legacy pdf.js build.
