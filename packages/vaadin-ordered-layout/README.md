![Bower version](https://img.shields.io/bower/v/vaadin-ordered-layout.svg)
[![npm version](https://badge.fury.io/js/%40vaadin%2Fvaadin-ordered-layout.svg)](https://badge.fury.io/js/%40vaadin%2Fvaadin-ordered-layout)
[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://beta.webcomponents.org/element/vaadin/vaadin-ordered-layout)
[![Build Status](https://travis-ci.org/vaadin/vaadin-ordered-layout.svg?branch=master)](https://travis-ci.org/vaadin/vaadin-ordered-layout)
[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/vaadin/web-components?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

# &lt;vaadin-ordered-layout&gt;

[Live Demo ↗](https://vaadin.com/components/vaadin-ordered-layout/html-examples)
|
[API documentation ↗](https://vaadin.com/components/vaadin-ordered-layout/html-api)


[&lt;vaadin-ordered-layout&gt;](https://vaadin.com/components/vaadin-ordered-layout) consist of two [Polymer 2](http://polymer-project.org) elements providing a simple way to horizontally or vertically align your HTML elements, part of the [Vaadin components](https://vaadin.com/components).

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

## Getting Started

Vaadin components use the Lumo theme by default.

## The file structure for Vaadin components

- `src/vaadin-horizontal-layout.html`
- `src/vaadin-vertical-layout.html`

  Unstyled components.

- `theme/lumo/vaadin-horizontal-layout.html`
- `theme/lumo/vaadin-vertical-layout.html`

  Components with Lumo theme.

- `vaadin-horizontal-layout.html`
- `vaadin-vertical-layout.html`

  Alias for theme/lumo/vaadin-horizontal-layout.html
  theme/lumo/vaadin-vertical-layout.html

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

  - Make sure your code is compliant with our code linters: `gulp lint`
  - Check that tests are passing: `polymer test`
  - [Submit a pull request](https://www.digitalocean.com/community/tutorials/how-to-create-a-pull-request-on-github) with detailed title and description
  - Wait for response from one of Vaadin components team members


## License

Apache License 2.0
