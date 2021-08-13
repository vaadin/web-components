# &lt;vaadin-split-layout&gt;

[Live Demo ↗](https://vaadin.com/components/vaadin-split-layout/html-examples)
|
[API documentation ↗](https://vaadin.com/components/vaadin-split-layout/html-api)

[&lt;vaadin-split-layout&gt;](https://vaadin.com/components/vaadin-split-layout) is a Web Component implementing a split layout for two content elements with a draggable splitter between them, part of the [Vaadin components](https://vaadin.com/components).

[![npm version](https://badgen.net/npm/v/@vaadin/vaadin-split-layout)](https://www.npmjs.com/package/@vaadin/vaadin-split-layout)
[![Published on Vaadin Directory](https://img.shields.io/badge/Vaadin%20Directory-published-00b4f0.svg)](https://vaadin.com/directory/component/vaadinvaadin-split-layout)
[![Discord](https://img.shields.io/discord/732335336448852018?label=discord)](https://discord.gg/PHmkCKC)

```html
<vaadin-split-layout>
  <vaadin-split-layout orientation="vertical">
    <div>First layout content</div>
    <div>Second layout content</div>
  </vaadin-split-layout>
  <vaadin-split-layout orientation="vertical">
    <div>Third layout content</div>
    <div>Fourth layout content</div>
  </vaadin-split-layout>
</vaadin-split-layout>
```

[<img src="https://raw.githubusercontent.com/vaadin/vaadin-split-layout/master/screenshot.png" width="616" alt="Screenshot of vaadin-split-layout">](https://vaadin.com/components/vaadin-split-layout)

## Installation

Install `vaadin-split-layout`:

```sh
npm i @vaadin/vaadin-split-layout --save
```

Once installed, import it in your application:

```js
import '@vaadin/vaadin-split-layout/vaadin-split-layout.js';
```

## Getting started

Vaadin components use the Lumo theme by default.

To use the Material theme, import the correspondent file from the `theme/material` folder.

## Entry points

- The component with the Lumo theme:

  `theme/lumo/vaadin-split-layout.js`

- The component with the Material theme:

  `theme/material/vaadin-split-layout.js`

- Alias for `theme/lumo/vaadin-split-layout.js`:

  `vaadin-split-layout.js`

## Contributing

Read the [contributing guide](https://vaadin.com/docs/latest/guide/contributing/overview) to learn about our development process, how to propose bugfixes and improvements, and how to test your changes to Vaadin components.

## License

Apache License 2.0

Vaadin collects development time usage statistics to improve this product. For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
