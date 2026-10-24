# PDF Viewer Architecture

This file describes the internals of `<vaadin-pdf-viewer>`: how it loads pdf.js, which requests
it sends, how it prints and how it handles touch. It also lists the install size and compares the
viewer with the VCF PDF Viewer add-on. It is for reviewers, maintainers and the Flow team.

The [README](README.md) covers what an application needs: installation, usage, pdf.js assets,
the Content Security Policy, browser support and the known limitations.

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
- `download()` and `print()` use the loaded bytes and send no new request. A URL that serves
  the file only once therefore works.
- The first document also loads the pdf.js library and its worker script.
- With `assetsUrl`, pdf.js also loads the asset files that a document needs, see
  [pdf.js assets](README.md#pdfjs-assets).

## Printing

- `print()` and the print button wait until the document has loaded. They print the loaded bytes.
- The viewer draws each page as an image at 150 DPI before it opens the print dialog of the
  browser. Meanwhile, it shows the progress with a cancel button. Escape also cancels printing.
- Long documents take a few seconds to prepare. 200 pages took 2.5 to 6.7 seconds in tests.
- Each page prints on paper of its own size, without margins.
- The printed pages are images. Printing to a PDF file therefore gives a file without selectable text.
- The promise of `print()` resolves when the print dialog closes. A browser that returns from
  the dialog early, possibly iOS Safari, resolves it before printing ends.

## Touch devices

- Pinch the pages to zoom between 25% and 400%. The viewer fires one `zoom-changed` per pinch.
- With a coarse pointer, the toolbar hides the page controls and the zoom select. The zoom
  buttons stay. The toolbar does not collapse, so `toolbarCollapsed` stays `false`.

## Install size

- The package depends on `pdfjs-dist`, which takes about 35 MB unpacked. Only the parts that the
  viewer imports go into the browser bundle.
- `pdfjs-dist` has an optional dependency, `@napi-rs/canvas`, with native binaries of about
  30 MB. pdf.js uses it only in Node.js, and it is not part of the browser bundle. To skip it,
  install with `npm i --omit=optional`.
- `pdfjs-dist` declares Node.js 22.13 or newer.

## Relation to the VCF PDF Viewer add-on

`<vaadin-pdf-viewer>` is not API compatible with `<vcf-pdf-viewer>`. This table maps the add-on
API to the new one.

| VCF PDF Viewer                                                             | PDF Viewer                                                       |
| -------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| `src`                                                                      | `src`, a URL string                                              |
| `zoom`: `"auto"`, `"page-fit"` or a number as a string                     | `zoom`: `"page-width"` (default), `"page-fit"` or a number       |
| `currentPage` (string), `setCurrentPage(page)`                             | `page` (number)                                                  |
| `currentPage-changed` event                                                | `page-changed` event, `detail.value`                             |
| `document-loaded` event, `detail.document` (pdf.js document)               | `document-load` event, `detail.pageCount` and `detail.title`     |
| No error event                                                             | `document-error` event, `detail.reason` and `detail.error`       |
| `thumbnail-clicked` event                                                  | `page-changed` event                                             |
| `customTitle`                                                              | `headerTitle`, shown with `headerVisible`                        |
| `toolbarOnlyFilename`                                                      | No equivalent. Set `headerTitle` or `fileName` to the file name. |
| `autoZoomOptionLabel`, `fitZoomOptionLabel`                                | `i18n.pageWidth`, `i18n.pageFit`                                 |
| `sidebarToggleTooltip`, `previousPageTooltip`, `nextPageTooltip`           | `i18n.sidebar`, `i18n.previousPage`, `i18n.nextPage`             |
| Private `__openSidebar()`, `__closeSidebar()`                              | `sidebarOpened` and the `sidebar-opened-changed` event           |
| `hideZoom`                                                                 | No equivalent                                                    |
| `renderInteractiveForms`                                                   | No equivalent. Form fields show their appearance, read only.     |
| `rotateCw()`, `rotateCcw()`                                                | No equivalent                                                    |
| Default slot of the toolbar                                                | `toolbar-actions` slot                                           |
| Download button of the Flow add-on                                         | Built-in download button, `downloadButtonHidden`, `download()`   |
| Print button of the Flow add-on, off by default                            | Built-in print button, `printButtonHidden`, `print()`            |
| `--pdf-viewer-*` CSS custom properties                                     | `--vaadin-pdf-viewer-*` CSS custom properties                    |
| Parts `toolbar`, `sidebar-container`, `thumbnail-view`, `viewer-container` | Parts `toolbar`, `sidebar`, `thumbnails`, `content`              |
