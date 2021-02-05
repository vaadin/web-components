# &lt;vaadin-ordered-layout&gt;

[Live Demo ↗](https://vaadin.com/components/vaadin-ordered-layout/html-examples)
|
[API documentation ↗](https://vaadin.com/components/vaadin-ordered-layout/html-api)

[&lt;vaadin-ordered-layout&gt;](https://vaadin.com/components/vaadin-ordered-layout) consist of two Web Components providing a simple way to horizontally or vertically align your HTML elements, part of the [Vaadin components](https://vaadin.com/components).

[![npm version](https://badgen.net/npm/v/@vaadin/vaadin-ordered-layout)](https://www.npmjs.com/package/@vaadin/vaadin-ordered-layout)
[![Build Status](https://travis-ci.org/vaadin/vaadin-ordered-layout.svg?branch=master)](https://travis-ci.org/vaadin/vaadin-ordered-layout)
[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/vaadin/vaadin-ordered-layout)
[![Published on Vaadin Directory](https://img.shields.io/badge/Vaadin%20Directory-published-00b4f0.svg)](https://vaadin.com/directory/component/vaadinvaadin-ordered-layout)
[![Stars on vaadin.com/directory](https://img.shields.io/vaadin-directory/star/vaadinvaadin-ordered-layout.svg)](https://vaadin.com/directory/component/vaadinvaadin-ordered-layout)
[![Discord](https://img.shields.io/discord/732335336448852018?label=discord)](https://discord.gg/PHmkCKC)

```html
<vaadin-horizontal-layout>
  <div>Horizontally</div>
  <div>Aligned</div>
</vaadin-horizontal-layout>
<vaadin-vertical-layout>
  <div>Vertically</div>
  <div>Aligned</div>
</vaadin-vertical-layout>
```

[<img src="https://raw.githubusercontent.com/vaadin/vaadin-ordered-layout/master/screenshot.png" width="200" alt="Screenshot of vaadin-ordered-layout">](https://vaadin.com/components/vaadin-ordered-layout)

## Installation

Install `vaadin-ordered-layout`:

```sh
npm i @vaadin/vaadin-ordered-layout --save
```

Once installed, import it in your application:

```js
import '@vaadin/vaadin-ordered-layout/vaadin-vertical-layout.js';
```

## Getting started

Vaadin components use the Lumo theme by default.

To use the Material theme, import the correspondent file from the `theme/material` folder.

## Entry points

- The components with the Lumo theme:

  `theme/lumo/vaadin-horizontal-layout.js`
  `theme/lumo/vaadin-vertical-layout.js`

- The components with the Material theme:

  `theme/material/vaadin-horizontal-layout.js`
  `theme/material/vaadin-vertical-layout.js`

- Alias for `theme/lumo/vaadin-horizontal-layout.js`
  `theme/lumo/vaadin-vertical-layout.js`:

  `vaadin-horizontal-layout.js`
  `vaadin-vertical-layout.js`


## Running API docs and tests in a browser

1. Fork the `vaadin-ordered-layout` repository and clone it locally.

1. Make sure you have [node.js](https://nodejs.org/) 12.x installed.

1. Make sure you have [npm](https://www.npmjs.com/) installed.

1. When in the `vaadin-ordered-layout` directory, run `npm install` to install dependencies.

1. Run `npm start`, browser will automatically open the component API documentation.

1. You can also open visual tests, for example:

  - http://localhost:8000/test/visual/horizontal-layout.html


## Running tests from the command line

1. When in the `vaadin-ordered-layout` directory, run `npm test`

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
