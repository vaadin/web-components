[![npm version](https://badge.fury.io/js/%40vaadin%2Fvaadin-button.svg)](https://badge.fury.io/js/%40vaadin%2Fvaadin-button)
[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/vaadin/vaadin-button)
[![Build Status](https://travis-ci.org/vaadin/vaadin-button.svg?branch=master)](https://travis-ci.org/vaadin/vaadin-button)
[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/vaadin/web-components?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

[![Published on Vaadin  Directory](https://img.shields.io/badge/Vaadin%20Directory-published-00b4f0.svg)](https://vaadin.com/directory/component/vaadinvaadin-button)
[![Stars on vaadin.com/directory](https://img.shields.io/vaadin-directory/star/vaadinvaadin-button.svg)](https://vaadin.com/directory/component/vaadinvaadin-button)

# &lt;vaadin-button&gt;

[Live Demo ↗](https://vaadin.com/components/vaadin-button/html-examples)
|
[API documentation ↗](https://vaadin.com/components/vaadin-button/html-api)

[&lt;vaadin-button&gt;](https://vaadin.com/components/vaadin-button) is a [Polymer 2](http://polymer-project.org) element providing an accessible and customizable button, part of the [Vaadin components](https://vaadin.com/components).

<!--
```
<custom-element-demo>
  <template>
    <script src="../webcomponentsjs/webcomponents-lite.js"></script>
    <link rel="import" href="vaadin-button.html">
    <next-code-block></next-code-block>
  </template>
</custom-element-demo>
```
-->
```html
<vaadin-button theme="primary">Primary</vaadin-button>
<vaadin-button theme="secondary">Secondary</vaadin-button>
<vaadin-button theme="tertiary">Tertiary</vaadin-button>
```

[<img src="https://raw.githubusercontent.com/vaadin/vaadin-button/master/screenshot.png" alt="Screenshot of vaadin-button, using the default Lumo theme">](https://vaadin.com/components/vaadin-button)

## Getting Started

Vaadin components use the Lumo theme by default.

## The file structure for Vaadin components

- `src/vaadin-button.html`

  Unstyled component.

- `theme/lumo/vaadin-button.html`

  Component with Lumo theme.

- `vaadin-button.html`

  Alias for theme/lumo/vaadin-button.html

## Running demos and tests in browser

1. Fork the `vaadin-button` repository and clone it locally.

1. Make sure you have [npm](https://www.npmjs.com/) installed.

1. When in the `vaadin-button` directory, run `npm install` and then `bower install` to install dependencies.

1. Run `polymer serve --open`, browser will automatically open the component API documentation.

1. You can also open demo or in-browser tests by adding **demo** or **test** to the URL, for example:

  - http://127.0.0.1:8080/components/vaadin-button/demo
  - http://127.0.0.1:8080/components/vaadin-button/test


## Running tests from the command line

1. When in the `vaadin-button` directory, run `polymer test`


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
