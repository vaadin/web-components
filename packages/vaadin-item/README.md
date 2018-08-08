[![npm version](https://badgen.net/npm/v/@vaadin/vaadin-checkbox)](https://www.npmjs.com/package/@vaadin/vaadin-checkbox)
[![Bower version](https://badgen.net/github/release/vaadin/vaadin-checkbox)](https://github.com/vaadin/vaadin-checkbox/releases)
[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/vaadin/vaadin-item)
[![Build Status](https://travis-ci.org/vaadin/vaadin-item.svg?branch=master)](https://travis-ci.org/vaadin/vaadin-item)
[![Coverage Status](https://coveralls.io/repos/github/vaadin/vaadin-item/badge.svg?branch=master)](https://coveralls.io/github/vaadin/vaadin-item?branch=master)
[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/vaadin/web-components?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

[![Published on Vaadin  Directory](https://img.shields.io/badge/Vaadin%20Directory-published-00b4f0.svg)](https://vaadin.com/directory/component/vaadinvaadin-item)
[![Stars on vaadin.com/directory](https://img.shields.io/vaadin-directory/star/vaadinvaadin-item.svg)](https://vaadin.com/directory/component/vaadinvaadin-item)

# &lt;vaadin-item&gt;

[Live Demo ↗](https://vaadin.com/components/vaadin-item/html-examples)
|
[API documentation ↗](https://vaadin.com/components/vaadin-item/html-api)


[&lt;vaadin-item&gt;](https://vaadin.com/components/vaadin-item) is a Web Component providing a container for item elements, part of the [Vaadin components](https://vaadin.com/components).

<!--
```
<custom-element-demo>
  <template>
    <script src="../webcomponentsjs/webcomponents-lite.js"></script>
    <link rel="import" href="vaadin-item.html">
    <next-code-block></next-code-block>
  </template>
</custom-element-demo>
```
-->
```html
<vaadin-item>Simple Item</vaadin-item>
<vaadin-item disabled>Disabled Item</vaadin-item>
```

[<img src="https://raw.githubusercontent.com/vaadin/vaadin-item/master/screenshot.png" width="169" alt="Screenshot of vaadin-item">](https://vaadin.com/components/vaadin-item)

## Installation

The Vaadin components are distributed as Bower and npm packages.
Please note that the version range is the same, as the API has not changed.
You should not mix Bower and npm versions in the same application, though.

Unlike the official Polymer Elements, the converted Polymer 3 compatible Vaadin components
are only published on npm, not pushed to GitHub repositories.

### Polymer 2 and HTML Imports Compatible Version

Install `vaadin-item`:

```sh
bower i vaadin/vaadin-item --save
```

Once installed, import it in your application:

```html
<link rel="import" href="bower_components/vaadin-item/vaadin-item.html">
```
### Polymer 3 and ES Modules Compatible Version

Install `vaadin-item`:

```sh
npm i @vaadin/vaadin-item --save
```

Once installed, import it in your application:

```js
import '@vaadin/vaadin-item/vaadin-item.js';
```

## Getting started

Vaadin components use the Lumo theme by default.

To use the Material theme, import the correspondent file from the `theme/material` folder.

## Entry points

- The component with the Lumo theme:

  `theme/lumo/vaadin-item.html`

- The component with the Material theme:

  `theme/material/vaadin-item.html`

- Alias for `theme/lumo/vaadin-item.html`:

  `vaadin-item.html`


## Running demos and tests in browser

1. Fork the `vaadin-item` repository and clone it locally.

1. Make sure you have [npm](https://www.npmjs.com/) installed.

1. When in the `vaadin-item` directory, run `npm install` and then `bower install` to install dependencies.

1. Run `polymer serve --open`, browser will automatically open the component API documentation.

1. You can also open demo or in-browser tests by adding **demo** or **test** to the URL, for example:

  - http://127.0.0.1:8080/components/vaadin-item/demo
  - http://127.0.0.1:8080/components/vaadin-item/test


## Running tests from the command line

1. When in the `vaadin-item` directory, run `polymer test`


## Following the coding style

We are using [ESLint](http://eslint.org/) for linting JavaScript code. You can check if your code is following our standards by running `gulp lint`, which will automatically lint all `.js` files as well as JavaScript snippets inside `.html` files.


## Contributing

  To contribute to the component, please read [the guideline](https://github.com/vaadin/vaadin-core/blob/master/CONTRIBUTING.md) first.


## License

Apache License 2.0
