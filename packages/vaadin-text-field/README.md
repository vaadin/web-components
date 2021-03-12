[![npm version](https://badge.fury.io/js/%40vaadin%2Fvaadin-text-field.svg)](https://badge.fury.io/js/%40vaadin%2Fvaadin-text-field)
[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/vaadin/vaadin-text-field)
[![Build Status](https://travis-ci.org/vaadin/vaadin-text-field.svg?branch=master)](https://travis-ci.org/vaadin/vaadin-text-field)
[![Coverage Status](https://coveralls.io/repos/github/vaadin/vaadin-text-field/badge.svg?branch=master)](https://coveralls.io/github/vaadin/vaadin-text-field?branch=master)
[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/vaadin/web-components?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

[![Published on Vaadin  Directory](https://img.shields.io/badge/Vaadin%20Directory-published-00b4f0.svg)](https://vaadin.com/directory/component/vaadinvaadin-text-field)
[![Stars on vaadin.com/directory](https://img.shields.io/vaadin-directory/star/vaadinvaadin-text-field.svg)](https://vaadin.com/directory/component/vaadinvaadin-text-field)

# &lt;vaadin-text-field&gt;

[Live Demo ↗](https://vaadin.com/components/vaadin-text-field/html-examples)
|
[API documentation ↗](https://vaadin.com/components/vaadin-text-field/html-api)

[&lt;vaadin-text-field&gt;](https://vaadin.com/components/vaadin-text-field) is a themable Web Component providing input controls in forms, part of the [Vaadin components](https://vaadin.com/components).

```html
<vaadin-text-field label="Username"></vaadin-text-field>
<vaadin-password-field label="Password"></vaadin-password-field>
<vaadin-text-area label="Description"></vaadin-text-area>
<vaadin-email-field label="Email"></vaadin-email-field>
<vaadin-number-field label="Price"></vaadin-number-field>
<vaadin-integer-field label="Count" has-controls></vaadin-integer-field>
```

[<img src="https://raw.githubusercontent.com/vaadin/vaadin-text-field/master/screenshot.png" width="710" alt="Screenshot of vaadin-text-field">](https://vaadin.com/components/vaadin-text-field)

## Installation

Install `vaadin-text-field`:

```sh
npm i @vaadin/vaadin-text-field --save
```

Once installed, import the components you need in your application:

```js
import '@vaadin/vaadin-text-field/vaadin-text-field.js';
import '@vaadin/vaadin-text-field/vaadin-text-area.js';
import '@vaadin/vaadin-text-field/vaadin-password-field.js';
import '@vaadin/vaadin-text-field/vaadin-email-field.js';
import '@vaadin/vaadin-text-field/vaadin-number-field.js';
import '@vaadin/vaadin-text-field/vaadin-integer-field.js';
```

## Getting started

Vaadin components use the Lumo theme by default.

To use the Material theme, import the correspondent file from the `theme/material` folder.

## Entry points

- The components with the Lumo theme:

  `theme/lumo/vaadin-text-field.js`
  `theme/lumo/vaadin-text-area.js`
  `theme/lumo/vaadin-password-field.js`
  `theme/lumo/vaadin-email-field.js`
  `theme/lumo/vaadin-number-field.js`
  `theme/lumo/vaadin-integer-field.js`

- The components with the Material theme:

  `theme/material/vaadin-text-field.js`
  `theme/material/vaadin-text-area.js`
  `theme/material/vaadin-password-field.js`
  `theme/material/vaadin-email-field.js`
  `theme/material/vaadin-number-field.js`
  `theme/material/vaadin-integer-field.js`

- Aliases for `theme/lumo/vaadin-text-field.js`
  `theme/lumo/vaadin-text-area.js`
  `theme/lumo/vaadin-password-field.js`
  `theme/lumo/vaadin-email-field.js`
  `theme/lumo/vaadin-number-field.js`
  `theme/lumo/vaadin-integer-field.js`:

  `vaadin-text-field.js`
  `vaadin-text-area.js`
  `vaadin-password-field.js`
  `vaadin-email-field.js`
  `vaadin-number-field.js`
  `vaadin-integer-field.js`


## Running API docs and tests in a browser

1. Fork the `vaadin-text-field` repository and clone it locally.

1. Make sure you have [node.js](https://nodejs.org/) 12.x installed.

1. Make sure you have [npm](https://www.npmjs.com/) installed.

1. When in the `vaadin-text-field` directory, run `npm install` to install dependencies.

1. Run `npm start`, browser will automatically open the component API documentation.

1. You can also open visual tests, for example:

  - http://127.0.0.1:3000/test/visual/vaadin-text-field/text-field-1.html


## Running tests from the command line

1. When in the `vaadin-text-field` directory, run `npm test`

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
