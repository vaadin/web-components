# &lt;vaadin-form-layout&gt;

[Live Demo ↗](https://vaadin.com/components/vaadin-form-layout/html-examples)
|
[API documentation ↗](https://vaadin.com/components/vaadin-form-layout/html-api)

[&lt;vaadin-form-layout&gt;](https://vaadin.com/components/vaadin-form-layout) is a Web Component providing configurable responsive layout for form elements, part of the [Vaadin components](https://vaadin.com/components).

[![npm version](https://badgen.net/npm/v/@vaadin/vaadin-form-layout)](https://www.npmjs.com/package/@vaadin/vaadin-form-layout)
[![Published on Vaadin Directory](https://img.shields.io/badge/Vaadin%20Directory-published-00b4f0.svg)](https://vaadin.com/directory/component/vaadinvaadin-form-layout)
[![Discord](https://img.shields.io/discord/732335336448852018?label=discord)](https://discord.gg/PHmkCKC)

```html
<vaadin-form-layout>
  <vaadin-text-field label="First Name" value="Jane"></vaadin-text-field>
  <vaadin-text-field label="Last Name" value="Doe"></vaadin-text-field>
  <vaadin-text-field label="Email" value="jane.doe@example.com"></vaadin-text-field>
</vaadin-form-layout>
```

[<img src="https://raw.githubusercontent.com/vaadin/vaadin-form-layout/master/screenshot.png" width="880" alt="Screenshot of vaadin-form-layout">](https://vaadin.com/components/vaadin-form-layout)

## Installation

Install `vaadin-form-layout`:

```sh
npm i @vaadin/vaadin-form-layout --save
```

Once installed, import it in your application:

```js
import '@vaadin/vaadin-form-layout/vaadin-form-layout.js';
```

## Getting started

Vaadin components use the Lumo theme by default.

To use the Material theme, import the correspondent file from the `theme/material` folder.

## Entry points

- The components with the Lumo theme:

  `theme/lumo/vaadin-form-layout.js`
  `theme/lumo/vaadin-form-item.js`

- The components with the Material theme:

  `theme/material/vaadin-form-layout.js`
  `theme/material/vaadin-form-item.js`

- Alias for `theme/lumo/vaadin-form-layout.js`
  `theme/lumo/vaadin-form-item.js`:

  `vaadin-form-layout.js`
  `vaadin-form-item.js`

## Contributing

Read the [contributing guide](https://vaadin.com/docs/latest/guide/contributing/overview) to learn about our development process, how to propose bugfixes and improvements, and how to test your changes to Vaadin components.

## License

Apache License 2.0

Vaadin collects development time usage statistics to improve this product. For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
