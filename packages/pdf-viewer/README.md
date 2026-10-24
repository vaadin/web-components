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
- `assetsUrl`: the URL of a folder with the fonts, character maps and decoders of pdf.js, see
  [pdf.js assets](#pdfjs-assets).
- `findButtonHidden`, `downloadButtonHidden` and `printButtonHidden`: hide the built-in buttons.
  The methods keep working.
- `i18n`: the texts of the component, for localization.
- `find(text)`: opens the find bar, finds the text in the whole document and fires `find-result`
  (`detail: { query, matchCount }`).
- `highlight(page, text)`: highlights a passage that the application has located, and scrolls to it.
- `download()`: saves the document. `print()`: prints it, see [Printing](ARCHITECTURE.md#printing).
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

[ARCHITECTURE.md](ARCHITECTURE.md) covers the internals: the worker and bundlers, requests,
printing, touch devices and install size. It also maps the API of the VCF PDF Viewer add-on.

## pdf.js assets

Some documents need extra files of pdf.js: fonts, character maps and image decoders. The viewer
does not serve these files. Serve them in your application and set `assetsUrl` to their folder:

```html
<vaadin-pdf-viewer src="/files/report.pdf" assets-url="/pdfjs-dist/"></vaadin-pdf-viewer>
```

- Copy these folders of `node_modules/pdfjs-dist/` into the folder of `assetsUrl`:
  - `cmaps/`: character maps for CJK text with predefined encodings.
  - `standard_fonts/`: the Symbol and ZapfDingbats fonts, and replacements for other standard
    fonts that a document does not embed.
  - `wasm/`: decoders for JPEG 2000, JBIG2 and CCITT images and for ICC color profiles.
  - `iccs/`: the ICC profile for CMYK colors.
- Copy the folders again after each update of the viewer. They must match the version of
  `pdfjs-dist` that the viewer depends on.
- With Vite, copy the folders into `public/pdfjs-dist/` and set `assetsUrl` to `/pdfjs-dist/`.
  Vite serves the `public/` folder at the root of the application:

  ```sh
  mkdir -p public/pdfjs-dist
  cp -R node_modules/pdfjs-dist/{cmaps,standard_fonts,wasm,iccs} public/pdfjs-dist/
  ```

- `assetsUrl` is the base URL of the four folders. The viewer resolves a relative URL against
  the base URL of the page, and adds a missing trailing slash.
- A folder on another origin must send CORS headers, as pdf.js loads the files with CORS requests.
- A change of `assetsUrl` reloads the document.
- pdf.js runs the decoders of `wasm/` as code with the origin of the application. Set `assetsUrl`
  in the application code only. Never set it from user input, such as a URL parameter.

Without `assetsUrl`, the viewer passes no asset folders to pdf.js. Documents that need the
assets then show degraded content:

- Text in Symbol and ZapfDingbats fonts that the document does not embed uses system fonts, or
  wrong glyphs without them.
- CJK text that needs a predefined character map shows wrong or no characters.
- JPEG 2000, JBIG2 and CCITT images do not show. Scanned documents often use them.
- ICC-based and CMYK colors convert without ICC profiles and may look different.

## Content Security Policy

The viewer works under this policy. The build check in `test/build-check/` verifies it in
Chromium, Firefox and WebKit:

```
default-src 'self'; script-src 'self'; worker-src 'self'; img-src 'self' blob: data:; style-src 'self' 'unsafe-inline'; font-src 'self' data:; connect-src 'self'
```

- **`worker-src`**: allow the origin of the worker script, a file of the application bundle.
- **`connect-src`**: allow the origins of the PDF documents and of `assetsUrl`. The worker
  fetches the assets.
- **`img-src blob:`**: printing shows the pages as `blob:` images.
- **`img-src data:` and `font-src data:`**: the icons of the viewer and the Lumo icon font use `data:` URLs.
- **`font-src`**: allow the origin of `assetsUrl`. pdf.js loads fonts of `standard_fonts/` in the
  page when the system has no replacement for a font that the document does not embed.
- **`script-src`**: the viewer needs no `'unsafe-eval'` and no `'unsafe-inline'`. Allow the origin
  of `assetsUrl`. pdf.js loads JavaScript decoders from `wasm/` when it cannot use WebAssembly.
- **`'wasm-unsafe-eval'`**: optional. Add it to `script-src` so that pdf.js can use the
  WebAssembly decoders of `assetsUrl`. Without it, pdf.js uses slower JavaScript decoders for
  images and converts colors without ICC profiles. Chromium and Firefox then report a
  `wasm-eval` violation.
- **`style-src`**: needs `'unsafe-inline'`, the platform-wide requirement for Vaadin components today.
  See https://github.com/vaadin/web-components/issues/8031 and https://github.com/vaadin/platform/issues/9488.
- **Worker**: the worker takes its policy from the response headers of its own script, not from
  the page. Send the policy with the worker script too.
- **`connect-src blob:`**: add it when `src` is a `blob:` URL, for example a preview of an upload.
- **Trusted Types**: `require-trusted-types-for 'script'` blocks `new Worker(url)`, so the viewer
  cannot start its worker. Add a default policy that allows the URL of the worker script.

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

## Known limitations

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

## Contributing

Read the [contributing guide](https://vaadin.com/docs/latest/contributing) to learn about our development process, how to propose bugfixes and improvements, and how to test your changes to Vaadin components.

## License

This program is available under Vaadin Commercial License and Service Terms. For license terms, see LICENSE.

Vaadin collects usage statistics at development time to improve this product.
For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
