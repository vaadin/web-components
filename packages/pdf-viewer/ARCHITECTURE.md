# PDF Viewer Architecture

This file describes the internals of `<vaadin-pdf-viewer>`.

The [fixtures README](test/fixtures/README.md) describes the PDF files that the unit tests use and
how to generate them.

## Worker and bundlers

- The component loads [pdf.js](https://mozilla.github.io/pdf.js/) (legacy build) when the first
  `src` is set. Importing the component therefore costs little.
- pdf.js runs in a module worker. The component creates it from a file of this package with
  `new Worker(new URL('./pdf-viewer-worker.js', import.meta.url), { type: 'module' })`.
- Vite supports this pattern in the dev server and in production builds without configuration.
  Other bundlers must support module workers created with `new URL(..., import.meta.url)`.
- All viewers on a page share one worker. The worker stops when no viewer has a document.
- The viewer does not change the global worker options of pdf.js (`GlobalWorkerOptions`). Other
  pdf.js users on the page keep their own settings.
- The viewer has no fallback to the main thread. When the worker cannot load, the viewer fires
  `document-error` with the reason `network` and logs a warning about `worker-src`.

## Requests

- The viewer requests a document with one GET request. It does not use range requests, even
  when the server supports them.
- The first document also loads the pdf.js library and its worker script.

## Rendering

- After load, each page gets a placeholder with the size of the first page. The other page sizes load in
  batches of 10, and the layout updates once per frame. The pages fit the width of the current page to
  the viewer, as in pdf.js. The fit is computed again on resize and when page sizes load, not when the
  user scrolls to a page of another size.
- The viewer renders the visible pages, starting with the current page, see `page` below. Then it renders
  one page after and one page before them.
- Only one page renders at a time. A new canvas replaces the old one only when it is complete.
- A page canvas has at most 2^24 pixels (about 16.8 million). Large pages render at a lower resolution.
- All canvases together may use three times that (about 50.3 million pixels). Pages ahead of the view
  render only while one more full canvas fits.
- A page more than one page away from the view loses its canvas. A page outside the view also loses it
  while the canvases use more than the total budget.
- A page that loses its canvas also frees the data that pdf.js keeps after rendering it, such as its
  decoded images, as in the pdf.js viewer.
- When the device pixel ratio changes, the viewer renders the visible pages again at the new ratio.
- `page` is read-only. A new `src` resets it to 1. The application goes to a page with `scrollToPage()`.
- `page` follows the page with the largest part of it in view. A page taller than the view counts the part
  of the view that it fills instead. A page scrolled to stays current until the user scrolls.
- On resize and zoom, the viewer keeps the same point of the current page at the top of the view.
- The viewer fires an internal `render-idle` event when no page is left to render, once the page sizes are
  loaded. It is only intended for testing purposes and is not part of the public API.

## Code structure

`PdfViewerMixin` composes one mixin for each concern. Each part of the state has one owner.

- `PdfViewerDocumentMixin` loads `src`. It calls `_documentLoaded(details)` with the title, language and first
  page, and `_documentUnloaded()`. Methods that need the document, e.g. `download()`, await
  `_whenDocumentReady()`. It resolves once no document is loading, with the document or null.
- `PdfViewerDownloadMixin` adds `download()`. It uses only the document mixin, so it comes right after it.
  - A download keeps its data for a minute, also when the viewer is detached meanwhile. Some browsers fail a
    download whose URL is released right after the click.
- `PdfViewerRenderMixin` owns the page views, their sizes, the render queue and the device pixel ratio. It calls `_pageSizesChanged()` at most once per frame when pages get their own size.
- `PdfViewerScrollMixin` owns the scale `_scale`, the anchor, the visible pages and `page`. It asks for
  rendering only with `_renderVisible()` and `_cancelRender()`. It gets the scale from `_getScaleForSize()`, which
  fits the width of the current page by default.
- `PdfViewerZoomMixin` owns `zoom`. It writes no render or scroll state:
  - It overrides `_getScaleForSize()` to return the scale for `zoom`.
  - It calls `_refreshLayout()` when `zoom` changes.
  - Its `_zoomFactor` getter reads `_scale`, in units of the actual page size.
- `PdfViewerTextLayerMixin` renders the text layer of each rendered page and sets the document language on the
  pages. A page loads its text each time it renders, as pdf.js' own viewer does.
- `PdfViewerFindMixin` owns the matches. It loads the text of each page once per document into a private map.
  The text layer loads its own text. Text that fails to load is loaded again by the next search.
  - Its `_renderPageLayers()` override highlights the matches with `page.renderFindLayer()` once the text
    layer has rendered. A page gets highlights only when it has `endOfContentElement`, as the text layer
    of a page is set before it has rendered.
  - It scrolls to the current match with `_scrollToPage()` and an offset, as the links mixin does for a
    destination. The match goes to the middle of the view on each axis where it is not well inside the view.
    The page of the match becomes the current page. It jumps, as pdf.js does for a match.
  - When the page of the match has not rendered, it goes to the page with `_scrollToPage()` first. A pending
    scroll to a match is dropped when `page` changes to another page.
- `PdfViewerLinksMixin` adds the links of each rendered page and follows internal links with `_scrollToPage()`.
- After a page canvas renders, `PdfViewerRenderMixin` awaits `_renderPageLayers(page)`. Each override awaits
  `super` first, so the layers render in the order of the mixins: text, find, then links.
- The page view owns the DOM of a page: the canvas, the text layer, the link layer and the find layer. Its
  methods check after each await that the page still has the same canvas, so a released page gets no layers.
- `PdfViewerKeyboardMixin` handles the keyboard shortcuts.
- `PdfViewerToolbarMixin` renders the header and the toolbar. Its controls are in the light DOM, so a theme
  styles the page field like any other `vaadin-integer-field`. The `slotContent()` directive renders them, so
  application children added later keep their place.
  - The header is a button in the shadow DOM that collapses and expands the toolbar. It shows `headerTitle`,
    else `_getDocumentName()` of the document mixin, the name that downloads also use.
  - The controls call the methods of the inner mixins, for example `_scrollToPage()`, `_stepZoom()` and
    `download()`.
  - Each icon button is named after its tooltip text: its `vaadin-tooltip` has the `ariaLinkMode` property set to
    `aria-labelledby`. A new button needs the same, and no `aria-label`. Bind the property, not the
    `aria-link-mode` attribute: it is not a real ARIA attribute, so a11y checkers such as axe (`aria-valid-attr`)
    flag it in the DOM.
  - The download button is after `toolbar-actions`. To replace it, an application hides it with
    `downloadButtonHidden` and adds its own button that calls `download()` to `toolbar-actions`.
- The element applies `I18nMixin` and defines the default texts. The mixins read them from `__effectiveI18n`.
- The element applies `FocusMixin` and owns the focus state. Listeners on the page area in its template set
  `focused` and `focus-ring`, as focus moving inside the shadow root does not reach listeners on the host.
- `PdfViewerRenderQueue` decides the render order, the memory budget and the release. It has no host
  reference, and its limits are options.
- `pdf-viewer-layout.js` has the layout math without DOM access: visible pages, anchor and fit scale.
- `pdf-viewer-zoom-utils.js` has the zoom levels, their format and the check of a `zoom` value.
- To check whether a result belongs to the current document, a mixin compares `_pdfDocument` with the
  document from the start of the call.

## Text and links

- The text layer of pdf.js puts transparent text over the canvas. Users can select it, and screen readers
  read it.
- Pages that lose their canvas also lose their text and link layers. Screen readers therefore reach only
  the text near the view.
- Links are in their own layer over the text layer. Each link is named after the text it covers, or
  after its URL or the page it goes to.
- Only `http:`, `https:` and `mailto:` links open, in a new tab without access to the viewer.
- Links on layers that the document hides are left out, as in pdf.js.
- A link that wraps to the next line is clickable only on its words, which the `QuadPoints` of the annotation
  give. Its focus ring goes around these words.
- When a focused link loses its page, focus moves to the page area.

## Find

- Matching ignores case, ligatures, differences in white space and the diacritics of Latin, Greek and
  Cyrillic letters. Marks of other scripts make another letter, so matching keeps them.
- The highlights are in a layer under the text layer. They are positioned in percent of the page, so they
  stay in place on zoom.
- A page that loses its canvas also loses its highlights. It gets them back when it renders again.
- `find()` and `highlight()` wait while the document loads. They do nothing when the viewer is not attached.
  Of several calls in a row, only the last one runs.
- A page without size, e.g. inside a hidden ancestor, gets its highlights once the viewer has a size again.
  The scroll to the current match waits for it too.

## Install size

- The package depends on `pdfjs-dist`, which takes about 38 MB unpacked. Only the parts that the
  viewer imports go into the browser bundle.
- `pdfjs-dist` has an optional dependency, `@napi-rs/canvas`, with native binaries of about
  30 MB. pdf.js uses it only in Node.js, and it is not part of the browser bundle. To skip it,
  install with `npm i --omit=optional`.
- `pdfjs-dist` declares Node.js 22.13 or newer.

## Browser support

- The viewer requires Safari and iOS Safari 18 or newer while it is experimental. This is one
  version above the general Vaadin minimum, Safari 17.6.
- The viewer uses the legacy build of pdf.js, which supports more browser versions than the
  modern build. Safari 17.6 support is not checked yet.
- Other browsers are supported as for all Vaadin components: latest Chrome, Edge and Firefox.
