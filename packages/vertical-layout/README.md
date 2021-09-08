# &lt;vaadin-ordered-layout&gt;

[Live Demo ↗](https://vaadin.com/components/vaadin-ordered-layout/html-examples)
|
[API documentation ↗](https://vaadin.com/components/vaadin-ordered-layout/html-api)

[&lt;vaadin-ordered-layout&gt;](https://vaadin.com/components/vaadin-ordered-layout) consist of two Web Components providing a simple way to horizontally or vertically align your HTML elements, part of the [Vaadin components](https://vaadin.com/components).

[![npm version](https://badgen.net/npm/v/@vaadin/vaadin-ordered-layout)](https://www.npmjs.com/package/@vaadin/vaadin-ordered-layout)
[![Published on Vaadin Directory](https://img.shields.io/badge/Vaadin%20Directory-published-00b4f0.svg)](https://vaadin.com/directory/component/vaadinvaadin-ordered-layout)
[![Discord](https://img.shields.io/discord/732335336448852018?label=discord)](https://discord.gg/PHmkCKC)

```html
<vaadin-horizontal-layout>
  <div>Horizontally</div>
  <div>Aligned</div>
</vaadin-horizontal-layout>
<vaadin-vertical-layout>
  <div>Vertically</div>
  <div>Aligned</div>
</vaadin-vertical-layout>
```

[<img src="https://raw.githubusercontent.com/vaadin/vaadin-ordered-layout/master/screenshot.png" width="200" alt="Screenshot of vaadin-ordered-layout">](https://vaadin.com/components/vaadin-ordered-layout)

## Installation

Install `vaadin-ordered-layout`:

```sh
npm i @vaadin/vaadin-ordered-layout --save
```

Once installed, import it in your application:

```js
import '@vaadin/vaadin-ordered-layout/vaadin-vertical-layout.js';
```

## Getting started

Vaadin components use the Lumo theme by default.

To use the Material theme, import the correspondent file from the `theme/material` folder.

## Entry points

- The components with the Lumo theme:

  `theme/lumo/vaadin-horizontal-layout.js`
  `theme/lumo/vaadin-vertical-layout.js`

- The components with the Material theme:

  `theme/material/vaadin-horizontal-layout.js`
  `theme/material/vaadin-vertical-layout.js`

- Alias for `theme/lumo/vaadin-horizontal-layout.js`
  `theme/lumo/vaadin-vertical-layout.js`:

  `vaadin-horizontal-layout.js`
  `vaadin-vertical-layout.js`

## Contributing

Read the [contributing guide](https://vaadin.com/docs/latest/guide/contributing/overview) to learn about our development process, how to propose bugfixes and improvements, and how to test your changes to Vaadin components.

## License

Apache License 2.0
