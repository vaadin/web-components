![Bower version](https://img.shields.io/bower/v/vaadin-combo-box.svg)
[![npm version](https://badge.fury.io/js/%40vaadin%2Fvaadin-combo-box.svg)](https://badge.fury.io/js/%40vaadin%2Fvaadin-combo-box)
[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/vaadin/vaadin-combo-box)
![Polymer 2 supported](https://img.shields.io/badge/Polymer2-supported-blue.svg)
[![Build Status](https://travis-ci.org/vaadin/vaadin-combo-box.svg?branch=master)](https://travis-ci.org/vaadin/vaadin-combo-box)
[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/vaadin/web-components?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

# &lt;vaadin-combo-box&gt;

[Live Demo ↗](https://vaadin.com/components/vaadin-combo-box/html-examples)
|
[API documentation ↗](https://vaadin.com/components/vaadin-combo-box/html-api)

[&lt;vaadin-combo-box&gt;](https://vaadin.com/components/vaadin-combo-box) is a [Polymer](http://polymer-project.org) element combining a dropdown list with an input field for filtering the list of items, part of the [Vaadin components](https://vaadin.com/components).

<!--
```
<custom-element-demo height="300">
  <template>
    <script src="../webcomponentsjs/webcomponents-lite.js"></script>
    <link rel="import" href="../iron-ajax/iron-ajax.html">
    <link rel="import" href="vaadin-combo-box.html">
    <custom-style>
      <style>
        vaadin-combo-box {
          width: 300px;
        }
      </style>
    </custom-style>
    <next-code-block></next-code-block>
  </template>
</custom-element-demo>
```
-->
```html
<dom-bind>
  <template>
    <iron-ajax url="https://randomuser.me/api?results=100&inc=name,email" last-response="{{response}}" auto></iron-ajax>
    <vaadin-combo-box label="User" placeholder="Please select" items="[[response.results]]" item-value-path="email" item-label-path="email"></vaadin-combo-box>
  </template>
</dom-bind>
```

[<img src="https://raw.githubusercontent.com/vaadin/vaadin-combo-box/master/screenshot.png" width="208" alt="Screenshot of vaadin-combo-box" />](https://vaadin.com/components/vaadin-combo-box)

## Getting Started

Vaadin components use the Lumo theme by default.

## The file structure for Vaadin components

- `src/vaadin-combo-box.html`
- `src/vaadin-combo-box-light.html`

  Unstyled components.

- `theme/lumo/vaadin-combo-box.html`
- `theme/lumo/vaadin-combo-box-light.html`

  Components with Lumo theme.

- `vaadin-combo-box.html`
- `vaadin-combo-box-light.html`

  Alias for theme/lumo/vaadin-combo-box.html
  theme/lumo/vaadin-combo-box-light.html

## Running demos and tests in browser

1. Fork the `vaadin-combo-box` repository and clone it locally.

1. Make sure you have [npm](https://www.npmjs.com/) installed.

1. When in the `vaadin-combo-box` directory, run `npm install` and then `bower install` to install dependencies.

1. Run `polymer serve --open`, browser will automatically open the component API documentation.

1. You can also open demo or in-browser tests by adding **demo** or **test** to the URL, for example:

  - http://127.0.0.1:8080/components/vaadin-combo-box/demo
  - http://127.0.0.1:8080/components/vaadin-combo-box/test


## Running tests from the command line

1. When in the `vaadin-combo-box` directory, run `polymer test`


## Following the coding style

We are using [ESLint](http://eslint.org/) for linting JavaScript code. You can check if your code is following our standards by running `gulp lint`, which will automatically lint all `.js` files as well as JavaScript snippets inside `.html` files.


## Creating a pull request

  - Make sure your code is compliant with our code linters: `gulp lint`
  - Check that tests are passing: `polymer test`
  - [Submit a pull request](https://www.digitalocean.com/community/tutorials/how-to-create-a-pull-request-on-github) with detailed title and description
  - Wait for response from one of Vaadin components team members


## License

Apache License 2.0

Vaadin collects development time usage statistics to improve this product. For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
