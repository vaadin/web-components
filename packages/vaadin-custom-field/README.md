# &lt;vaadin-custom-field&gt;

[&lt;vaadin-custom-field&gt;](https://vaadin.com/components/vaadin-custom-field) is a Web Component providing field wrapper functionality, part of the [Vaadin components](https://vaadin.com/components).

[Live Demo ↗](https://vaadin.com/components/vaadin-custom-field/html-examples)
|
[API documentation ↗](https://vaadin.com/components/vaadin-custom-field/html-api)

[![npm version](https://badgen.net/npm/v/@vaadin/vaadin-custom-field)](https://www.npmjs.com/package/@vaadin/vaadin-custom-field)
[![Published on Vaadin Directory](https://img.shields.io/badge/Vaadin%20Directory-published-00b4f0.svg)](https://vaadin.com/directory/component/vaadinvaadin-custom-field)
[![Discord](https://img.shields.io/discord/732335336448852018?label=discord)](https://discord.gg/PHmkCKC)

```html
<vaadin-custom-field label="Appointment time">
  <vaadin-date-picker></vaadin-date-picker>
  <vaadin-time-picker></vaadin-time-picker>
</vaadin-custom-field>
```

[<img src="https://raw.githubusercontent.com/vaadin/vaadin-custom-field/master/screenshot.png" width="200" alt="Screenshot of vaadin-custom-field">](https://vaadin.com/components/vaadin-custom-field)

## Installation

Install `vaadin-custom-field`:

```sh
npm i @vaadin/vaadin-custom-field --save
```

Once installed, import it in your application:

```js
import '@vaadin/vaadin-custom-field/vaadin-custom-field.js';
```

## Getting started

Vaadin components use the Lumo theme by default.

To use the Material theme, import the correspondent file from the `theme/material` folder.

## Entry points

- The component with the Lumo theme:

  `theme/lumo/vaadin-custom-field.js`

- The component with the Material theme:

  `theme/material/vaadin-custom-field.js`

- Alias for `theme/lumo/vaadin-custom-field.js`:

  `vaadin-custom-field.js`

## Contributing

Read the [contributing guide](https://vaadin.com/docs/latest/guide/contributing/overview) to learn about our development process, how to propose bugfixes and improvements, and how to test your changes to Vaadin components.

## License

Apache License 2.0

Vaadin collects development time usage statistics to improve this product. For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
