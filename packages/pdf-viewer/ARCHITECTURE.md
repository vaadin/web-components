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
- The viewer renders the visible pages, the most visible first. Then it renders one page after and one
  page before them.
- Only one page renders at a time. A new canvas replaces the old one only when it is complete.
- A page canvas has at most 2^24 pixels (about 16.8 million). Large pages render at a lower resolution.
- All canvases together may use three times that (about 50.3 million pixels). Pages ahead of the view
  render only while one more full canvas fits.
- A page more than one page away from the view loses its canvas. A page outside the view also loses it
  while the canvases use more than the total budget.
- When the device pixel ratio changes, the viewer renders the visible pages again at the new ratio.
- A new `src` resets `page` to 1, unless the application sets `page` in the same update.
- `page` follows the page that takes up most of the view. A page set by the application stays current
  until the user scrolls.
- On resize and zoom, the viewer keeps the same point of the current page at the top of the view.
- The viewer fires an internal `render-idle` event when no page is left to render, once the page sizes are
  loaded. It is only intended for testing purposes and is not part of the public API.

## Code structure

`PdfViewerMixin` composes one mixin for each concern. Each part of the state has one owner.

- `PdfViewerDocumentMixin` loads `src`. It calls `_documentLoaded({ firstPage })` and `_documentUnloaded()`.
  Methods that need the document, e.g. `download()`, await `_whenDocumentReady()`. It resolves once no document
  is loading, with the document or null.
- `PdfViewerRenderMixin` owns the page views, their sizes, the render queue and the device pixel ratio. It calls `_pageSizesChanged()` at most once per frame when pages get their own size.
- `PdfViewerScrollMixin` owns the scale `_scale`, the anchor, the visible pages and `page`. It asks for
  rendering only with `_renderVisible()` and `_cancelRender()`. It gets the scale from `_getScaleForSize()`, which
  fits the width of the current page by default.
- `PdfViewerZoomMixin` owns `zoom`. It writes no render or scroll state:
  - It overrides `_getScaleForSize()` to return the scale for `zoom`.
  - It calls `_refreshLayout()` when `zoom` changes.
  - Its `_zoomFactor` getter reads `_scale`, in units of the actual page size.
- `PdfViewerKeyboardMixin` handles the keyboard shortcuts.
- `PdfViewerToolbarMixin` renders the header and the toolbar. Its controls are in the light DOM, so a theme
  styles the page field like any other `vaadin-integer-field`. The element renders them before a marker comment,
  so application children added later keep their place.
  - The header is a button in the shadow DOM that collapses and expands the toolbar. It shows `headerTitle`,
    else `_getDocumentName()` of the document mixin, the name that downloads also use.
- `PdfViewerDownloadMixin` adds `download()` and its button. Each built-in button has its own slot, which the
  mixin adds after `toolbar-actions` with `_renderToolbarActionSlots()`.
  - `PdfViewerButtonController`, a `SlotController`, creates the default button. An application can slot its own
    component instead.
  - The viewer sets the icon, the tooltip and `disabled` only on the default button. Any slotted component gets
    the click action.
  - The Flow counterpart sets `_isDefault` on its own default button before it slots it, as for CRUD and Upload.
  - The page and zoom controls are rendered before the marker instead, because nothing replaces them. Flow can
    only return a component that it created, so a replaceable button needs a slot.
- A download keeps its data for a minute, also when the viewer is detached meanwhile. Some browsers fail a
  download whose URL is released right after the click.
- `PdfViewerPrintMixin` adds `print()` and its button in the `print-button` slot after the download button. The
  element shows its progress in the `print-progress` part over the pages.
- The element applies `I18nMixin` and defines the default texts. The mixins read them from `__effectiveI18n`.
- The element applies `FocusMixin` and owns the focus state. Listeners on the page area in its template set
  `focused` and `focus-ring`, as focus moving inside the shadow root does not reach listeners on the host.
- `PdfViewerRenderQueue` decides the render order, the memory budget and the release. It has no host
  reference, and its limits are options.
- `pdf-viewer-layout.js` has the layout math without DOM access: visible pages, anchor and fit scale.
- `pdf-viewer-zoom-utils.js` has the zoom levels, their format and the check of a `zoom` value.
- To check whether a result belongs to the current document, a mixin compares `_pdfDocument` with the
  document from the start of the call.

## Printing

- `print()` renders each page as a PNG image into an off-screen frame, then opens the print dialog of
  the browser for the frame. Downloading the PDF and printing it in another tab would leave the page.
- Pages render one at a time at 150 DPI, with the print intent of pdf.js. The print intent selects
  the annotations and the optional content that the document prints.
- Large pages render at a lower resolution, as a canvas has at most 2^24 pixels.
- Each image has a named `@page` rule with the size of its PDF page, so each page prints on paper of
  its own size.
- The frame and the images are released after printing, on cancel, on a new `src` and on detach.

## Install size

- The package depends on `pdfjs-dist`, which takes about 35 MB unpacked. Only the parts that the
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
