# &lt;vaadin-progress-bar&gt;

[Live Demo ↗](https://vaadin.com/components/vaadin-progress-bar/html-examples)
|
[API documentation ↗](https://vaadin.com/components/vaadin-progress-bar/html-api)

[&lt;vaadin-progress-bar&gt;](https://vaadin.com/components/vaadin-progress-bar) is a progress bar Web Component, part of the [Vaadin components](https://vaadin.com/components).

[![npm version](https://badgen.net/npm/v/@vaadin/vaadin-progress-bar)](https://www.npmjs.com/package/@vaadin/vaadin-progress-bar)
[![Build Status](https://travis-ci.org/vaadin/vaadin-progress-bar.svg?branch=master)](https://travis-ci.org/vaadin/vaadin-progress-bar)
[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/vaadin/vaadin-progress-bar)
[![Published on Vaadin Directory](https://img.shields.io/badge/Vaadin%20Directory-published-00b4f0.svg)](https://vaadin.com/directory/component/vaadinvaadin-progress-bar)
[![Stars on vaadin.com/directory](https://img.shields.io/vaadin-directory/star/vaadinvaadin-progress-bar.svg)](https://vaadin.com/directory/component/vaadinvaadin-progress-bar)
[![Discord](https://img.shields.io/discord/732335336448852018?label=discord)](https://discord.gg/PHmkCKC)

```html
<vaadin-progress-bar></vaadin-progress-bar>
<vaadin-progress-bar value="0.3"></vaadin-progress-bar>
<vaadin-progress-bar indeterminate></vaadin-progress-bar>
```

[<img src="https://raw.githubusercontent.com/vaadin/vaadin-progress-bar/master/screenshot.gif" width="418" alt="Screenshot of vaadin-progress-bar">](https://vaadin.com/components/vaadin-progress-bar)

## Installation

Install `vaadin-progress-bar`:

```sh
npm i @vaadin/vaadin-progress-bar --save
```

Once installed, import it in your application:

```js
import '@vaadin/vaadin-progress-bar/vaadin-progress-bar.js';
```

## Getting started

Vaadin components use the Lumo theme by default.

To use the Material theme, import the correspondent file from the `theme/material` folder.

## Entry points

- The component with the Lumo theme:

  `theme/lumo/vaadin-progress-bar.js`

- The component with the Material theme:

  `theme/material/vaadin-progress-bar.js`

- Alias for `theme/lumo/vaadin-progress-bar.js`:

- `vaadin-progress-bar.js`


## Running API docs and tests in a browser

1. Fork the `vaadin-progress-bar` repository and clone it locally.

1. Make sure you have [node.js](https://nodejs.org/) 12.x installed.

1. Make sure you have [npm](https://www.npmjs.com/) installed.

1. When in the `vaadin-progress-bar` directory, run `npm install` to install dependencies.

1. Run `npm start`, browser will automatically open the component API documentation.

1. You can also open visual tests, for example:

  - http://localhost:8000/test/visual/default.html


## Running tests from the command line

1. When in the `vaadin-progress-bar` directory, run `npm test`

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
