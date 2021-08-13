# &lt;vaadin-list-box&gt;

[Live Demo ↗](https://vaadin.com/components/vaadin-list-box/html-examples)
|
[API documentation ↗](https://vaadin.com/components/vaadin-list-box/html-api)

[&lt;vaadin-list-box&gt;](https://vaadin.com/components/vaadin-list-box) is a Web Component providing reusable list boxes, part of the [Vaadin components](https://vaadin.com/components).

[![npm version](https://badgen.net/npm/v/@vaadin/vaadin-list-box)](https://www.npmjs.com/package/@vaadin/vaadin-list-box)
[![Published on Vaadin Directory](https://img.shields.io/badge/Vaadin%20Directory-published-00b4f0.svg)](https://vaadin.com/directory/component/vaadinvaadin-list-box)
[![Discord](https://img.shields.io/discord/732335336448852018?label=discord)](https://discord.gg/PHmkCKC)

```html
<vaadin-list-box selected="2">
  <b>Select an Item</b>
  <vaadin-item>Item one</vaadin-item>
  <vaadin-item>Item two</vaadin-item>
  <hr />
  <vaadin-item>Item three</vaadin-item>
  <vaadin-item>Item four</vaadin-item>
</vaadin-list-box>
```

[<img src="https://raw.githubusercontent.com/vaadin/vaadin-list-box/master/screenshot.png" width="150" alt="Screenshot of vaadin-list-box">](https://vaadin.com/components/vaadin-list-box)

## Installation

Install `vaadin-list-box`:

```sh
npm i @vaadin/vaadin-list-box --save
```

Once installed, import it in your application:

```js
import '@vaadin/vaadin-list-box/vaadin-list-box.js';
```

## Getting started

Vaadin components use the Lumo theme by default.

To use the Material theme, import the correspondent file from the `theme/material` folder.

## Entry points

- The component with the Lumo theme:

  `theme/lumo/vaadin-list-box.js`

- The component with the Material theme:

  `theme/material/vaadin-list-box.js`

- Alias for `theme/lumo/vaadin-list-box.js`:

  `vaadin-list-box.js`

## Contributing

Read the [contributing guide](https://vaadin.com/docs/latest/guide/contributing/overview) to learn about our development process, how to propose bugfixes and improvements, and how to test your changes to Vaadin components.

## License

Apache License 2.0

Vaadin collects development time usage statistics to improve this product. For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
