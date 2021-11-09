# @vaadin/split-layout

A web component with two content areas and a draggable split handle between them.

[Documentation + Live Demo ↗](https://vaadin.com/docs/latest/ds/components/split-layout)

[![npm version](https://badgen.net/npm/v/@vaadin/split-layout)](https://www.npmjs.com/package/@vaadin/split-layout)
[![Discord](https://img.shields.io/discord/732335336448852018?label=discord)](https://discord.gg/PHmkCKC)

```html
<vaadin-split-layout>
  <vaadin-split-layout orientation="vertical">
    <div>First layout content</div>
    <div>Second layout content</div>
  </vaadin-split-layout>
  <vaadin-split-layout orientation="vertical">
    <div>Third layout content</div>
    <div>Fourth layout content</div>
  </vaadin-split-layout>
</vaadin-split-layout>
```

[<img src="https://raw.githubusercontent.com/vaadin/web-components/master/packages/split-layout/screenshot.png" width="616" alt="Screenshot of vaadin-split-layout">](https://vaadin.com/docs/latest/ds/components/split-layout)

## Installation

Install the component:

```sh
npm i @vaadin/split-layout
```

Once installed, import the component in your application:

```js
import '@vaadin/split-layout';
```

## Themes

Vaadin components come with two built-in [themes](https://vaadin.com/docs/latest/ds/customization/using-themes), Lumo and Material.
The [main entrypoint](https://github.com/vaadin/web-components/blob/master/packages/split-layout/vaadin-split-layout.js) of the package uses the Lumo theme.

To use the Material theme, import the component from the `theme/material` folder:

```js
import '@vaadin/split-layout/theme/material/vaadin-split-layout.js';
```

You can also import the Lumo version of the component explicitly:

```js
import '@vaadin/split-layout/theme/lumo/vaadin-split-layout.js';
```

Finally, you can import the un-themed component from the `src` folder to get a minimal starting point:

```js
import '@vaadin/split-layout/src/vaadin-split-layout.js';
```

## Contributing

Read the [contributing guide](https://vaadin.com/docs/latest/guide/contributing/overview) to learn about our development process, how to propose bugfixes and improvements, and how to test your changes to Vaadin components.

## License

Apache License 2.0

Vaadin collects usage statistics at development time to improve this product.
For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
