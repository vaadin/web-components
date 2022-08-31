# @vaadin/item

A web component for displaying items in list-box, context-menu or select components.

[Documentation + Live Demo ↗](https://vaadin.com/components/vaadin-item/html-examples)

[![npm version](https://badgen.net/npm/v/@vaadin/item)](https://www.npmjs.com/package/@vaadin/item)
[![Discord](https://img.shields.io/discord/732335336448852018?label=discord)](https://discord.gg/PHmkCKC)

```html
<vaadin-item>Simple Item</vaadin-item> <vaadin-item disabled>Disabled Item</vaadin-item>
```

[<img src="https://raw.githubusercontent.com/vaadin/vaadin-item/master/screenshot.png" width="169" alt="Screenshot of vaadin-item">](https://vaadin.com/components/vaadin-item)

## Installation

Install the component:

```sh
npm i @vaadin/item
```

Once installed, import the component in your application:

```js
import '@vaadin/item';
```

## Themes

Vaadin components come with two built-in [themes](https://vaadin.com/docs/latest/styling), Lumo and Material.
The [main entrypoint](https://github.com/vaadin/web-components/blob/master/packages/item/vaadin-item.js) of the package uses Lumo theme.

To use the Material theme, import the component from the `theme/material` folder:

```js
import '@vaadin/item/theme/material/vaadin-item.js';
```

You can also import the Lumo version of the component explicitly:

```js
import '@vaadin/item/theme/lumo/vaadin-item.js';
```

Finally, you can import the un-themed component from the `src` folder to get a minimal starting point:

```js
import '@vaadin/item/src/vaadin-item.js';
```

## Contributing

Read the [contributing guide](https://vaadin.com/docs/latest/contributing/overview) to learn about our development process, how to propose bugfixes and improvements, and how to test your changes to Vaadin components.

## License

Apache License 2.0

Vaadin collects usage statistics at development time to improve this product.
For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
