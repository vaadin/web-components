[![npm version](https://badgen.net/npm/v/@vaadin/vaadin-tabs)](https://www.npmjs.com/package/@vaadin/vaadin-tabs)
[![Bower version](https://badgen.net/github/release/vaadin/vaadin-tabs)](https://github.com/vaadin/vaadin-tabs/releases)
[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://webcomponents.org/element/vaadin/vaadin-tabs)
[![Build Status](https://travis-ci.org/vaadin/vaadin-tabs.svg?branch=master)](https://travis-ci.org/vaadin/vaadin-tabs)
[![Coverage Status](https://coveralls.io/repos/github/vaadin/vaadin-tabs/badge.svg?branch=master)](https://coveralls.io/github/vaadin/vaadin-tabs?branch=master)
[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/vaadin/web-components?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

[![Published on Vaadin  Directory](https://img.shields.io/badge/Vaadin%20Directory-published-00b4f0.svg)](https://vaadin.com/directory/component/vaadinvaadin-tabs)
[![Stars on vaadin.com/directory](https://img.shields.io/vaadin-directory/star/vaadinvaadin-tabs.svg)](https://vaadin.com/directory/component/vaadinvaadin-tabs)

# &lt;vaadin-tabs&gt;

[Live Demo ↗](https://vaadin.com/components/vaadin-tabs/html-examples)
|
[API documentation ↗](https://vaadin.com/components/vaadin-tabs/html-api)


[&lt;vaadin-tabs&gt;](https://vaadin.com/components/vaadin-tabs) is a Web Component providing item navigation part of the [Vaadin components](https://vaadin.com/components). It is designed for menu and tab components.

<!--
```
<custom-element-demo>
  <template>
    <script src="../webcomponentsjs/webcomponents-lite.js"></script>
    <link rel="import" href="vaadin-tabs.html">
    <next-code-block></next-code-block>
  </template>
</custom-element-demo>
```
-->
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

The Vaadin components are distributed as Bower and npm packages.
Please note that the version range is the same, as the API has not changed.
You should not mix Bower and npm versions in the same application, though.

Unlike the official Polymer Elements, the converted Polymer 3 compatible Vaadin components
are only published on npm, not pushed to GitHub repositories.

### Polymer 2 and HTML Imports Compatible Version

Install `vaadin-tabs`:

```sh
bower i vaadin/vaadin-tabs --save
```

Once installed, import it in your application:

```html
<link rel="import" href="bower_components/vaadin-tabs/vaadin-tabs.html">
```
### Polymer 3 and ES Modules Compatible Version

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

  `theme/lumo/vaadin-tab.html`  
  `theme/lumo/vaadin-tabs.html`

- The components with the Material theme:

  `theme/material/vaadin-tab.html`  
  `theme/material/vaadin-tabs.html`

- Alias for `theme/lumo/vaadin-tab.html`   
  `theme/lumo/vaadin-tabs.html`:

  `vaadin-tab.html`
  `vaadin-tabs.html`


## Running demos and tests in a browser

1. Fork the `vaadin-tabs` repository and clone it locally.

1. Make sure you have [npm](https://www.npmjs.com/) and [Bower](https://bower.io) installed.

1. When in the `vaadin-tabs` directory, run `npm install` and then `bower install` to install dependencies.

1. Run `npm start`, browser will automatically open the component API documentation.

1. You can also open demo or in-browser tests by adding **demo** or **test** to the URL, for example:

  - http://127.0.0.1:3000/components/vaadin-tabs/demo
  - http://127.0.0.1:3000/components/vaadin-tabs/test


## Running tests from the command line

1. When in the `vaadin-tabs` directory, run `polymer test`


## Following the coding style

We are using [ESLint](http://eslint.org/) for linting JavaScript code. You can check if your code is following our standards by running `npm run lint`, which will automatically lint all `.js` files as well as JavaScript snippets inside `.html` files.


## Big Thanks

Cross-browser Testing Platform and Open Source <3 Provided by [Sauce Labs](https://saucelabs.com).


## Contributing

  To contribute to the component, please read [the guideline](https://github.com/vaadin/vaadin-core/blob/master/CONTRIBUTING.md) first.


## License

Apache License 2.0

Vaadin collects development time usage statistics to improve this product. For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
