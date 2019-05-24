[![npm version](https://badge.fury.io/js/%40vaadin%2Fvaadin-grid.svg)](https://badge.fury.io/js/%40vaadin%2Fvaadin-grid)
[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/vaadin/vaadin-grid)
[![Build Status](https://travis-ci.org/vaadin/vaadin-grid.svg?branch=master)](https://travis-ci.org/vaadin/vaadin-grid)
[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/vaadin/web-components?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

[![Published on Vaadin  Directory](https://img.shields.io/badge/Vaadin%20Directory-published-00b4f0.svg)](https://vaadin.com/directory/component/vaadinvaadin-grid)
[![Stars on vaadin.com/directory](https://img.shields.io/vaadin-directory/star/vaadinvaadin-grid.svg)](https://vaadin.com/directory/component/vaadinvaadin-grid)

# &lt;vaadin-grid&gt;

[Live Demo ↗](https://vaadin.com/components/vaadin-grid/html-examples)
|
[API documentation ↗](https://vaadin.com/components/vaadin-grid/html-api)

[&lt;vaadin-grid&gt;](https://vaadin.com/components/vaadin-grid) is a free, high quality data grid / data table Web Component, part of the [Vaadin components](https://vaadin.com/components).

<!---
```
<custom-element-demo>
  <template>
    <script src="../webcomponentsjs/webcomponents-lite.js"></script>
    <link rel="import" href="../iron-ajax/iron-ajax.html">
    <link rel="import" href="vaadin-grid.html">
    <link rel="import" href="vaadin-grid-selection-column.html">
    <link rel="import" href="vaadin-grid-sort-column.html">
    <next-code-block></next-code-block>
  </template>
</custom-element-demo>
```
-->
```html
  <vaadin-grid theme="row-dividers" column-reordering-allowed multi-sort>
    <vaadin-grid-selection-column auto-select frozen></vaadin-grid-selection-column>
    <vaadin-grid-sort-column width="9em" path="firstName"></vaadin-grid-sort-column>
    <vaadin-grid-sort-column width="9em" path="lastName"></vaadin-grid-sort-column>
    <vaadin-grid-column id="addresscolumn" width="15em" flex-grow="2" header="Address"></vaadin-grid-column>
  </vaadin-grid>

  <script>
    // Customize the "Address" column's renderer
    document.querySelector('#addresscolumn').renderer = (root, grid, rowData) => {
      root.textContent = `${rowData.item.address.street}, ${rowData.item.address.city}`;
    };

    // Populate the grid with data
    const grid = document.querySelector('vaadin-grid');
    fetch('https://demo.vaadin.com/demo-data/1.0/people?count=200')
      .then(res => res.json())
      .then(json => grid.items = json.result);
  </script>
```

[<img src="https://raw.githubusercontent.com/vaadin/vaadin-grid/master/screenshot.png" alt="Screenshot of vaadin-grid, using the default Lumo theme">](https://vaadin.com/components/vaadin-grid)

## Installation

The Vaadin components are distributed as Bower and npm packages.
Please note that the version range is the same, as the API has not changed.
You should not mix Bower and npm versions in the same application, though.

Unlike the official Polymer Elements, the converted Polymer 3 compatible Vaadin components
are only published on npm, not pushed to GitHub repositories.

### Polymer 2 and HTML Imports Compatible Version

Install `vaadin-grid`:

```sh
bower i vaadin/vaadin-grid --save
```

Once installed, import it in your application:

```html
<link rel="import" href="bower_components/vaadin-grid/vaadin-grid.html">
```
### Polymer 3 and ES Modules Compatible Version

Install `vaadin-grid`:

```sh
npm i @vaadin/vaadin-grid --save
```

Once installed, import it in your application:

```js
import '@vaadin/vaadin-grid/vaadin-grid.js';
```

## Getting started

Vaadin components use the Lumo theme by default.

To use the Material theme, import the correspondent file from the `theme/material` folder.

## Entry points

- The component with the Lumo theme:

  `theme/lumo/vaadin-grid.html`

- The component with the Material theme:

  `theme/material/vaadin-grid.html`

- Alias for `theme/lumo/vaadin-grid.html`:

  `vaadin-grid.html`


## Running demos and tests in a browser

1. Fork the `vaadin-grid` repository and clone it locally.

1. Make sure you have [npm](https://www.npmjs.com/) and [Bower](https://bower.io) installed.

1. When in the `vaadin-grid` directory, run `npm install` and then `bower install` to install dependencies.

1. Run `npm start`, browser will automatically open the component API documentation.

1. You can also open demo or in-browser tests by adding **demo** or **test** to the URL, for example:

  - http://127.0.0.1:3000/components/vaadin-grid/demo
  - http://127.0.0.1:3000/components/vaadin-grid/test


## Running tests from the command line

1. When in the `vaadin-grid` directory, run `polymer test`


## Following the coding style

We are using [ESLint](http://eslint.org/) for linting JavaScript code. You can check if your code is following our standards by running `npm run lint`, which will automatically lint all `.js` files as well as JavaScript snippets inside `.html` files.


## Big Thanks

Cross-browser Testing Platform and Open Source <3 Provided by [Sauce Labs](https://saucelabs.com).


## Contributing

  To contribute to the component, please read [the guideline](https://github.com/vaadin/vaadin-core/blob/master/CONTRIBUTING.md) first.


## License

Apache License 2.0

Vaadin collects development time usage statistics to improve this product. For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
