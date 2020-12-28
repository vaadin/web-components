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
      .then(res => res.json())
      .then(json => grid.items = json.result);
  </script>
```

[<img src="https://raw.githubusercontent.com/vaadin/vaadin-grid/master/screenshot.png" alt="Screenshot of vaadin-grid, using the default Lumo theme">](https://vaadin.com/components/vaadin-grid)

## Installation

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

  `theme/lumo/vaadin-grid.js`

- The component with the Material theme:

  `theme/material/vaadin-grid.js`

- Alias for `theme/lumo/vaadin-grid.js`:

  `vaadin-grid.js`


## Running demos and tests in a browser

1. Fork the `vaadin-grid` repository and clone it locally.

1. Make sure you have [node.js](https://nodejs.org/) 12.x installed.

1. Make sure you have [npm](https://www.npmjs.com/) installed.

1. When in the `vaadin-grid` directory, run `npm install` to install dependencies.

1. Run `npm start`, browser will automatically open the component API documentation.

1. You can also open visual tests, for example:

  - http://127.0.0.1:3000/test/visual/sorting.html

## Running tests from the command line

1. When in the `vaadin-upload` directory, run `npm test`

## Running tests from the command line

1. When in the `vaadin-grid` directory, run `polymer test`

## Debugging tests in the browser

1. Run `npm run debug`, then choose manual mode (M) and open the link in browser.

## Following the coding style

We are using [ESLint](http://eslint.org/) for linting JavaScript code. You can check if your code is following our standards by running `npm run lint`, which will automatically lint all `.js` files.


## Big Thanks

Cross-browser Testing Platform and Open Source <3 Provided by [Sauce Labs](https://saucelabs.com).


## Contributing

  To contribute to the component, please read [the guideline](https://github.com/vaadin/vaadin-core/blob/master/CONTRIBUTING.md) first.


## License

Apache License 2.0

Vaadin collects development time usage statistics to improve this product. For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
