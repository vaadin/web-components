# &lt;vaadin-details&gt;

[&lt;vaadin-details&gt;](https://vaadin.com/components/vaadin-details) is a Web Component providing functionality for expandable details, part of the [Vaadin components](https://vaadin.com/components).

[Live Demo ↗](https://vaadin.com/components/vaadin-details/html-examples)
|
[API documentation ↗](https://vaadin.com/components/vaadin-details/html-api)

[![npm version](https://badgen.net/npm/v/@vaadin/vaadin-details)](https://www.npmjs.com/package/@vaadin/vaadin-details)
[![Build Status](https://travis-ci.org/vaadin/vaadin-details.svg?branch=master)](https://travis-ci.org/vaadin/vaadin-details)
[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/vaadin/vaadin-details)
[![Published on Vaadin Directory](https://img.shields.io/badge/Vaadin%20Directory-published-00b4f0.svg)](https://vaadin.com/directory/component/vaadinvaadin-details)
[![Stars on vaadin.com/directory](https://img.shields.io/vaadin-directory/star/vaadin-details-directory-urlidentifier.svg)](https://vaadin.com/directory/component/vaadinvaadin-details)
[![Discord](https://img.shields.io/discord/732335336448852018?label=discord)](https://discord.gg/PHmkCKC)

```html
<vaadin-details opened>
  <div slot="summary">Expandable Details</div>
  Toggle using mouse, Enter and Space keys.
</vaadin-details>
```

[<img src="https://raw.githubusercontent.com/vaadin/vaadin-details/master/screenshot.png" alt="Screenshot of vaadin-details" width="320">](https://vaadin.com/components/vaadin-details)


## Installation

Install `vaadin-details`:

```sh
npm i @vaadin/vaadin-details --save
```

Once installed, import it in your application:

```js
import '@vaadin/vaadin-details/vaadin-details.js';
```

## Getting started

Vaadin components use the Lumo theme by default.

To use the Material theme, import the correspondent file from the `theme/material` folder.

## Entry points

- The component with the Lumo theme:

  `theme/lumo/vaadin-details.js`

- The component with the Material theme:

  `theme/material/vaadin-details.js`

- Alias for `theme/lumo/vaadin-details.js`:

  `vaadin-details.js`

## Running API docs and tests in a browser

1. Fork the `vaadin-details` repository and clone it locally.

1. Make sure you have [node.js](https://nodejs.org/) 12.x installed.

1. Make sure you have [npm](https://www.npmjs.com/) installed.

1. When in the `vaadin-details` directory, run `npm install` to install dependencies.

1. Run `npm start`, browser will automatically open the component API documentation.

1. You can also open visual tests, for example:

  - http://localhost:8000/test/visual/details.html


## Running tests from the command line

1. When in the `vaadin-details` directory, run `npm test`

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
