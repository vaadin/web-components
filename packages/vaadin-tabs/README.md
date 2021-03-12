# &lt;vaadin-tabs&gt;

[Live Demo ↗](https://vaadin.com/components/vaadin-tabs/html-examples)
|
[API documentation ↗](https://vaadin.com/components/vaadin-tabs/html-api)

[&lt;vaadin-tabs&gt;](https://vaadin.com/components/vaadin-tabs) is a Web Component providing item navigation part of the [Vaadin components](https://vaadin.com/components). It is designed for menu and tab components.

[![npm version](https://badgen.net/npm/v/@vaadin/vaadin-tabs)](https://www.npmjs.com/package/@vaadin/vaadin-tabs)
[![Build Status](https://travis-ci.org/vaadin/vaadin-tabs.svg?branch=master)](https://travis-ci.org/vaadin/vaadin-tabs)
[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://webcomponents.org/element/vaadin/vaadin-tabs)
[![Published on Vaadin Directory](https://img.shields.io/badge/Vaadin%20Directory-published-00b4f0.svg)](https://vaadin.com/directory/component/vaadinvaadin-tabs)
[![Stars on vaadin.com/directory](https://img.shields.io/vaadin-directory/star/vaadinvaadin-tabs.svg)](https://vaadin.com/directory/component/vaadinvaadin-tabs)
[![Discord](https://img.shields.io/discord/732335336448852018?label=discord)](https://discord.gg/PHmkCKC)

```html
<vaadin-tabs selected="3">
  <vaadin-tab>Page 1</vaadin-tab>
  <vaadin-tab>Page 2</vaadin-tab>
  <vaadin-tab>Page 3</vaadin-tab>
  <vaadin-tab>Page 4</vaadin-tab>
</vaadin-tabs>
```

[<img src="https://raw.githubusercontent.com/vaadin/vaadin-tabs/master/screenshot.png" width="355" alt="Screenshot of vaadin-tabs, using the default Lumo theme">](https://vaadin.com/components/vaadin-tabs)

## Installation

Install `vaadin-tabs`:

```sh
npm i @vaadin/vaadin-tabs --save
```

Once installed, import it in your application:

```js
import '@vaadin/vaadin-tabs/vaadin-tabs.js';
```

## Getting started

Vaadin components use the Lumo theme by default.

To use the Material theme, import the correspondent file from the `theme/material` folder.

## Entry points

- The components with the Lumo theme:

  `theme/lumo/vaadin-tab.js`
  `theme/lumo/vaadin-tabs.js`

- The components with the Material theme:

  `theme/material/vaadin-tab.js`
  `theme/material/vaadin-tabs.js`

- Alias for `theme/lumo/vaadin-tab.js`
  `theme/lumo/vaadin-tabs.js`:

  `vaadin-tab.js`
  `vaadin-tabs.js`


## Running API docs and tests in a browser

1. Fork the `vaadin-tabs` repository and clone it locally.

1. Make sure you have [node.js](https://nodejs.org/) 12.x installed.

1. Make sure you have [npm](https://www.npmjs.com/) installed.

1. When in the `vaadin-tabs` directory, run `npm install` to install dependencies.

1. Run `npm start`, browser will automatically open the component API documentation.

1. You can also open visual tests, for example:

  - http://127.0.0.1:3000/test/visual/horizontal-tabs.html


## Running tests from the command line

1. When in the `vaadin-tabs` directory, run `npm test`

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
