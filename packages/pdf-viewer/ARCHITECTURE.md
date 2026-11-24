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
- `page` is read-only. A new `src` resets it to 1. The application goes to a page with `scrollToPage()`,
  which goes to the first or the last page for a page outside the document.
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
- `PdfViewerRenderMixin` owns the page views, their sizes, the render queue and the device pixel ratio. It calls `_pageSizesChanged()` at most once per frame when pages get their own size, and `_pixelRatioChanged()` when the device pixel ratio changes.
- `PdfViewerScrollMixin` owns the scale `_scale`, the anchor, the visible pages and `page`. It asks for
  rendering only with `_renderVisible()` and `_cancelRender()`. It gets the scale from `_getScaleForSize()`, which
  fits the width of the current page by default.
- `PdfViewerZoomMixin` owns `zoom`. It writes no render or scroll state:
  - It overrides `_getScaleForSize()` to return the scale for `zoom`.
  - It calls `_refreshLayout()` when `zoom` changes.
  - Its `_zoomFactor` getter reads `_scale`, in units of the actual page size.
- `PdfViewerTextLayerMixin` renders the text layer of each rendered page and sets the document language on the
  pages. A page loads its text each time it renders, as pdf.js' own viewer does.
  - The page renders the structure of a tagged PDF right after its text layer, as pdf.js' own viewer does.
    The structure has no state of the viewer, so it has no mixin.
  - Unlike in pdf.js, `renderTextLayer()` waits for the structure. The links mixin names the links by the
    structure right after their layer renders, so `render-idle` comes once the links have their final names.
- `PdfViewerLinksMixin` adds the links of each rendered page and follows internal links with `_scrollToPage()`.
  - The page adds the links to the structure or to the text once both the structure and the links have rendered.
    A page without structure counts as rendered once its text layer has rendered.
- After a page canvas renders, `PdfViewerRenderMixin` awaits `_renderPageLayers(page)`. Each override awaits
  `super` first, so the layers render in the order of the mixins: text and structure, then links.
- The page view owns the DOM of a page. A Lit template renders the canvas, the text layer and the link layer
  in this order, as pdf.js does. Screen readers read the structure in the canvas first.
  - `PdfViewerTextLayer` and `PdfViewerLinkLayer` render the content of their layer. The template of the page
    view renders their elements.
  - The layers can render in any order. One method of the page view connects them. It puts the structure in the
    canvas. It passes the links that the structure owns to the structure, and the other links to the text layer.
  - A release aborts the signal of the page. The page view checks it after each await, so a released page
    gets no layers. The text layer also checks it before it loads the text.
  - The render queue renders a page again only once its layers are done. One signal therefore covers the time
    between two releases.
- `PdfViewerKeyboardMixin` handles the keyboard shortcuts.
- `PdfViewerSidebarMixin` adds `sidebarOpened`, `sidebarButtonHidden`, the sidebar button and the sidebar with the page thumbnails.
  - `PdfViewerThumbnailsController` fills the sidebar with a thumbnail for each page. It renders the thumbnails
    near the visible part of the list one at a time, apart from the render queue of the pages.
  - A thumbnail can render at the same time as a page. The pdf.js viewer renders thumbnails only while no page waits.
  - The thumbnails are created when the sidebar first opens for a document, so a closed sidebar costs nothing.
  - Rendering stops while the sidebar is hidden. When it shows again, the thumbnails that left the view are released.
  - A thumbnail frees the pdf.js data of its page once it has rendered, unless the pages hold that page, as in the
    pdf.js viewer. The canvas keeps the image. The pages free the data of a page when they release it.
  - A viewer narrower than three times `--vaadin-pdf-viewer-sidebar-width` shows the sidebar over the pages.
    The default threshold is 30rem. `ResizeMixin` updates the mode when the viewer resizes, not when only the
    sidebar width changes. A hidden viewer keeps its mode.
  - In the overlay mode, the sidebar is positioned absolutely at the start side, also in RTL. The pages keep their
    width, so they do not render again.
  - A wide viewer that becomes narrow closes the sidebar, and opens it again once wide, as the drawer of
    `vaadin-app-layout` does. The first mode keeps the open state, so a viewer that is narrow from the start
    shows an open sidebar over the pages, whether it was opened before or after attach.
  - While the sidebar shows over the pages, the pages are `inert`, so focus stays in the toolbar and the sidebar.
    When the sidebar opens while the pages have focus, focus moves to the current thumbnail.
  - A transparent backdrop over the pages takes the clicks on them and closes the sidebar.
  - Escape closes the sidebar only from the sidebar or its button. Escape from other toolbar controls, such as
    the zoom select, leaves the sidebar open. The handler calls `preventDefault()`, so a surrounding dialog stays open.
  - A chosen thumbnail closes the sidebar in the overlay mode.
