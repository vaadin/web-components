# &lt;vaadin-upload&gt;

[Live Demo ↗](https://vaadin.com/components/vaadin-upload/html-examples/upload-basic-demos)
|
[API documentation ↗](https://vaadin.com/components/vaadin-upload/html-api)

[&lt;vaadin-upload&gt;](https://vaadin.com/components/vaadin-upload) is a Web Component for uploading files, part of the [Vaadin components](https://vaadin.com/components).

[![npm version](https://badgen.net/npm/v/@vaadin/vaadin-upload)](https://www.npmjs.com/package/@vaadin/vaadin-upload)
[![Published on Vaadin Directory](https://img.shields.io/badge/Vaadin%20Directory-published-00b4f0.svg)](https://vaadin.com/directory/component/vaadinvaadin-upload)
[![Discord](https://img.shields.io/discord/732335336448852018?label=discord)](https://discord.gg/PHmkCKC)

```html
<vaadin-upload accept=".pdf">
  <span slot="drop-label">Drop your favourite Novels here (PDF files only)</span>
</vaadin-upload>
```

[<img src="https://raw.githubusercontent.com/vaadin/vaadin-upload/master/screenshot.png" alt="Screenshot of vaadin-upload" width="670" />](https://vaadin.com/components/vaadin-upload)

## Installation

Install `vaadin-upload`:

```sh
npm i @vaadin/vaadin-upload --save
```

Once installed, import it in your application:

```js
import '@vaadin/vaadin-upload/vaadin-upload.js';
```

## Getting started

Vaadin components use the Lumo theme by default.

To use the Material theme, import the correspondent file from the `theme/material` folder.

## Entry points

- The component with the Lumo theme:

  `theme/lumo/vaadin-upload.js`

- The component with the Material theme:

  `theme/material/vaadin-upload.js`

- Alias for `theme/lumo/vaadin-upload.js`:

  `vaadin-upload.js`

## Contributing

Read the [contributing guide](https://vaadin.com/docs/latest/guide/contributing/overview) to learn about our development process, how to propose bugfixes and improvements, and how to test your changes to Vaadin components.

## License

Apache License 2.0

Vaadin collects development time usage statistics to improve this product. For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
