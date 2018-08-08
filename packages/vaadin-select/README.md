[![npm version](https://badgen.net/npm/v/@vaadin/vaadin-dropdown-menu)](https://www.npmjs.com/package/@vaadin/vaadin-dropdown-menu)
[![Bower version](https://badgen.net/github/release/vaadin/vaadin-dropdown-menu)](https://github.com/vaadin/vaadin-dropdown-menu/releases)
[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/vaadin/vaadin-dropdown-menu)
[![Build Status](https://travis-ci.org/vaadin/vaadin-dropdown-menu.svg?branch=master)](https://travis-ci.org/vaadin/vaadin-dropdown-menu)
[![Coverage Status](https://coveralls.io/repos/github/vaadin/vaadin-dropdown-menu/badge.svg?branch=master)](https://coveralls.io/github/vaadin/vaadin-dropdown-menu?branch=master)
[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/vaadin/web-components?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

[![Published on Vaadin  Directory](https://img.shields.io/badge/Vaadin%20Directory-published-00b4f0.svg)](https://vaadin.com/directory/component/vaadinvaadin-dropdown-menu)
[![Stars on vaadin.com/directory](https://img.shields.io/vaadin-directory/star/vaadinvaadin-dropdown-menu.svg)](https://vaadin.com/directory/component/vaadinvaadin-dropdown-menu)

# &lt;vaadin-dropdown-menu&gt;

[Live Demo ↗](https://vaadin.com/components/vaadin-dropdown-menu/html-examples)
|
[API documentation ↗](https://vaadin.com/components/vaadin-dropdown-menu/html-api)


[&lt;vaadin-dropdown-menu&gt;](https://vaadin.com/components/vaadin-dropdown-menu) is a Web Component similar to a native browser select element, part of the [Vaadin components](https://vaadin.com/components).

<!--
```
<custom-element-demo height="425">
  <template>
    <script src="../webcomponentsjs/webcomponents-lite.js"></script>
    <link rel="import" href="vaadin-dropdown-menu.html">
    <next-code-block></next-code-block>
  </template>
</custom-element-demo>
```
-->
```html
<vaadin-dropdown-menu label="Label" placeholder="Placeholder" value="Option one">
  <template>
    <vaadin-list-box>
      <vaadin-item>Option one</vaadin-item>
      <vaadin-item>Option two</vaadin-item>
      <vaadin-item>Option three</vaadin-item>
      <hr>
      <vaadin-item disabled>Option four</vaadin-item>
    </vaadin-list-box>
  </template>
</vaadin-dropdown-menu>
```

[<img src="https://raw.githubusercontent.com/vaadin/vaadin-dropdown-menu/master/screenshot.gif" width="220" alt="Screenshot of vaadin-dropdown-menu">](https://vaadin.com/components/vaadin-dropdown-menu)

## Installation

The Vaadin components are distributed as Bower and npm packages.
Please note that the version range is the same, as the API has not changed.
You should not mix Bower and npm versions in the same application, though.

Unlike the official Polymer Elements, the converted Polymer 3 compatible Vaadin components
are only published on npm, not pushed to GitHub repositories.

### Polymer 2 and HTML Imports Compatible Version

Install `vaadin-dropdown-menu`:

```sh
bower i vaadin/vaadin-dropdown-menu --save
```

Once installed, import it in your application:

```html
<link rel="import" href="bower_components/vaadin-dropdown-menu/vaadin-dropdown-menu.html">
```
### Polymer 3 and ES Modules Compatible Version

Install `vaadin-dropdown-menu`:

```sh
npm i @vaadin/vaadin-dropdown-menu --save
```

Once installed, import it in your application:

```js
import '@vaadin/vaadin-dropdown-menu/vaadin-dropdown-menu.js';
```

## Getting started

Vaadin components use the Lumo theme by default.

To use the Material theme, import the correspondent file from the `theme/material` folder.

## Entry points

- The component with the Lumo theme:

  `theme/lumo/vaadin-dropdown-menu.html`

- The component with the Material theme:

- `theme/material/vaadin-dropdown-menu.html`

- Alias for `theme/lumo/vaadin-dropdown-menu.html`:

- `vaadin-dropdown-menu.html`


## Running demos and tests in browser

1. Fork the `vaadin-dropdown-menu` repository and clone it locally.

1. Make sure you have [npm](https://www.npmjs.com/) installed.

1. When in the `vaadin-dropdown-menu` directory, run `npm install` and then `bower install` to install dependencies.

1. Run `polymer serve --open`, browser will automatically open the component API documentation.

1. You can also open demo or in-browser tests by adding **demo** or **test** to the URL, for example:

  - http://127.0.0.1:8080/components/vaadin-dropdown-menu/demo
  - http://127.0.0.1:8080/components/vaadin-dropdown-menu/test


## Running tests from the command line

1. When in the `vaadin-dropdown-menu` directory, run `polymer test`


## Following the coding style

We are using [ESLint](http://eslint.org/) for linting JavaScript code. You can check if your code is following our standards by running `gulp lint`, which will automatically lint all `.js` files as well as JavaScript snippets inside `.html` files.


## Contributing

  To contribute to the component, please read [the guideline](https://github.com/vaadin/vaadin-core/blob/master/CONTRIBUTING.md) first.


## License

Apache License 2.0

Vaadin collects development time usage statistics to improve this product. For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
