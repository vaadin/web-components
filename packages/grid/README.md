# @vaadin/grid

A web component for showing tabular data.

[Documentation + Live Demo ↗](https://vaadin.com/docs/latest/components/grid)

[![npm version](https://badgen.net/npm/v/@vaadin/grid)](https://www.npmjs.com/package/@vaadin/grid)

```html
<vaadin-grid column-reordering-allowed multi-sort>
  <vaadin-grid-selection-column auto-select frozen></vaadin-grid-selection-column>
  <vaadin-grid-sort-column width="9rem" path="firstName"></vaadin-grid-sort-column>
  <vaadin-grid-sort-column width="9rem" path="lastName"></vaadin-grid-sort-column>
  <vaadin-grid-column id="address" width="15rem" flex-grow="2" header="Address"></vaadin-grid-column>
</vaadin-grid>

<script>
  // Customize the "Address" column's renderer
  document.querySelector('#address').renderer = (root, grid, model) => {
    root.textContent = `${model.item.address.street}, ${model.item.address.city}`;
  };

  // Populate the grid with data
  const grid = document.querySelector('vaadin-grid');
  fetch('https://demo.vaadin.com/demo-data/1.0/people?count=200')
    .then((res) => res.json())
    .then((json) => (grid.items = json.result));
</script>
```

[<img src="https://raw.githubusercontent.com/vaadin/web-components/main/packages/grid/screenshot.png" alt="Screenshot of vaadin-grid">](https://vaadin.com/docs/latest/components/grid)

## Installation

Install the component:

```sh
npm i @vaadin/grid
```

Once installed, import the components in your application:

```js
import '@vaadin/grid';
import '@vaadin/grid/vaadin-grid-column-group.js';
import '@vaadin/grid/vaadin-grid-filter-column.js';
import '@vaadin/grid/vaadin-grid-selection-column.js';
import '@vaadin/grid/vaadin-grid-sort-column.js';
import '@vaadin/grid/vaadin-grid-tree-column.js';
```

## Themes

Vaadin components come with two built-in [themes](https://vaadin.com/docs/latest/styling), Lumo and Material.
The [main entrypoint](https://github.com/vaadin/web-components/blob/main/packages/grid/vaadin-grid.js) of the package uses the Lumo theme.

To use the Material theme, import the components from the `theme/material` folder:

```js
import '@vaadin/grid/theme/material/vaadin-grid.js';
import '@vaadin/grid/theme/material/vaadin-grid-filter-column.js';
import '@vaadin/grid/theme/material/vaadin-grid-selection-column.js';
import '@vaadin/grid/theme/material/vaadin-grid-sort-column.js';
import '@vaadin/grid/theme/material/vaadin-grid-tree-column.js';
```

You can also import the Lumo version of the components explicitly:

```js
import '@vaadin/grid/theme/lumo/vaadin-grid.js';
import '@vaadin/grid/theme/lumo/vaadin-grid-filter-column.js';
import '@vaadin/grid/theme/lumo/vaadin-grid-selection-column.js';
import '@vaadin/grid/theme/lumo/vaadin-grid-sort-column.js';
import '@vaadin/grid/theme/lumo/vaadin-grid-tree-column.js';
```

Finally, you can import the un-themed components from the `src` folder to get a minimal starting point:

```js
import '@vaadin/grid/src/vaadin-grid.js';
import '@vaadin/grid/src/vaadin-grid-column-group.js';
import '@vaadin/grid/src/vaadin-grid-filter-column.js';
import '@vaadin/grid/src/vaadin-grid-selection-column.js';
import '@vaadin/grid/src/vaadin-grid-sort-column.js';
import '@vaadin/grid/src/vaadin-grid-tree-column.js';
```

## Contributing

Read the [contributing guide](https://vaadin.com/docs/latest/contributing) to learn about our development process, how to propose bugfixes and improvements, and how to test your changes to Vaadin components.

## License

Apache License 2.0

Vaadin collects usage statistics at development time to improve this product.
For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
