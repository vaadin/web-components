# @vaadin/pdf-viewer

A web component for viewing PDF documents.

> ℹ️&nbsp; A commercial Vaadin [subscription](https://vaadin.com/pricing) is required to use PDF Viewer in your project.

> ⚠️&nbsp; PDF Viewer is experimental. Its API may change in minor versions. To use it, enable the `pdfViewerComponent` feature flag.

[![npm version](https://badgen.net/npm/v/@vaadin/pdf-viewer)](https://www.npmjs.com/package/@vaadin/pdf-viewer)

```html
<vaadin-pdf-viewer></vaadin-pdf-viewer>
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

## Known limitations

- To keep memory use low, only the pages near the visible area are rendered and have
  selectable text. Screen readers in browse mode therefore only reach the text near the view.
- Untagged PDFs are read in content order. This may not be the reading order of multi-column
  layouts. They have no headings, lists or tables for assistive technology.
- Tagged PDFs expose headings, lists, tables, languages and figure alternative text. Not
  supported: MathML formulas, references from table cells to their headers (`/Headers`), and
  the positions of figures. The structure uses `aria-owns`, which Safari supports only partly
  in shadow DOM.
- The viewer passes no runtime assets to pdf.js yet. Documents with JBIG2 or CCITT scans, JPX
  images or non-embedded CJK, Symbol and ZapfDingbats fonts therefore show degraded content. A
  later version adds an `assetsUrl` property for these assets.
- Scanned PDFs without text cannot be read by screen readers (no OCR).

## Contributing

Read the [contributing guide](https://vaadin.com/docs/latest/contributing) to learn about our development process, how to propose bugfixes and improvements, and how to test your changes to Vaadin components.

## License

This program is available under Vaadin Commercial License and Service Terms. For license terms, see LICENSE.

Vaadin collects usage statistics at development time to improve this product.
For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
