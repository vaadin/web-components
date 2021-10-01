# &lt;vaadin-icon&gt;

[&lt;vaadin-icon&gt;](https://vaadin.com/docs/latest/ds/components/icon) is a Web Component for creating SVG icons, part of the [Vaadin components](https://vaadin.com/docs/latest/ds/components).

[![npm version](https://badgen.net/npm/v/@vaadin/icon)](https://www.npmjs.com/package/@vaadin/icon)
[![Discord](https://img.shields.io/discord/732335336448852018?label=discord)](https://discord.gg/PHmkCKC)

```html
<vaadin-icon name="vaadin:user"></vaadin-icon>
```

## Installation

Install `vaadin-icon`:

```sh
npm i @vaadin/icon --save
```

Once installed, import it in your application:

```js
import '@vaadin/icon/vaadin-icon.js';
```

## Getting started

Vaadin components use the Lumo theme by default.

To use the Material theme, import the corresponding file from the `theme/material` folder.

## Entry points

- The component with the Lumo theme:

  `theme/lumo/vaadin-icon.js`

- The component with the Material theme:

  `theme/material/vaadin-icon.js`

- Alias for `theme/lumo/vaadin-icon.js`:

  `vaadin-icon.js`

## Contributing

Read the [contributing guide](https://vaadin.com/docs/latest/guide/contributing/overview) to learn about our development process, how to propose bugfixes and improvements, and how to test your changes to Vaadin components.

## License

Apache License 2.0

Vaadin collects development time usage statistics to improve this product. For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
