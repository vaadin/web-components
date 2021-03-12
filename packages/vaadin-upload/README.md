[![npm version](https://badgen.net/npm/v/@vaadin/vaadin-upload)](https://www.npmjs.com/package/@vaadin/vaadin-upload)
[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/vaadin/vaadin-upload)
[![Build Status](https://travis-ci.org/vaadin/vaadin-upload.svg?branch=master)](https://travis-ci.org/vaadin/vaadin-upload)
[![Coverage Status](https://coveralls.io/repos/github/vaadin/vaadin-upload/badge.svg?branch=master)](https://coveralls.io/github/vaadin/vaadin-upload?branch=master)
[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/vaadin/web-components?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

[![Published on Vaadin  Directory](https://img.shields.io/badge/Vaadin%20Directory-published-00b4f0.svg)](https://vaadin.com/directory/component/vaadinvaadin-upload)
[![Stars on vaadin.com/directory](https://img.shields.io/vaadin-directory/star/vaadinvaadin-upload.svg)](https://vaadin.com/directory/component/vaadinvaadin-upload)

# &lt;vaadin-upload&gt;

[Live Demo ↗](https://vaadin.com/components/vaadin-upload/html-examples/upload-basic-demos)
|
[API documentation ↗](https://vaadin.com/components/vaadin-upload/html-api)

[&lt;vaadin-upload&gt;](https://vaadin.com/components/vaadin-upload) is a Web Component for uploading files, part of the [Vaadin components](https://vaadin.com/components).

```html
<vaadin-upload accept=".pdf">
  <span slot="drop-label">Drop your favourite Novels here (PDF files only)</span>
</vaadin-upload>
```

[<img src="https://raw.githubusercontent.com/vaadin/vaadin-upload/master/screenshot.png" alt="Screenshot of vaadin-upload" width="670" />](https://vaadin.com/components/vaadin-upload)

## Installation

Install `vaadin-upload`:

```sh
npm i @vaadin/vaadin-upload --save
```

Once installed, import it in your application:

```js
import '@vaadin/vaadin-upload/vaadin-upload.js';
```

## Getting started

Vaadin components use the Lumo theme by default.

To use the Material theme, import the correspondent file from the `theme/material` folder.

## Entry points

- The component with the Lumo theme:

  `theme/lumo/vaadin-upload.js`

- The component with the Material theme:

  `theme/material/vaadin-upload.js`

- Alias for `theme/lumo/vaadin-upload.js`:

  `vaadin-upload.js`


## Running API docs and tests in a browser

1. Fork the `vaadin-upload` repository and clone it locally.

1. Make sure you have [node.js](https://nodejs.org/) 12.x installed.

1. Make sure you have [npm](https://www.npmjs.com/) installed.

1. When in the `vaadin-upload` directory, run `npm install` to install dependencies.

1. Run `npm start`, browser will automatically open the component API documentation.

1. You can also open visual tests, for example:

  - http://127.0.0.1:3000/test/visual/upload.html


## Running tests from the command line

1. When in the `vaadin-upload` directory, run `npm test`

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
