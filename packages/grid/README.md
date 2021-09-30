# &lt;vaadin-grid&gt;

[Live Demo ↗](https://vaadin.com/components/vaadin-grid/html-examples)
|
[API documentation ↗](https://vaadin.com/components/vaadin-grid/html-api)

[&lt;vaadin-grid&gt;](https://vaadin.com/components/vaadin-grid) is a free, high quality data grid / data table Web Component, part of the [Vaadin components](https://vaadin.com/components).

[![npm version](https://badgen.net/npm/v/@vaadin/grid)](https://www.npmjs.com/package/@vaadin/grid)
[![Published on Vaadin Directory](https://img.shields.io/badge/Vaadin%20Directory-published-00b4f0.svg)](https://vaadin.com/directory/component/vaadinvaadin-grid)
[![Discord](https://img.shields.io/discord/732335336448852018?label=discord)](https://discord.gg/PHmkCKC)

```html
<vaadin-grid theme="row-dividers" column-reordering-allowed multi-sort>
  <vaadin-grid-selection-column auto-select frozen></vaadin-grid-selection-column>
  <vaadin-grid-sort-column width="9em" path="firstName"></vaadin-grid-sort-column>
  <vaadin-grid-sort-column width="9em" path="lastName"></vaadin-grid-sort-column>
  <vaadin-grid-column id="addresscolumn" width="15em" flex-grow="2" header="Address"></vaadin-grid-column>
</vaadin-grid>

<script>
  // Customize the "Address" column's renderer
  document.querySelector('#addresscolumn').renderer = (root, grid, model) => {
    root.textContent = `${model.item.address.street}, ${model.item.address.city}`;
  };

  // Populate the grid with data
  const grid = document.querySelector('vaadin-grid');
  fetch('https://demo.vaadin.com/demo-data/1.0/people?count=200')
    .then((res) => res.json())
    .then((json) => (grid.items = json.result));
</script>
```

[<img src="https://raw.githubusercontent.com/vaadin/vaadin-grid/master/screenshot.png" alt="Screenshot of vaadin-grid, using the default Lumo theme">](https://vaadin.com/components/vaadin-grid)

## Installation

Install `vaadin-grid`:

```sh
npm i @vaadin/grid --save
```

Once installed, import it in your application:

```js
import '@vaadin/grid/vaadin-grid.js';
```

## Getting started

Vaadin components use the Lumo theme by default.

To use the Material theme, import the correspondent file from the `theme/material` folder.

## Entry points

- The component with the Lumo theme:

  `theme/lumo/vaadin-grid.js`

- The component with the Material theme:

  `theme/material/vaadin-grid.js`

- Alias for `theme/lumo/vaadin-grid.js`:

  `vaadin-grid.js`

## Contributing

Read the [contributing guide](https://vaadin.com/docs/latest/guide/contributing/overview) to learn about our development process, how to propose bugfixes and improvements, and how to test your changes to Vaadin components.

## License

Apache License 2.0

Vaadin collects development time usage statistics to improve this product. For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
