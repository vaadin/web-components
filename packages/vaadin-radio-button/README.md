[![npm version](https://badgen.net/npm/v/@vaadin/vaadin-radio-button)](https://www.npmjs.com/package/@vaadin/vaadin-radio-button)
[![Bower version](https://badgen.net/github/release/vaadin/vaadin-radio-button)](https://github.com/vaadin/vaadin-radio-button/releases)
[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/vaadin/vaadin-radio-button)
[![Build Status](https://travis-ci.org/vaadin/vaadin-radio-button.svg?branch=master)](https://travis-ci.org/vaadin/vaadin-radio-button)
[![Coverage Status](https://coveralls.io/repos/github/vaadin/vaadin-radio-button/badge.svg?branch=master)](https://coveralls.io/github/vaadin/vaadin-radio-button?branch=master)
[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/vaadin/web-components?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

[![Published on Vaadin  Directory](https://img.shields.io/badge/Vaadin%20Directory-published-00b4f0.svg)](https://vaadin.com/directory/component/vaadinvaadin-radio-button)
[![Stars on vaadin.com/directory](https://img.shields.io/vaadin-directory/star/vaadinvaadin-radio-button.svg)](https://vaadin.com/directory/component/vaadinvaadin-radio-button)

# &lt;vaadin-radio-button&gt;

[Live Demo ↗](https://vaadin.com/components/vaadin-radio-button/html-examples)
|
[API documentation ↗](https://vaadin.com/components/vaadin-radio-button/html-api)

[&lt;vaadin-radio-button&gt;](https://vaadin.com/components/vaadin-radio-button) is a Web Component providing an accessible and customizable radio button, part of the [Vaadin components](https://vaadin.com/components).

<!--
```
<custom-element-demo>
  <template>
    <script src="../webcomponentsjs/webcomponents-lite.js"></script>
    <link rel="import" href="vaadin-radio-button.html">
    <link rel="import" href="vaadin-radio-group.html">
    <next-code-block></next-code-block>
  </template>
</custom-element-demo>
```
-->
```html
<vaadin-radio-group name="radio-group" value="bar">
  <vaadin-radio-button value="foo">Foo</vaadin-radio-button>
  <vaadin-radio-button value="bar">Bar</vaadin-radio-button>
  <vaadin-radio-button value="baz">Baz</vaadin-radio-button>
</vaadin-radio-group>
```

[<img src="https://raw.githubusercontent.com/vaadin/vaadin-radio-button/master/screenshot.png" width="237" alt="Screenshot of vaadin-radio-group">](https://vaadin.com/components/vaadin-radio-button)

## Installation

The Vaadin components are distributed as Bower and npm packages.
Please note that the version range is the same, as the API has not changed.
You should not mix Bower and npm versions in the same application, though.

Unlike the official Polymer Elements, the converted Polymer 3 compatible Vaadin components
are only published on npm, not pushed to GitHub repositories.

### Polymer 2 and HTML Imports Compatible Version

Install `vaadin-radio-button`:

```sh
bower i vaadin/vaadin-radio-button --save
```

Once installed, import it in your application:

```html
<link rel="import" href="bower_components/vaadin-radio-button/vaadin-radio-button.html">
```
### Polymer 3 and ES Modules Compatible Version

Install `vaadin-radio-button`:

```sh
npm i @vaadin/vaadin-radio-button --save
```

Once installed, import it in your application:

```js
import '@vaadin/vaadin-radio-button/vaadin-radio-button.js';
```

## Getting started

Vaadin components use the Lumo theme by default.

To use the Material theme, import the correspondent file from the `theme/material` folder.

## Entry points

- The components with the Lumo theme:

  `theme/lumo/vaadin-radio-button.html`  
  `theme/lumo/vaadin-radio-group.html`

- The components with the Material theme:

  `theme/material/vaadin-radio-button.html`  
  `theme/material/vaadin-radio-group.html`

- Alias for `theme/lumo/vaadin-radio-button.html`  
  `theme/lumo/vaadin-radio-group.html`:

  `vaadin-radio-button.html`  
  `vaadin-radio-group.html`


## Running demos and tests in a browser

1. Fork the `vaadin-radio-button` repository and clone it locally.

1. Make sure you have [npm](https://www.npmjs.com/) and [Bower](https://bower.io) installed.

1. When in the `vaadin-radio-button` directory, run `npm install` and then `bower install` to install dependencies.

1. Run `npm start`, browser will automatically open the component API documentation.

1. You can also open demo or in-browser tests by adding **demo** or **test** to the URL, for example:

  - http://127.0.0.1:3000/components/vaadin-radio-button/demo
  - http://127.0.0.1:3000/components/vaadin-radio-button/test


## Running tests from the command line

1. When in the `vaadin-radio-button` directory, run `polymer test`


## Following the coding style

We are using [ESLint](http://eslint.org/) for linting JavaScript code. You can check if your code is following our standards by running `npm run lint`, which will automatically lint all `.js` files as well as JavaScript snippets inside `.html` files.


## Big Thanks

Cross-browser Testing Platform and Open Source <3 Provided by [Sauce Labs](https://saucelabs.com).


## Contributing

  To contribute to the component, please read [the guideline](https://github.com/vaadin/vaadin-core/blob/master/CONTRIBUTING.md) first.


## License

Apache License 2.0

Vaadin collects development time usage statistics to improve this product. For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
