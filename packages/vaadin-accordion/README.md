# &lt;vaadin-accordion&gt;

[&lt;vaadin-accordion&gt;](https://vaadin.com/components/vaadin-accordion) is a Web Component implementing the vertically stacked set of expandable panels, part of the [Vaadin components](https://vaadin.com/components).

[Live Demo ↗](https://vaadin.com/components/vaadin-accordion/html-examples)
|
[API documentation ↗](https://vaadin.com/components/vaadin-accordion/html-api)

[![npm version](https://badgen.net/npm/v/@vaadin/vaadin-accordion)](https://www.npmjs.com/package/@vaadin/vaadin-accordion)
[![Bower version](https://badgen.net/github/release/vaadin/vaadin-accordion)](https://github.com/vaadin/vaadin-accordion/releases)
[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/vaadin/vaadin-accordion)
[![Build Status](https://travis-ci.org/vaadin/vaadin-accordion.svg?branch=master)](https://travis-ci.org/vaadin/vaadin-accordion)
[![Coverage Status](https://coveralls.io/repos/github/vaadin/vaadin-accordion/badge.svg?branch=master)](https://coveralls.io/github/vaadin/vaadin-accordion?branch=master)
[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/vaadin/web-components?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)
[![Published on Vaadin Directory](https://img.shields.io/badge/Vaadin%20Directory-published-00b4f0.svg)](https://vaadin.com/directory/component/vaadinvaadin-accordion)
[![Stars on vaadin.com/directory](https://img.shields.io/vaadin-directory/star/vaadin-accordion-directory-urlidentifier.svg)](https://vaadin.com/directory/component/vaadinvaadin-accordion)
<!--
```
<custom-element-demo>
  <template>
    <script src="../webcomponentsjs/webcomponents-lite.js"></script>
    <link rel="import" href="vaadin-accordion.html">
    <next-code-block></next-code-block>
  </template>
</custom-element-demo>
```
-->
```html
<vaadin-accordion>
  <vaadin-accordion-panel theme="filled">
    <div slot="summary">Accordion Panel 1</div>
    <div>Accordion is a set of expandable sections.</div>
  </vaadin-accordion-panel>
  <vaadin-accordion-panel theme="filled">
    <div slot="summary">Accordion Panel 2</div>
    <div>Only one accordion panel can be opened.</div>
  </vaadin-accordion-panel>
</vaadin-accordion>
```

[<img src="https://raw.githubusercontent.com/vaadin/vaadin-accordion/master/screenshot.png" alt="Screenshot of vaadin-accordion" width="900">](https://vaadin.com/components/vaadin-accordion)


## Installation

The Vaadin components are distributed as Bower and npm packages.
Please note that the version range is the same, as the API has not changed.
You should not mix Bower and npm versions in the same application, though.

Unlike the official Polymer Elements, the converted Polymer 3 compatible Vaadin components
are only published on npm, not pushed to GitHub repositories.

### Polymer 2 and HTML Imports compatible version

Install `vaadin-accordion`:

```sh
bower i vaadin/vaadin-accordion --save
```

Once installed, import it in your application:

```html
<link rel="import" href="bower_components/vaadin-accordion/vaadin-accordion.html">
```

### Polymer 3 and ES Modules compatible version


Install `vaadin-accordion`:

```sh
npm i @vaadin/vaadin-accordion --save
```

Once installed, import it in your application:

```js
import '@vaadin/vaadin-accordion/vaadin-accordion.js';
```

## Getting started

Vaadin components use the Lumo theme by default.

To use the Material theme, import the correspondent file from the `theme/material` folder.

## Entry points

- The component with the Lumo theme:

  `theme/lumo/vaadin-accordion.html`

- The component with the Material theme:

  `theme/material/vaadin-accordion.html`

- Alias for `theme/lumo/vaadin-accordion.html`:

  `vaadin-accordion.html`


## Running demos and tests in a browser

1. Fork the `vaadin-accordion` repository and clone it locally.

1. Make sure you have [npm](https://www.npmjs.com/) and [Bower](https://bower.io) installed.

1. When in the `vaadin-accordion` directory, run `npm install` and then `bower install` to install dependencies.

1. Make sure you have [polymer-cli](https://www.npmjs.com/package/polymer-cli) installed globally: `npm i -g polymer-cli`.

1. Run `npm start`, browser will automatically open the component API documentation.

1. You can also open demo or in-browser tests by adding **demo** or **test** to the URL, for example:

  - http://127.0.0.1:3000/components/vaadin-accordion/demo
  - http://127.0.0.1:3000/components/vaadin-accordion/test


## Running tests from the command line

1. When in the `vaadin-accordion` directory, run `polymer test`


## Following the coding style

We are using [ESLint](http://eslint.org/) for linting JavaScript code. You can check if your code is following our standards by running `npm run lint`, which will automatically lint all `.js` files as well as JavaScript snippets inside `.html` files.


## Big Thanks

Cross-browser Testing Platform and Open Source <3 Provided by [Sauce Labs](https://saucelabs.com).


## Contributing

To contribute to the component, please read [the guideline](https://github.com/vaadin/vaadin-core/blob/master/CONTRIBUTING.md) first.


## License

Apache License 2.0

Vaadin collects development time usage statistics to improve this product. For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
