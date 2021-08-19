# &lt;vaadin-radio-button&gt;

[Live Demo ↗](https://vaadin.com/components/vaadin-radio-button/html-examples)
|
[API documentation ↗](https://vaadin.com/components/vaadin-radio-button/html-api)

[&lt;vaadin-radio-button&gt;](https://vaadin.com/components/vaadin-radio-button) is a Web Component providing an accessible and customizable radio button, part of the [Vaadin components](https://vaadin.com/components).

[![npm version](https://badgen.net/npm/v/@vaadin/vaadin-radio-button)](https://www.npmjs.com/package/@vaadin/vaadin-radio-button)
[![Published on Vaadin Directory](https://img.shields.io/badge/Vaadin%20Directory-published-00b4f0.svg)](https://vaadin.com/directory/component/vaadinvaadin-radio-button)
[![Discord](https://img.shields.io/discord/732335336448852018?label=discord)](https://discord.gg/PHmkCKC)

```html
<vaadin-radio-group name="radio-group" value="bar">
  <vaadin-radio-button value="foo">Foo</vaadin-radio-button>
  <vaadin-radio-button value="bar">Bar</vaadin-radio-button>
  <vaadin-radio-button value="baz">Baz</vaadin-radio-button>
</vaadin-radio-group>
```

[<img src="https://raw.githubusercontent.com/vaadin/vaadin-radio-button/master/screenshot.png" width="237" alt="Screenshot of vaadin-radio-group">](https://vaadin.com/components/vaadin-radio-button)

## Installation

Install `vaadin-radio-button`:

```sh
npm i @vaadin/vaadin-radio-button --save
```

Once installed, import it in your application:

```js
import '@vaadin/vaadin-radio-button/vaadin-radio-button.js';
```

## Getting started

Vaadin components use the Lumo theme by default.

To use the Material theme, import the correspondent file from the `theme/material` folder.

## Entry points

- The components with the Lumo theme:

  `theme/lumo/vaadin-radio-button.js`
  `theme/lumo/vaadin-radio-group.js`

- The components with the Material theme:

  `theme/material/vaadin-radio-button.js`
  `theme/material/vaadin-radio-group.js`

- Alias for `theme/lumo/vaadin-radio-button.js`
  `theme/lumo/vaadin-radio-group.js`:

  `vaadin-radio-button.js`
  `vaadin-radio-group.js`

## Contributing

Read the [contributing guide](https://vaadin.com/docs/latest/guide/contributing/overview) to learn about our development process, how to propose bugfixes and improvements, and how to test your changes to Vaadin components.

## License

Apache License 2.0

Vaadin collects development time usage statistics to improve this product. For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
