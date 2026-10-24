# @vaadin/pdf-viewer

A web component for viewing PDF documents, with page navigation, zoom, find, page thumbnails,
outline, download and print.

> ℹ️&nbsp; A commercial Vaadin [subscription](https://vaadin.com/pricing) is required to use PDF Viewer in your project.

> ⚠️&nbsp; PDF Viewer is experimental. Its API may change in minor versions. To use it, enable the `pdfViewerComponent` feature flag.

[![npm version](https://badgen.net/npm/v/@vaadin/pdf-viewer)](https://www.npmjs.com/package/@vaadin/pdf-viewer)

```html
<vaadin-pdf-viewer src="/files/report.pdf"></vaadin-pdf-viewer>
```

## Installation

Install the component:

```sh
npm i @vaadin/pdf-viewer
```

Enable the feature flag before you import the component:

```js
window.Vaadin ??= {};
window.Vaadin.featureFlags ??= {};
window.Vaadin.featureFlags.pdfViewerComponent = true;
```

Once installed, import the component in your application:

```js
import '@vaadin/pdf-viewer';
```

## Usage

```html
<vaadin-pdf-viewer src="/files/report.pdf" zoom="page-fit" sidebar-opened header-visible></vaadin-pdf-viewer>
```

- `src`: the URL of the document. A new `src` loads the new document and goes back to page 1,
  unless `page` changes in the same update.
- `page`: the current page, starting from 1. The viewer updates it while the user scrolls and
  fires `page-changed`. Setting it scrolls to that page.
- `pageCount`: the number of pages, read only. Fires `page-count-changed`.
- `zoom`: `page-width` (default), `page-fit`, or a number (`1` for 100%). Fires `zoom-changed`.
- `headerVisible` and `headerTitle`: show a header with a title above the toolbar. Without
  `headerTitle`, the header shows the name of the document.
- `toolbarCollapsed`: collapses the toolbar while the header shows. Fires `toolbar-collapsed-changed`.
- `sidebarOpened`: shows the sidebar with page thumbnails and, when the document has one, its
  outline. Fires `sidebar-opened-changed`.
- `fileName`: the name of the document, also used for downloaded files.
- `findButtonHidden`, `downloadButtonHidden` and `printButtonHidden`: hide the built-in buttons.
  The methods keep working.
- `i18n`: the texts of the component, for localization.
- `find(text)`: opens the find bar, finds the text in the whole document and fires `find-result`
  (`detail: { query, matchCount }`).
- `highlight(page, text)`: highlights a passage that the application has located, and scrolls to it.
- `download()`: saves the document. `print()`: prints it, see [Printing](#printing).
- `document-load` (`detail: { pageCount, title }`) and `document-error` (`detail: { reason, error }`):
  fired when the document has loaded or has failed to load. The reason is `network`, `invalid`
  or `password`.

Application controls go into the `toolbar-actions` slot. They show in the toolbar, before the
built-in buttons, in DOM order:

```html
<vaadin-pdf-viewer src="/files/contract.pdf">
  <vaadin-button slot="toolbar-actions">Approve</vaadin-button>
</vaadin-pdf-viewer>
```

The viewer has a default height of 400px. Set its `height` to fit your layout.

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

## Content Security Policy

The viewer works under this policy. The build check in `test/build-check/` verifies it in
Chromium, Firefox and WebKit:

```
default-src 'self'; script-src 'self'; worker-src 'self'; img-src 'self' blob: data:; style-src 'self' 'unsafe-inline'; font-src 'self' data:; connect-src 'self'
```

- **`worker-src`**: allow the origin of the worker script, a file of the application bundle.
- **`connect-src`**: allow the origins of the PDF documents.
- **`img-src blob:`**: printing shows the pages as `blob:` images.
- **`img-src data:` and `font-src data:`**: the icons of the viewer and the Lumo icon font use `data:` URLs.
- **`script-src`**: the viewer needs no `'unsafe-eval'` and no `'unsafe-inline'`. It also needs no
  `'wasm-unsafe-eval'`, as it loads no WebAssembly decoders yet, see [Known limitations](#known-limitations).
- **`style-src`**: needs `'unsafe-inline'`, the platform-wide requirement for Vaadin components today.
  See https://github.com/vaadin/web-components/issues/8031 and https://github.com/vaadin/platform/issues/9488.
- **Worker**: the worker takes its policy from the response headers of its own script, not from
  the page. Send the policy with the worker script too.
- **`connect-src blob:`**: add it when `src` is a `blob:` URL, for example a preview of an upload.
- **Trusted Types**: `require-trusted-types-for 'script'` blocks `new Worker(url)`, so the viewer
  cannot start its worker. Add a default policy that allows the URL of the worker script.

## Requests

- The viewer requests a document with one GET request. It does not use range requests, even
  when the server supports them.
- `download()` and `print()` use the loaded bytes and send no new request. A URL that serves
  the file only once therefore works.
- The first document also loads the pdf.js library and its worker script.

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

## What view-only can and cannot prevent

Hiding the download and print buttons only removes the actions of the viewer. It cannot stop
users from keeping a copy of the document:

- The browser has the bytes of the document, and users can save them with the developer tools.
- Users can take screenshots.
- The print command of the browser prints the page with the visible part of the document.
- Users can select and copy the text.

## Browser support

PDF Viewer requires Safari and iOS Safari 18 or newer while it is experimental. This is one
version above the general Vaadin minimum, because pdf.js does not support older Safari
versions. Other browsers are supported as for all Vaadin components (latest Chrome, Edge and Firefox).

## Install size

- The package depends on `pdfjs-dist`, which takes about 35 MB unpacked. Only the parts that the
  viewer imports go into the browser bundle.
- `pdfjs-dist` has an optional dependency, `@napi-rs/canvas`, with native binaries of about
  30 MB. pdf.js uses it only in Node.js, and it is not part of the browser bundle. To skip it,
  install with `npm i --omit=optional`.
- `pdfjs-dist` declares Node.js 22.13 or newer.

## Known limitations

- The viewer passes no runtime assets to pdf.js yet. Documents with JBIG2 or CCITT scans, JPX
  images or non-embedded CJK, Symbol and ZapfDingbats fonts therefore show degraded content. A
  later version adds an `assetsUrl` property for these assets.
- Password-protected documents, form filling, annotations and PDF JavaScript are not supported.
  Documents that need a password to open fire `document-error` with the reason `password`.
  Encrypted documents without a password to open work.
- Form fields and signatures show their appearance, read only. The viewer does not check
  signatures. `download()` saves the original bytes, so signatures stay intact.
- Pages show in one continuous vertical list. There are no single page, spread or rotation modes.
  The rotation that a page sets in the document applies.
- To keep memory use low, only the pages near the visible area are rendered and have
  selectable text. Screen readers in browse mode therefore only reach the text near the view.
  The find of the browser (outside the viewer) also only searches those pages. The find of the
  viewer (Ctrl+F or Cmd+F inside the viewer) searches the whole document.
- Find does not find words that are hyphenated at a line break.
- Untagged PDFs are read in content order. This may not be the reading order of multi-column
  layouts. They have no headings, lists or tables for assistive technology.
- Tagged PDFs expose headings, lists, tables, languages and figure alternative text. Not
  supported: MathML formulas, references from table cells to their headers (`/Headers`), and
  the positions of figures. The structure uses `aria-owns`, which Safari supports only partly
  in shadow DOM.
- Scanned PDFs without text cannot be read by screen readers or searched (no OCR).
- Documents with optional content (layers) show their default layers on screen and their print
  layers in print. There is no layer panel. Find and text selection also reach the text of
  hidden layers.
- PDF page labels, for example "iv", are not used. Pages are named by their number.
- In forced colors mode, the page content keeps its own colors. Page borders, focus rings and
  find highlights adapt.
- `page-width` and `page-fit` fit the first page. Pages wider than it, for example a landscape
  page in a portrait document, scroll horizontally.
- With the header shown and large text, a viewer below about 400px high cuts off the buttons
  of the find bar.

## Migration from the VCF PDF Viewer add-on

`<vaadin-pdf-viewer>` is not API compatible with `<vcf-pdf-viewer>`. This table maps the add-on
API to the new one.

| VCF PDF Viewer                                                     | PDF Viewer                                                         |
| ------------------------------------------------------------------ | ------------------------------------------------------------------ |
| `src`                                                              | `src`, a URL string                                                |
| `zoom`: `"auto"`, `"page-fit"` or a number as a string             | `zoom`: `"page-width"` (default), `"page-fit"` or a number         |
| `currentPage` (string), `setCurrentPage(page)`                     | `page` (number)                                                    |
| `currentPage-changed` event                                        | `page-changed` event, `detail.value`                               |
| `document-loaded` event, `detail.document` (pdf.js document)       | `document-load` event, `detail.pageCount` and `detail.title`       |
| No error event                                                     | `document-error` event, `detail.reason` and `detail.error`         |
| `thumbnail-clicked` event                                          | `page-changed` event                                               |
| `customTitle`                                                      | `headerTitle`, shown with `headerVisible`                          |
| `toolbarOnlyFilename`                                              | No equivalent. Set `headerTitle` or `fileName` to the file name.   |
| `autoZoomOptionLabel`, `fitZoomOptionLabel`                        | `i18n.pageWidth`, `i18n.pageFit`                                   |
| `sidebarToggleTooltip`, `previousPageTooltip`, `nextPageTooltip`   | `i18n.sidebar`, `i18n.previousPage`, `i18n.nextPage`               |
| Private `__openSidebar()`, `__closeSidebar()`                      | `sidebarOpened` and the `sidebar-opened-changed` event             |
| `hideZoom`                                                         | No equivalent                                                      |
| `renderInteractiveForms`                                           | No equivalent. Form fields show their appearance, read only.       |
| `rotateCw()`, `rotateCcw()`                                        | No equivalent                                                      |
| Default slot of the toolbar                                        | `toolbar-actions` slot                                             |
| Download button of the Flow add-on                                 | Built-in download button, `downloadButtonHidden`, `download()`     |
| Print button of the Flow add-on, off by default                    | Built-in print button, `printButtonHidden`, `print()`              |
| `--pdf-viewer-*` CSS custom properties                             | `--vaadin-pdf-viewer-*` CSS custom properties                      |
| Parts `toolbar`, `sidebar-container`, `thumbnail-view`, `viewer-container` | Parts `toolbar`, `sidebar`, `thumbnails`, `content`        |

## Contributing

Read the [contributing guide](https://vaadin.com/docs/latest/contributing) to learn about our development process, how to propose bugfixes and improvements, and how to test your changes to Vaadin components.

## License

This program is available under Vaadin Commercial License and Service Terms. For license terms, see LICENSE.

Vaadin collects usage statistics at development time to improve this product.
For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