- `PdfViewerToolbarMixin` renders the header and the toolbar. Its controls are in the light DOM, so a theme
  styles the page field like any other `vaadin-integer-field`. The `slotContent()` directive renders them, so
  application children added later keep their place.
  - The header is a button in the shadow DOM that collapses and expands the toolbar. It shows `headerTitle`,
    else `_getDocumentName()` of the document mixin, the name that downloads also use.
  - The controls call the methods of the inner mixins, for example `_scrollToPage()`, `_stepZoom()` and
    `download()`.
  - Each icon button is a `vaadin-button` with the `tertiary icon` theme. Themes style it like any other
    `vaadin-button`, so a theme needs no rules for a new tag name.
  - The icon of a button is a `vaadin-pdf-viewer-icon` child. Its `icon` attribute selects the image, and its
    shadow root lets a theme replace the image.
  - Each icon button is named after its tooltip text: its `vaadin-tooltip` has the `ariaLinkMode` property set to
    `aria-labelledby`. A new button needs the same, and no `aria-label`. Bind the property, not the
    `aria-link-mode` attribute: it is not a real ARIA attribute, so a11y checkers such as axe (`aria-valid-attr`)
    flag it in the DOM.
  - The download button is after `toolbar-actions`. To replace it, an application hides it with
    `downloadButtonHidden` and adds its own button that calls `download()` to `toolbar-actions`.
- The element applies `I18nMixin` and defines the default texts. The mixins read them from `__effectiveI18n`.
- The element applies `FocusMixin` and owns the focus state. Listeners on the page area in its template set
  `focused` and `focus-ring`, as focus moving inside the shadow root does not reach listeners on the host.
- The mixins move focus to the pages with `_focusPages()` of `PdfViewerRenderMixin`, such as after a followed
  link. It keeps the scroll position, and shows the focus ring only after a key press.
- `PdfViewerRenderQueue` decides the render order, the memory budget and the release. It has no host
  reference, and its limits are options.
- `pdf-viewer-layout.js` has the layout math without DOM access: visible pages, anchor and fit scale.
- `pdf-viewer-zoom-utils.js` has the zoom levels, their format and the check of a `zoom` value.
- To check whether a result belongs to the current document, a mixin compares `_pdfDocument` with the
  document from the start of the call.

## Text and links

- The text layer of pdf.js puts transparent text over the canvas. Users can select it, and screen readers
  read it.
- Pages that lose their canvas also lose their text layer, structure and link layer. Screen readers
  therefore reach only the text near the view.
- Links are in their own layer over the text layer. Each link is named after the first of these that it has:
  - the alternative text that the structure gives it, or the figure that it only shows
  - the text it covers, or the text it owns in the structure when that holds the text it covers
  - its URL, or the page it goes to
- Only `http:`, `https:` and `mailto:` links open, in a new tab without access to the viewer.
- Links on layers that the document hides are left out, as in pdf.js.
- A link that wraps to the next line is clickable only on its words, which the `QuadPoints` of the annotation
  give. Its focus ring goes around these words.
- Tagged PDFs have a structure of headings, lists, tables and figures. As in pdf.js, an element tree in the
  canvas exposes it to screen readers. Its elements own the text layer elements with `aria-owns`.
- The canvas has the `presentation` role, so that its content stays visible to screen readers. Each new
  canvas of the page gets the tree.
- Outside of the canvas, VoiceOver in Safari finds no tables of the tree, and its cursor outlines the whole page.
  The elements of the tree then have the size of an empty span, not the size of the text that they own.
- Elements of the tree that are blocks in HTML, such as headings and paragraphs, have `display: block`.
  NVDA starts a new line at them. Otherwise, it reads a heading and the next paragraph as one line.
- The structure owns the text elements in marked content, not the marked content itself. Marked content has
  `display: contents`, and Chrome ignores `aria-owns` of such elements. Artifacts, such as page numbers, stay hidden.
- The links mixin names all links. It uses the alternative text that the structure gives a link, as in pdf.js.
  The structure element keeps its alternative text until its link renders, so it keeps it when the links fail.
- A link without alternative text that shows only a figure gets the alternative text of the figure, as pdf.js
  names a link by its content. The link then takes the place of the figure, so the alternative text is read once.
  A link that also shows text is named by its text, so its name holds what it shows.
- Chromium writes an annotation for each line of a link, and for the line and the image of a linked image.
  The annotations of one structure element render as one link, with an area for each annotation, as the
  quadrilaterals of a link that wraps. When the structure renders after the links, the links stay apart.
- A link that covers no text, such as a thin link in a table of contents, gets the text that it owns in the
  structure as its name. In pdf.js, this text names such a link, as pdf.js gives it no name.
- As in pdf.js, a link of the structure owns the text of its structure element. Other links are added to the
  text before them, so screen readers read them in the order of the text. They skip the text that a link owns,
  as a link in a link is invalid.
- Unlike in pdf.js, a `Link` element of the structure has no role, so that only its link is a link. Without a
  link, such as on a hidden layer, screen readers read its text as text.
- Unlike in pdf.js, a `NonStruct` element of the structure has no role. In the canvas, VoiceOver in Safari reads
  no text under an element with the `none` role.
- When a focused link loses its page, focus moves to the page area.

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
