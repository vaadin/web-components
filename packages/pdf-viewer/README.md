# @vaadin/pdf-viewer

A component for showing PDF documents, with page navigation, zoom, text selection, find,
page thumbnails, outline, download and print.

> ℹ️&nbsp; A commercial Vaadin [subscription](https://vaadin.com/pricing) is required to use PDF Viewer in your project.

> ⚠️&nbsp; PDF Viewer is experimental. Its API may change in minor versions.

[![npm version](https://badgen.net/npm/v/@vaadin/pdf-viewer)](https://www.npmjs.com/package/@vaadin/pdf-viewer)

```html
<vaadin-pdf-viewer src="/files/report.pdf"></vaadin-pdf-viewer>
```

## Installation

Install the component:

```sh
npm i @vaadin/pdf-viewer
```

To try the latest prototype snapshot, install it with the `dev-discovery` tag:

```sh
npm i @vaadin/pdf-viewer@dev-discovery
```

Enable the feature flag before the component is loaded, then import it:

```js
window.Vaadin ??= {};
window.Vaadin.featureFlags ??= {};
window.Vaadin.featureFlags.pdfViewerComponent = true;
```

```js
import '@vaadin/pdf-viewer';
```

## Usage

```html
<vaadin-pdf-viewer
  src="/files/report.pdf"
  zoom="page-fit"
  sidebar-opened
  aria-label="Quarterly report"
></vaadin-pdf-viewer>
```

- `src`: the URL of the document. Range requests are used when the server supports them.
  Changing it loads the new document and goes back to page 1, unless `page` is set together with it.
- `page`: the current page, starting from 1. Updated while scrolling (`page-changed`), and
  scrolls to the page when set.
- `zoom`: `page-width` (default), `page-fit`, or a number (`1` for 100%). Fires `zoom-changed`.
- `sidebarOpened`: shows the sidebar with page thumbnails and, when the document has one, its
  outline. Fires `sidebar-opened-changed`.
- `fileName`: the name of a downloaded file. Defaults to the name in `src`, or the document title.
- `print()`: prints the document.
- `i18n`: the texts of the component, for localization.
- Events: `document-load` (`detail: { pageCount, title }`), `document-error`
  (`detail: { reason: 'network' | 'invalid' | 'password', error }`).

The viewer has a default height of 400px. Set its `height` to fit your layout.

## Setup notes

- **pdf.js:** the component uses [pdf.js](https://mozilla.github.io/pdf.js/) (legacy build).
  It is only loaded when a `src` is first set, so importing the component costs little.
- **Worker:** pdf.js runs in a module worker that the component creates from a file in this
  package (`new Worker(new URL('...', import.meta.url), { type: 'module' })`). This works with
  Vite (dev server and production build) without configuration. Other bundlers must support
  module workers created with `new URL(..., import.meta.url)`.
- **Content Security Policy:** the worker is a same-origin script (`worker-src 'self'`).
  Downloading and printing use `blob:` URLs, and printing shows them as images
  (`img-src blob:`). Inline scripts and styles are not needed.
- **Install size:** pdf.js (`pdfjs-dist`) has an optional dependency, `@napi-rs/canvas`, which is
  only used when pdf.js runs in Node.js. npm installs it by default (native binaries of about
  36 MB); it is not part of the browser bundle. `pdfjs-dist` declares Node.js 22.13 or newer.
- **Fonts and images:** the CMaps, standard fonts and WebAssembly decoders of pdf.js are not
  shipped. Fonts that are not embedded in a PDF use the browser's fonts. Some JPEG 2000 and
  JBIG2 images decode more slowly.
- **Security:** PDF JavaScript and XFA forms are disabled. Only `http:`, `https:` and `mailto:`
  links are opened, in a new tab without access to the page.

## Browser support

PDF Viewer requires Safari and iOS Safari 18 or newer, one version above the general Vaadin
minimum, because pdf.js does not support older Safari versions. Other browsers as for all
Vaadin components (latest Chrome, Edge and Firefox).

## Known limitations

- Password-protected documents, form filling, annotations and PDF JavaScript are not
  supported. Documents that need a password to open fire `document-error` with the reason
  `password`. Encrypted documents without a password to open work.
- Pages are shown in one continuous vertical list. There are no single page, spread or
  rotation modes.
- To keep memory use low, only the pages near the visible area are rendered and have
  selectable text. Screen readers in browse mode therefore only reach the text near the view,
  and the browser's own find (outside the viewer) only searches those pages. The viewer's find
  (Ctrl/Cmd+F inside the viewer) searches the whole document.
- Words hyphenated at a line break are not found by find.
- Untagged PDFs are read in content order, which may not be the reading order of
  multi-column layouts, and have no headings, lists or tables for assistive technology.
- Tagged PDFs expose headings, lists, tables, languages and figure alternative text. Not
  supported: MathML formulas, references from table cells to their headers (`/Headers`), and
  the positions of figures. The structure uses `aria-owns`, which Safari supports only partly
  in shadow DOM.
- Scanned PDFs without text cannot be read by screen readers or searched (no OCR).
- PDF page labels (e.g. "iv") are not used. Pages are named by their number.
- In forced colors mode, the page content keeps its own colors. Page borders, focus rings and
  find highlights adapt.
- `page-width` and `page-fit` fit the first page. Pages wider than it, e.g. a landscape page in
  a portrait document, scroll horizontally.

## Contributing

Read the [contributing guide](https://vaadin.com/docs/latest/contributing) to learn about our development process, how to propose bugfixes and improvements, and how to test your changes to Vaadin components.

## License

This program is available under Vaadin Commercial License and Service Terms. For license terms, see LICENSE.

Vaadin collects usage statistics at development time to improve this product.
For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
