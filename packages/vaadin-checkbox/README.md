# &lt;vaadin-checkbox&gt;

[Live Demo ↗](https://vaadin.com/components/vaadin-checkbox/html-examples)
|
[API documentation ↗](https://vaadin.com/components/vaadin-checkbox/html-api)

[&lt;vaadin-checkbox&gt;](https://vaadin.com/components/vaadin-checkbox) is a Web Component providing an accessible and customizable checkbox, part of the [Vaadin components](https://vaadin.com/components).

[![npm version](https://badgen.net/npm/v/@vaadin/vaadin-checkbox)](https://www.npmjs.com/package/@vaadin/vaadin-checkbox)
[![Build Status](https://travis-ci.org/vaadin/vaadin-checkbox.svg?branch=master)](https://travis-ci.org/vaadin/vaadin-checkbox)
[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/vaadin/vaadin-checkbox)
[![Published on Vaadin Directory](https://img.shields.io/badge/Vaadin%20Directory-published-00b4f0.svg)](https://vaadin.com/directory/component/vaadinvaadin-checkbox)
[![Stars on vaadin.com/directory](https://img.shields.io/vaadin-directory/star/vaadinvaadin-checkbox.svg)](https://vaadin.com/directory/component/vaadinvaadin-checkbox)
[![Discord](https://img.shields.io/discord/732335336448852018?label=discord)](https://discord.gg/PHmkCKC)

```html
<vaadin-checkbox checked>Checked</vaadin-checkbox>
<vaadin-checkbox>Unchecked</vaadin-checkbox>
<vaadin-checkbox indeterminate>Indeterminate</vaadin-checkbox>
```

[<img src="https://raw.githubusercontent.com/vaadin/vaadin-checkbox/master/screenshot.png" width="400" alt="Screenshot of vaadin-checkbox, using the default Lumo theme">](https://vaadin.com/components/vaadin-checkbox)

## Installation

Install `vaadin-checkbox`:

```sh
npm i @vaadin/vaadin-checkbox --save
```

Once installed, import it in your application:

```js
import '@vaadin/vaadin-checkbox/vaadin-checkbox.js';
```

## Getting Started

Vaadin components use the Lumo theme by default.

To use the Material theme, import the correspondent file from the `theme/material` folder.

## The file structure for Vaadin components

- The component with the Lumo theme:

  `theme/lumo/vaadin-checkbox.js`

- The component with the Material theme:

  `theme/material/vaadin-checkbox.js`

- Alias for `theme/lumo/vaadin-checkbox.js`:

  `vaadin-checkbox.js`

## Running API docs and tests in a browser

1. Fork the `vaadin-checkbox` repository and clone it locally.

1. Make sure you have [node.js](https://nodejs.org/) 12.x installed.

1. Make sure you have [npm](https://www.npmjs.com/) installed.

1. When in the `vaadin-checkbox` directory, run `npm install` to install dependencies.

1. Run `npm start`, browser will automatically open the component API documentation.

1. You can also open visual tests, for example:

  - http://127.0.0.1:3000/test/visual/checkbox.html


## Running tests from the command line

1. When in the `vaadin-checkbox` directory, run `npm test`

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
