![Bower version](https://img.shields.io/bower/v/vaadin-list-box.svg)
[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/vaadin/vaadin-list-box)
[![Build Status](https://travis-ci.org/vaadin/vaadin-list-box.svg?branch=master)](https://travis-ci.org/vaadin/vaadin-list-box)
[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/vaadin/vaadin-core-elements?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

# &lt;vaadin-list-box&gt;

[Live Demo ↗](https://vaadin.com/elements/vaadin-list-box/html-examples)
|
[API documentation ↗](https://vaadin.com/elements/vaadin-list-box/html-api)


[&lt;vaadin-list-box&gt;](https://vaadin.com/elements/vaadin-list-box) is a [Polymer 2](http://polymer-project.org) element providing reusable list boxes, part of the [Vaadin Core Elements](https://vaadin.com/elements).

<!--
```
<custom-element-demo>
  <template>
    <script src="../webcomponentsjs/webcomponents-lite.js"></script>
    <link rel="import" href="vaadin-list-box.html">
    <next-code-block></next-code-block>
  </template>
</custom-element-demo>
```
-->
```html
  <vaadin-list-box selected="2">
    <b>Select an Item</b>
    <vaadin-item>Item one</vaadin-item>
    <vaadin-item>Item two</vaadin-item>
    <hr>
    <vaadin-item>Item three</vaadin-item>
    <vaadin-item>Item four</vaadin-item>
  </vaadin-list-box>
```

[<img src="https://raw.githubusercontent.com/vaadin/vaadin-list-box/master/screenshot.png" width="150" alt="Screenshot of vaadin-list-box">](https://vaadin.com/elements/vaadin-list-box)

## Getting Started

Vaadin Elements use the Lumo theme by default.

## The file structure for Vaadin Elements

- `src/vaadin-list-box.html`

  Unstyled element.

- `theme/lumo/vaadin-list-box.html`

  Element with Lumo theme.

- `vaadin-list-box.html`

  Alias for theme/lumo/vaadin-list-box.html

## Running demos and tests in browser

1. Fork the `vaadin-list-box` repository and clone it locally.

1. Make sure you have [npm](https://www.npmjs.com/) installed.

1. When in the `vaadin-list-box` directory, run `npm install` and then `bower install` to install dependencies.

1. Run `polymer serve --open`, browser will automatically open the component API documentation.

1. You can also open demo or in-browser tests by adding **demo** or **test** to the URL, for example:

  - http://127.0.0.1:8080/components/vaadin-list-box/demo
  - http://127.0.0.1:8080/components/vaadin-list-box/test


## Running tests from the command line

1. When in the `vaadin-list-box` directory, run `polymer test`


## Following the coding style

We are using [ESLint](http://eslint.org/) for linting JavaScript code. You can check if your code is following our standards by running `gulp lint`, which will automatically lint all `.js` files as well as JavaScript snippets inside `.html` files.


## Contributing

  - Make sure your code is compliant with our code linters: `gulp lint`
  - Check that tests are passing: `polymer test`
  - [Submit a pull request](https://www.digitalocean.com/community/tutorials/how-to-create-a-pull-request-on-github) with detailed title and description
  - Wait for response from one of Vaadin Elements team members


## License

Apache License 2.0

Vaadin collects development time usage statistics to improve this product. For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
