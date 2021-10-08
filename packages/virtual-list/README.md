# &lt;vaadin-virtual-list&gt;

[Live Demo ↗](https://vaadin.com/docs/latest/ds/components/virtual-list)
|
[API documentation ↗](https://vaadin.com/docs/latest/ds/components/virtual-list/api)

[&lt;vaadin-virtual-list&gt;](https://vaadin.com/docs/latest/ds/components/virtual-list) is a Web Component providing an accessible and customizable virtual-list, part of the [Vaadin components](https://vaadin.com/docs/latest/ds/components).

[![npm version](https://badgen.net/npm/v/@vaadin/virtual-list)](https://www.npmjs.com/package/@vaadin/virtual-list)
[![Discord](https://img.shields.io/discord/732335336448852018?label=discord)](https://discord.gg/PHmkCKC)

```html
<vaadin-virtual-list></vaadin-virtual-list>

<script>
  const list = document.querySelector('vaadin-virtual-list');
  list.items = items; // An array of data items
  list.renderer = (root, list, { item, index }) => {
    root.textContent = `#${index}: ${item.name}`;
  };
</script>
```

[<img src="https://raw.githubusercontent.com/vaadin/web-components/master/packages/virtual-list/screenshot.png" alt="Screenshot of vaadin-virtual-list">](https://vaadin.com/docs/latest/ds/components/virtual-list)

## Installation

Install `vaadin-virtual-list`:

```sh
npm i @vaadin/virtual-list --save
```

Once installed, import it in your application:

```js
import '@vaadin/virtual-list/vaadin-virtual-list.js';
```

## Getting started

Vaadin components use the Lumo theme by default.

To use the Material theme, import the correspondent file from the `theme/material` folder.

## Entry points

- The component with the Lumo theme:

  `theme/lumo/vaadin-virtual-list.js`

- The component with the Material theme:

  `theme/material/vaadin-virtual-list.js`

- Alias for `theme/lumo/vaadin-virtual-list.js`:

  `vaadin-virtual-list.js`

## Contributing

Read the [contributing guide](https://vaadin.com/docs/latest/guide/contributing/overview) to learn about our development process, how to propose bugfixes and improvements, and how to test your changes to Vaadin components.

## License

Apache License 2.0

Vaadin collects development time usage statistics to improve this product. For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
