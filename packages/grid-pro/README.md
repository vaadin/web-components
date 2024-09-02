# @vaadin/grid-pro

An extension of the `vaadin-grid` component that provides inline editing with full keyboard navigation.

> ℹ️&nbsp; A commercial Vaadin [subscription](https://vaadin.com/pricing) is required to use Grid Pro in your project.

[Documentation + Live Demo ↗](https://vaadin.com/docs/latest/components/grid-pro)

[![npm version](https://badgen.net/npm/v/@vaadin/grid-pro)](https://www.npmjs.com/package/@vaadin/grid-pro)

```html
<vaadin-grid-pro>
  <vaadin-grid-pro-edit-column path="firstName" header="First Name"></vaadin-grid-pro-edit-column>
  <vaadin-grid-pro-edit-column path="lastName" header="Last Name"></vaadin-grid-pro-edit-column>
  <vaadin-grid-pro-edit-column path="email" header="Email"></vaadin-grid-pro-edit-column>
</vaadin-grid-pro>
<script>
  // Populate the grid with data
  const grid = document.querySelector('vaadin-grid-pro');
  fetch('https://demo.vaadin.com/demo-data/1.0/people?count=200')
    .then((res) => res.json())
    .then((json) => (grid.items = json.result));
</script>
```

[<img src="https://raw.githubusercontent.com/vaadin/web-components/main/packages/grid-pro/screenshot.png" width="900" alt="Screenshot of vaadin-grid-pro">](https://vaadin.com/docs/latest/components/grid-pro)

## Installation

Install the component:

```sh
npm i @vaadin/grid-pro
```

Once installed, import the component in your application:

```js
import '@vaadin/grid-pro';
import '@vaadin/grid-pro/vaadin-grid-pro-edit-column.js';
```

## Themes

Vaadin components come with two built-in [themes](https://vaadin.com/docs/latest/styling), Lumo and Material.
The [main entrypoint](https://github.com/vaadin/web-components/blob/main/packages/grid-pro/vaadin-grid-pro.js) of the package uses the Lumo theme.

To use the Material theme, import the components from the `theme/material` folder:

```js
import '@vaadin/grid-pro/theme/material/vaadin-grid-pro.js';
import '@vaadin/grid-pro/theme/material/vaadin-grid-pro-edit-column.js';
```

You can also import the Lumo version of the components explicitly:

```js
import '@vaadin/grid-pro/theme/lumo/vaadin-grid-pro.js';
import '@vaadin/grid-pro/theme/lumo/vaadin-grid-pro-edit-column.js';
```

Finally, you can import the un-themed components from the `src` folder to get a minimal starting point:

```js
import '@vaadin/grid-pro/src/vaadin-grid-pro.js';
import '@vaadin/grid-pro/src/vaadin-grid-pro-edit-column.js';
```

## Contributing

Read the [contributing guide](https://vaadin.com/docs/latest/contributing) to learn about our development process, how to propose bugfixes and improvements, and how to test your changes to Vaadin components.

## License

This program is available under Vaadin Commercial License and Service Terms. For license terms, see LICENSE.

Vaadin collects usage statistics at development time to improve this product.
For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
