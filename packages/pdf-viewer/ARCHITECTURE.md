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
