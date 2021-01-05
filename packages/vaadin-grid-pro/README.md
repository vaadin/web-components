# &lt;vaadin-grid-pro&gt;

[Live Demo ↗](https://vaadin.com/components/vaadin-grid-pro/html-examples)
|
[API documentation ↗](https://vaadin.com/components/vaadin-grid-pro/html-api)

[&lt;vaadin-grid-pro&gt;](https://vaadin.com/components/vaadin-grid-pro) is a high quality data grid / data table Web Component with extended functionality, part of the [Vaadin components](https://vaadin.com/components).

[![npm version](https://badgen.net/npm/v/@vaadin/vaadin-grid-pro)](https://www.npmjs.com/package/@vaadin/vaadin-grid-pro)
[![Build Status](https://travis-ci.org/vaadin/vaadin-grid-pro.svg?branch=master)](https://travis-ci.org/vaadin/vaadin-grid-pro)
[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/vaadin/vaadin-grid-pro)
[![Published on Vaadin Directory](https://img.shields.io/badge/Vaadin%20Directory-published-00b4f0.svg)](https://vaadin.com/directory/component/vaadinvaadin-grid-pro)
[![Stars on vaadin.com/directory](https://img.shields.io/vaadin-directory/star/vaadin-grid-pro-directory-urlidentifier.svg)](https://vaadin.com/directory/component/vaadinvaadin-grid-pro)
[![Discord](https://img.shields.io/discord/732335336448852018?label=discord)](https://discord.gg/PHmkCKC)

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
    .then(res => res.json())
    .then(json => grid.items = json.result);
</script>
```

[<img src="https://raw.githubusercontent.com/vaadin/vaadin-grid-pro/master/screenshot.png" width="900" alt="Screenshot of vaadin-grid-pro">](https://vaadin.com/components/vaadin-grid-pro)


## Installation

Install `vaadin-grid-pro`:

```sh
npm i @vaadin/vaadin-grid-pro --save
```

Once installed, import it in your application:

```js
import '@vaadin/vaadin-grid-pro/vaadin-grid-pro.js';
```

## Getting started

Vaadin components use the Lumo theme by default.

To use the Material theme, import the correspondent file from the `theme/material` folder.

## Entry points

- The component with the Lumo theme:

  `theme/lumo/vaadin-grid-pro.js`

- The component with the Material theme:

  `theme/material/vaadin-grid-pro.js`

- Alias for `theme/lumo/vaadin-grid-pro.js`:

  `vaadin-grid-pro.js`


## Running API docs and tests in a browser

1. Fork the `vaadin-grid-pro` repository and clone it locally.

1. Make sure you have [node.js](https://nodejs.org/) 12.x installed.

1. Make sure you have [npm](https://www.npmjs.com/) installed.

1. When in the `vaadin-grid-pro` directory, run `npm install` to install dependencies.

1. Run `npm start`, browser will automatically open the component API documentation.

1. You can also open visual tests, for example:

  - http://127.0.0.1:3000/test/visual/edit-column-text.html


## Running tests from the command line

1. When in the `vaadin-grid-pro` directory, run `npm test`

## Debugging tests in the browser

1. Run `npm run debug`, then choose manual mode (M) and open the link in browser.


## Following the coding style

We are using [ESLint](http://eslint.org/) for linting JavaScript code. You can check if your code is following our standards by running `npm run lint`, which will automatically lint all `.js` files.


## Big Thanks

Cross-browser Testing Platform and Open Source <3 Provided by [Sauce Labs](https://saucelabs.com).


## Contributing

  To contribute to the component, please read [the guideline](https://github.com/vaadin/vaadin-core/blob/master/CONTRIBUTING.md) first.


## License

Commercial Vaadin Developer License 4.0 (CVDLv4). For license terms, see LICENSE.

Vaadin collects development time usage statistics to improve this product. For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
