# &lt;vaadin-details&gt;

[&lt;vaadin-details&gt;](https://vaadin.com/components/vaadin-details) is a Web Component providing functionality for expandable details, part of the [Vaadin components](https://vaadin.com/components).

[Live Demo ↗](https://vaadin.com/components/vaadin-details/html-examples)
|
[API documentation ↗](https://vaadin.com/components/vaadin-details/html-api)

[![npm version](https://badgen.net/npm/v/@vaadin/vaadin-details)](https://www.npmjs.com/package/@vaadin/vaadin-details)
[![Published on Vaadin Directory](https://img.shields.io/badge/Vaadin%20Directory-published-00b4f0.svg)](https://vaadin.com/directory/component/vaadinvaadin-details)
[![Discord](https://img.shields.io/discord/732335336448852018?label=discord)](https://discord.gg/PHmkCKC)

```html
<vaadin-details opened>
  <div slot="summary">Expandable Details</div>
  Toggle using mouse, Enter and Space keys.
</vaadin-details>
```

[<img src="https://raw.githubusercontent.com/vaadin/vaadin-details/master/screenshot.png" alt="Screenshot of vaadin-details" width="320">](https://vaadin.com/components/vaadin-details)

## Installation

Install `vaadin-details`:

```sh
npm i @vaadin/vaadin-details --save
```

Once installed, import it in your application:

```js
import '@vaadin/vaadin-details/vaadin-details.js';
```

## Getting started

Vaadin components use the Lumo theme by default.

To use the Material theme, import the correspondent file from the `theme/material` folder.

## Entry points

- The component with the Lumo theme:

  `theme/lumo/vaadin-details.js`

- The component with the Material theme:

  `theme/material/vaadin-details.js`

- Alias for `theme/lumo/vaadin-details.js`:

  `vaadin-details.js`

## Contributing

Read the [contributing guide](https://vaadin.com/docs/latest/guide/contributing/overview) to learn about our development process, how to propose bugfixes and improvements, and how to test your changes to Vaadin components.

## License

Apache License 2.0

Vaadin collects development time usage statistics to improve this product. For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
