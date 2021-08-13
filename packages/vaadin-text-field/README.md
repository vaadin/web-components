# &lt;vaadin-text-field&gt;

[Live Demo ↗](https://vaadin.com/components/vaadin-text-field/html-examples)
|
[API documentation ↗](https://vaadin.com/components/vaadin-text-field/html-api)

[&lt;vaadin-text-field&gt;](https://vaadin.com/components/vaadin-text-field) is a themable Web Component providing input controls in forms, part of the [Vaadin components](https://vaadin.com/components).

[![npm version](https://badgen.net/npm/v/@vaadin/vaadin-text-field)](https://www.npmjs.com/package/@vaadin/vaadin-text-field)
[![Published on Vaadin Directory](https://img.shields.io/badge/Vaadin%20Directory-published-00b4f0.svg)](https://vaadin.com/directory/component/vaadinvaadin-text-field)
[![Discord](https://img.shields.io/discord/732335336448852018?label=discord)](https://discord.gg/PHmkCKC)

```html
<vaadin-text-field label="Username"></vaadin-text-field>
<vaadin-password-field label="Password"></vaadin-password-field>
<vaadin-text-area label="Description"></vaadin-text-area>
<vaadin-email-field label="Email"></vaadin-email-field>
<vaadin-number-field label="Price"></vaadin-number-field>
<vaadin-integer-field label="Count" has-controls></vaadin-integer-field>
```

[<img src="https://raw.githubusercontent.com/vaadin/vaadin-text-field/master/screenshot.png" width="710" alt="Screenshot of vaadin-text-field">](https://vaadin.com/components/vaadin-text-field)

## Installation

Install `vaadin-text-field`:

```sh
npm i @vaadin/vaadin-text-field --save
```

Once installed, import the components you need in your application:

```js
import '@vaadin/vaadin-text-field/vaadin-text-field.js';
import '@vaadin/vaadin-text-field/vaadin-text-area.js';
import '@vaadin/vaadin-text-field/vaadin-password-field.js';
import '@vaadin/vaadin-text-field/vaadin-email-field.js';
import '@vaadin/vaadin-text-field/vaadin-number-field.js';
import '@vaadin/vaadin-text-field/vaadin-integer-field.js';
```

## Getting started

Vaadin components use the Lumo theme by default.

To use the Material theme, import the correspondent file from the `theme/material` folder.

## Entry points

- The components with the Lumo theme:

  `theme/lumo/vaadin-text-field.js`
  `theme/lumo/vaadin-text-area.js`
  `theme/lumo/vaadin-password-field.js`
  `theme/lumo/vaadin-email-field.js`
  `theme/lumo/vaadin-number-field.js`
  `theme/lumo/vaadin-integer-field.js`

- The components with the Material theme:

  `theme/material/vaadin-text-field.js`
  `theme/material/vaadin-text-area.js`
  `theme/material/vaadin-password-field.js`
  `theme/material/vaadin-email-field.js`
  `theme/material/vaadin-number-field.js`
  `theme/material/vaadin-integer-field.js`

- Aliases for `theme/lumo/vaadin-text-field.js`
  `theme/lumo/vaadin-text-area.js`
  `theme/lumo/vaadin-password-field.js`
  `theme/lumo/vaadin-email-field.js`
  `theme/lumo/vaadin-number-field.js`
  `theme/lumo/vaadin-integer-field.js`:

  `vaadin-text-field.js`
  `vaadin-text-area.js`
  `vaadin-password-field.js`
  `vaadin-email-field.js`
  `vaadin-number-field.js`
  `vaadin-integer-field.js`

## Contributing

Read the [contributing guide](https://vaadin.com/docs/latest/guide/contributing/overview) to learn about our development process, how to propose bugfixes and improvements, and how to test your changes to Vaadin components.

## License

Apache License 2.0

Vaadin collects development time usage statistics to improve this product. For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
