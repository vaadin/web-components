[![npm version](https://badgen.net/npm/v/@vaadin/vaadin-context-menu)](https://www.npmjs.com/package/@vaadin/vaadin-context-menu)
[![Bower version](https://badgen.net/github/release/vaadin/vaadin-context-menu)](https://github.com/vaadin/vaadin-context-menu/releases)
[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/vaadin/vaadin-context-menu)
[![Build Status](https://travis-ci.org/vaadin/vaadin-context-menu.svg?branch=master)](https://travis-ci.org/vaadin/vaadin-context-menu)
[![Coverage Status](https://coveralls.io/repos/github/vaadin/vaadin-context-menu/badge.svg?branch=master)](https://coveralls.io/github/vaadin/vaadin-context-menu?branch=master)
[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/vaadin/web-components?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

[![Published on Vaadin  Directory](https://img.shields.io/badge/Vaadin%20Directory-published-00b4f0.svg)](https://vaadin.com/directory/component/vaadinvaadin-context-menu)
[![Stars on vaadin.com/directory](https://img.shields.io/vaadin-directory/star/vaadinvaadin-context-menu.svg)](https://vaadin.com/directory/component/vaadinvaadin-context-menu)

# &lt;vaadin-context-menu&gt;

[Live Demo ↗](https://vaadin.com/components/vaadin-context-menu/html-examples)
|
[API documentation ↗](https://vaadin.com/components/vaadin-context-menu/html-api)

[&lt;vaadin-context-menu&gt;](https://vaadin.com/components/vaadin-context-menu) is a Web Component providing a contextual menu, part of the [Vaadin components](https://vaadin.com/components).

<!--
```
<custom-element-demo height="260">
  <template>
    <style>
      vaadin-context-menu {
        font-family: sans-serif;
      }
    </style>
    <script src="../webcomponentsjs/webcomponents-lite.js"></script>
    <link rel="import" href="../vaadin-list-box/vaadin-list-box.html">
    <link rel="import" href="../vaadin-item/vaadin-item.html">
    <link rel="import" href="vaadin-context-menu.html">
    <next-code-block></next-code-block>
  </template>
</custom-element-demo>
```
-->
```html
<vaadin-context-menu>
  <template>
    <vaadin-list-box>
      <vaadin-item>First menu item</vaadin-item>
      <vaadin-item>Second menu item</vaadin-item>
      <vaadin-item>Third menu item</vaadin-item>
      <hr>
      <vaadin-item disabled>Fourth menu item</vaadin-item>
      <vaadin-item disabled>Fifth menu item</vaadin-item>
      <hr>
      <vaadin-item>Sixth menu item</vaadin-item>
    </vaadin-list-box>
  </template>

  Open a context menu with <b>right click</b> or with <b>long touch.</b>
</vaadin-context-menu>
```

[<img src="https://raw.githubusercontent.com/vaadin/vaadin-context-menu/master/screenshot.png" width="493" alt="Screenshot of vaadin-context-menu">](https://vaadin.com/components/vaadin-context-menu)

**Note:** [`<vaadin-list-box>`](https://github.com/vaadin/vaadin-list-box) component used in the above example should be installed and imported separately.

## Installation

The Vaadin components are distributed as Bower and npm packages.
Please note that the version range is the same, as the API has not changed.
You should not mix Bower and npm versions in the same application, though.

Unlike the official Polymer Elements, the converted Polymer 3 compatible Vaadin components
are only published on npm, not pushed to GitHub repositories.

### Polymer 2 and HTML Imports Compatible Version

Install `vaadin-context-menu`:

```sh
bower i vaadin/vaadin-context-menu --save
```

Once installed, import it in your application:

```html
<link rel="import" href="bower_components/vaadin-context-menu/vaadin-context-menu.html">
```
### Polymer 3 and ES Modules Compatible Version

Install `vaadin-context-menu`:

```sh
npm i @vaadin/vaadin-context-menu --save
```

Once installed, import it in your application:

```js
import '@vaadin/vaadin-context-menu/vaadin-context-menu.js';
```

## Getting started

Vaadin components use the Lumo theme by default.

To use the Material theme, import the correspondent file from the `theme/material` folder.

## Entry points

- The component with the Lumo theme:

  `theme/lumo/vaadin-context-menu.html`

- The component with the Material theme:

  `theme/material/vaadin-context-menu.html`

- Alias for `theme/lumo/vaadin-context-menu.html`:

  `vaadin-context-menu.html`


## Running demos and tests in browser

1. Fork the `vaadin-context-menu` repository and clone it locally.

1. Make sure you have [npm](https://www.npmjs.com/) installed.

1. When in the `vaadin-context-menu` directory, run `npm install` and then `bower install` to install dependencies.

1. Run `polymer serve --open`, browser will automatically open the component API documentation.

1. You can also open demo or in-browser tests by adding **demo** or **test** to the URL, for example:

  - http://127.0.0.1:8080/components/vaadin-context-menu/demo
  - http://127.0.0.1:8080/components/vaadin-context-menu/test


## Running tests from the command line

1. When in the `vaadin-context-menu` directory, run `polymer test`


## Following the coding style

We are using [ESLint](http://eslint.org/) for linting JavaScript code. You can check if your code is following our standards by running `gulp lint`, which will automatically lint all `.js` files as well as JavaScript snippets inside `.html` files.


## Big Thanks

Cross-browser Testing Platform and Open Source <3 Provided by [Sauce Labs](https://saucelabs.com).


## Contributing

  To contribute to the component, please read [the guideline](https://github.com/vaadin/vaadin-core/blob/master/CONTRIBUTING.md) first.


## License

Apache License 2.0

Vaadin collects development time usage statistics to improve this product. For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
