# &lt;vaadin-list-box&gt;

[Live Demo ↗](https://vaadin.com/components/vaadin-list-box/html-examples)
|
[API documentation ↗](https://vaadin.com/components/vaadin-list-box/html-api)

[&lt;vaadin-list-box&gt;](https://vaadin.com/components/vaadin-list-box) is a Web Component providing reusable list boxes, part of the [Vaadin components](https://vaadin.com/components).

[![npm version](https://badgen.net/npm/v/@vaadin/vaadin-list-box)](https://www.npmjs.com/package/@vaadin/vaadin-list-box)
[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/vaadin/vaadin-list-box)
[![Build Status](https://travis-ci.org/vaadin/vaadin-list-box.svg?branch=master)](https://travis-ci.org/vaadin/vaadin-list-box)
[![Published on Vaadin Directory](https://img.shields.io/badge/Vaadin%20Directory-published-00b4f0.svg)](https://vaadin.com/directory/component/vaadinvaadin-list-box)
[![Stars on vaadin.com/directory](https://img.shields.io/vaadin-directory/star/vaadinvaadin-list-box.svg)](https://vaadin.com/directory/component/vaadinvaadin-list-box)
[![Discord](https://img.shields.io/discord/732335336448852018?label=discord)](https://discord.gg/PHmkCKC)

```html
  <vaadin-list-box selected="2">
    <b>Select an Item</b>
    <vaadin-item>Item one</vaadin-item>
    <vaadin-item>Item two</vaadin-item>
    <hr>
    <vaadin-item>Item three</vaadin-item>
    <vaadin-item>Item four</vaadin-item>
  </vaadin-list-box>
```

[<img src="https://raw.githubusercontent.com/vaadin/vaadin-list-box/master/screenshot.png" width="150" alt="Screenshot of vaadin-list-box">](https://vaadin.com/components/vaadin-list-box)

## Installation

Install `vaadin-list-box`:

```sh
npm i @vaadin/vaadin-list-box --save
```

Once installed, import it in your application:

```js
import '@vaadin/vaadin-list-box/vaadin-list-box.js';
```

## Getting started

Vaadin components use the Lumo theme by default.

To use the Material theme, import the correspondent file from the `theme/material` folder.

## Entry points

- The component with the Lumo theme:

  `theme/lumo/vaadin-list-box.js`

- The component with the Material theme:

  `theme/material/vaadin-list-box.js`

- Alias for `theme/lumo/vaadin-list-box.js`:

  `vaadin-list-box.js`


## Running API docs and tests in a browser

1. Fork the `vaadin-list-box` repository and clone it locally.

1. Make sure you have [node.js](https://nodejs.org/) 12.x installed.

1. Make sure you have [npm](https://www.npmjs.com/) installed.

1. When in the `vaadin-list-box` directory, run `npm install` to install dependencies.

1. Run `npm start`, browser will automatically open the component API documentation.

1. You can also open visual tests, for example:

  - http://127.0.0.1:3000/test/visual/list-box.html


## Running tests from the command line

1. When in the `vaadin-list-box` directory, run `npm test`

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
