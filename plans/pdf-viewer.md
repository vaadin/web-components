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

| #   | Slice                                    | Status | Reviews (code / visual) | Notes |
| --- | ---------------------------------------- | ------ | ----------------------- | ----- |
| 0   | Tracer bullet: package + first page      | todo   | – / –                   |       |
| 1   | Continuous scroll, zoom, page tracking   | todo   | – / –                   |       |
| 2   | Toolbar: page navigation + zoom controls | todo   | – / –                   |       |
| 3   | Text layer, links, keyboard, a11y basics | todo   | – / –                   |       |
| 4   | Find                                     | todo   | – / –                   |       |
| 5   | Sidebar: thumbnails                      | todo   | – / –                   |       |
| 6   | Sidebar: outline                         | todo   | – / –                   |       |
| 7   | Download and print                       | todo   | – / –                   |       |
| 8   | Tagged PDFs, AT audit, forced colors     | todo   | – / –                   |       |
| 9   | API docs, typings, README, release prep  | todo   | – / –                   |       |

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
of writing the latest version is 6.4.299. Note the pinned version here when slice 0 picks it:
`pdfjs-dist@_____`.

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
- Vite dev pre-bundling (`optimizeDeps`) can still break the relative URL. Slice 0 must verify a
  Vite **dev** and **production** build. If it needs `optimizeDeps.exclude: ['@vaadin/pdf-viewer']`
  (or similar), record that here. It has to go into Flow's Vite config.
- An escape hatch for apps with unusual bundlers or a strict CSP: a static
  `PdfViewer.workerSrc` (URL string) override. Only add it if slice 0 shows it is needed (no bloat).

**D7 — Lazy loading.** Importing `@vaadin/pdf-viewer` must not load pdf.js. Load it with
dynamic `import()` the first time `src` is set on a connected element, and cache the
module promise at module level.

**D8 — Static assets (`cmaps/`, `standard_fonts/`, `wasm/`).** The worker needs these for
CJK text, PDFs without embedded standard fonts, and fast JPEG2000/JBIG2 decoding. Without
them pdf.js still renders most business PDFs, but with warnings and slower or degraded
output in those cases. Slice 0 decides how to ship them. Record the outcome here:
`________`. Default if nothing better works: don't ship them, leave them unset, and
add a static config property later only if real documents need it.

**D9 — Security settings.**

- Never load `pdf.sandbox.mjs`, and keep `enableScripting` off.
- Keep `enableXfa: false`.
- `AnnotationLayer` renders links only. No form or editor layers.
- External links: `target="_blank"` and `rel="noopener noreferrer"`. Only allow
  `http:`, `https:` and `mailto:` URLs, and ignore anything else.
- `isEvalSupported` no longer exists in 6.x, so don't set it.

**D10 — Layout: continuous vertical scroll only.** All pages are stacked in one scroller.
Page placeholders get their size from each page's viewport, so the scroll height is
right before anything renders. Only pages inside the viewport plus a buffer (±1 page)
get a canvas, text layer and link layer. Pages that move far away release their
canvas. Re-render on zoom change, on `devicePixelRatio` change, and on resize when zoom
is `page-width` / `page-fit` (use `ResizeMixin` from component-base). Cap the
canvas size (pdf.js `maxCanvasPixels`, about 16M pixels) so iOS doesn't run out of memory.

**D11 — Toolbar built from Vaadin components.** Use `vaadin-button` (icon buttons),
`vaadin-integer-field` (page number), `vaadin-select` (zoom), and `vaadin-text-field`
(find). They are rendered in the viewer's shadow DOM. Add them as package dependencies,
as `crud` does with its dependencies. Pass the host `theme` on to the inner components
where that makes sense (`ifDefined(this._theme)`). Icons: use the shared
`--_vaadin-icon-*` masks where they exist (plus, minus, chevron-down/right, file,
fullscreen). Any icon that's missing (print, download, search, sidebar, chevron-up)
is added to component-base's icon set the same way as the existing ones.
Don't use an icon font or SVG files.

**D12 — `src` is a URL only.** Flow serves the file through a `DownloadHandler` /
resource URL. `withCredentials` and range requests are left at pdf.js defaults
(range requests need `Accept-Ranges: bytes` from the server).

**D13 — Default zoom is `page-width`.** It works best on narrow screens and matches
how most business documents are read.

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
| property   | `src: string`                                                                                          | Document URL. Changing it loads a new document and resets page and zoom state.                                                                                     |
| property   | `page: number`                                                                                         | Current page, 1-based. `notify: true` (changed by scrolling). Setting it scrolls to that page. Out-of-range values are kept and a warning is logged (no clamping). |
| property   | `pageCount: number`                                                                                    | Read-only, 0 until loaded.                                                                                                                                         |
| property   | `zoom: string \| number`                                                                               | `'page-width'` (default), `'page-fit'`, or a scale factor (`1` = 100%).                                                                                            |
| property   | `sidebarOpened: boolean`                                                                               | `@attr sidebar-opened`. Reflected, used for styling.                                                                                                               |
| property   | `fileName: string`                                                                                     | Download file name override (`@attr file-name`).                                                                                                                   |
| property   | `i18n: PdfViewerI18n`                                                                                  | Partial object, deep-merged with the defaults.                                                                                                                     |
| method     | `print(): void`                                                                                        | See D15.                                                                                                                                                           |
| event      | `page-changed`                                                                                         | From `notify`. Documented with `@fires`.                                                                                                                           |
| event      | `load`                                                                                                 | Document loaded. `detail: { pageCount, title }`.                                                                                                                   |
| event      | `error`                                                                                                | Load failed. `detail: { reason: 'network' \| 'invalid' \| 'password', error }`.                                                                                    |
| state attr | `loading`, `has-error`                                                                                 | For styling.                                                                                                                                                       |
| parts      | `toolbar`, `sidebar`, `content`, `page`                                                                | Final list decided per slice.                                                                                                                                      |
| CSS props  | `--vaadin-pdf-viewer-background`, `--vaadin-pdf-viewer-page-gap`, `--vaadin-pdf-viewer-page-shadow`, … | Full names only, each falling back to a shared token.                                                                                                              |

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
- [ ] `.d.ts` matches `.js`. Typings tests cover new properties and events.
- [ ] JSDoc styling tables list every new part, state attribute and CSS property.
- [ ] Every new string goes through `i18n`.
- [ ] RTL works (logical properties, mirrored directional icons).
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
- **R2:** Bundle size. About 530 KB gzipped (main + worker) when pdf.js loads lazily.
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

### 2026-10-06 — Planning

- Researched pdf.js 6.4.299 and wrote this plan.
- Settled with the user: commercial license, v1 scope (find, sidebar, print/download),
  toolbar built from Vaadin components, continuous scroll only, vertical slices with
  two reviews per slice, Safari 18+ minimum with the legacy pdf.js build.
