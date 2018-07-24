[![npm version](https://badge.fury.io/js/%40vaadin%2Fvaadin-ordered-layout.svg)](https://badge.fury.io/js/%40vaadin%2Fvaadin-ordered-layout)
[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/vaadin/vaadin-ordered-layout)
[![Build Status](https://travis-ci.org/vaadin/vaadin-ordered-layout.svg?branch=master)](https://travis-ci.org/vaadin/vaadin-ordered-layout)
[![Coverage Status](https://coveralls.io/repos/github/vaadin/vaadin-ordered-layout/badge.svg?branch=master)](https://coveralls.io/github/vaadin/vaadin-ordered-layout?branch=master)
[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/vaadin/web-components?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

[![Published on Vaadin  Directory](https://img.shields.io/badge/Vaadin%20Directory-published-00b4f0.svg)](https://vaadin.com/directory/component/vaadinvaadin-ordered-layout)
[![Stars on vaadin.com/directory](https://img.shields.io/vaadin-directory/star/vaadinvaadin-ordered-layout.svg)](https://vaadin.com/directory/component/vaadinvaadin-ordered-layout)

# &lt;vaadin-ordered-layout&gt;

[Live Demo ↗](https://vaadin.com/components/vaadin-ordered-layout/html-examples)
|
[API documentation ↗](https://vaadin.com/components/vaadin-ordered-layout/html-api)


[&lt;vaadin-ordered-layout&gt;](https://vaadin.com/components/vaadin-ordered-layout) consist of two Web Components providing a simple way to horizontally or vertically align your HTML elements, part of the [Vaadin components](https://vaadin.com/components).

<!--
```
<custom-element-demo>
  <template>
    <script src="../webcomponentsjs/webcomponents-lite.js"></script>
    <link rel="import" href="vaadin-horizontal-layout.html">
    <link rel="import" href="vaadin-vertical-layout.html">
    <next-code-block></next-code-block>
  </template>
</custom-element-demo>
```
-->
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

The Vaadin components are distributed as Bower and npm packages.
Please note that the version range is the same, as the API has not changed.
You should not mix Bower and npm versions in the same application, though.

Unlike the official Polymer Elements, the converted Polymer 3 compatible Vaadin components
are only published on npm, not pushed to GitHub repositories.

### Polymer 2 and HTML Imports Compatible Version

Install `vaadin-ordered-layout`:

```sh
bower i vaadin/vaadin-ordered-layout --save
```

Once installed, import it in your application:

```html
<link rel="import" href="bower_components/vaadin-ordered-layout/vaadin-vertical-layout.html">
```
### Polymer 3 and ES Modules Compatible Version

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

  `theme/lumo/vaadin-horizontal-layout.html`  
  `theme/lumo/vaadin-vertical-layout.html`

- The components with the Material theme:

  `theme/material/vaadin-horizontal-layout.html`  
  `theme/material/vaadin-vertical-layout.html`

- Alias for `theme/lumo/vaadin-horizontal-layout.html`  
  `theme/lumo/vaadin-vertical-layout.html`:

  `vaadin-horizontal-layout.html`  
  `vaadin-vertical-layout.html`


## Running demos and tests in browser

1. Fork the `vaadin-ordered-layout` repository and clone it locally.

1. Make sure you have [npm](https://www.npmjs.com/) installed.

1. When in the `vaadin-ordered-layout` directory, run `npm install` and then `bower install` to install dependencies.

1. Run `polymer serve --open`, browser will automatically open the component API documentation.

1. You can also open demo or in-browser tests by adding **demo** or **test** to the URL, for example:

  - http://127.0.0.1:8080/components/vaadin-ordered-layout/demo
  - http://127.0.0.1:8080/components/vaadin-ordered-layout/test


## Running tests from the command line

1. When in the `vaadin-ordered-layout` directory, run `polymer test`


## Following the coding style

We are using [ESLint](http://eslint.org/) for linting JavaScript code. You can check if your code is following our standards by running `gulp lint`, which will automatically lint all `.js` files as well as JavaScript snippets inside `.html` files.


## Contributing

  To contribute to the component, please read [the guideline](https://github.com/vaadin/vaadin-core/blob/master/CONTRIBUTING.md) first.


## License

Apache License 2.0
