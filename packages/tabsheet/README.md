# @vaadin/tabsheet

A web component for organizing and grouping content into sections.

[Documentation + Live Demo ↗](https://vaadin.com/docs/latest/components/tabsheet)

[![npm version](https://badgen.net/npm/v/@vaadin/tabsheet)](https://www.npmjs.com/package/@vaadin/tabsheet)
[![Discord](https://img.shields.io/discord/732335336448852018?label=discord)](https://discord.gg/PHmkCKC)

```html
<vaadin-tabsheet selected="3">
  ...
</vaadin-tabsheet>
```

[<img src="https://raw.githubusercontent.com/vaadin/web-components/master/packages/tabsheet/screenshot.png" width="355" alt="Screenshot of vaadin-tabsheet">](https://vaadin.com/docs/latest/components/tabsheet)

## Installation

Install the component:

```sh
npm i @vaadin/tabsheet
```

Once installed, import the component in your application:

```js
import '@vaadin/tabsheet';
```

## Themes

Vaadin components come with two built-in [themes](https://vaadin.com/docs/latest/styling), Lumo and Material.
The [main entrypoint](https://github.com/vaadin/web-components/blob/master/packages/tabsheet/vaadin-tabsheet.js) of the package uses the Lumo theme.

To use the Material theme, import the component from the `theme/material` folder:

```js
import '@vaadin/tabsheet/theme/material/vaadin-tabsheet.js';
```

You can also import the Lumo version of the component explicitly:

```js
import '@vaadin/tabsheet/theme/lumo/vaadin-tabsheet.js';
```

Finally, you can import the un-themed component from the `src` folder to get a minimal starting point:

```js
import '@vaadin/tabsheet/src/vaadin-tabsheet.js';
```

## Contributing

Read the [contributing guide](https://vaadin.com/docs/latest/contributing/overview) to learn about our development process, how to propose bugfixes and improvements, and how to test your changes to Vaadin components.

## License

Apache License 2.0

Vaadin collects usage statistics at development time to improve this product.
For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
