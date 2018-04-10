![Bower version](https://img.shields.io/bower/v/vaadin-dropdown-menu.svg)
[![npm version](https://badge.fury.io/js/%40vaadin%2Fvaadin-dropdown-menu.svg)](https://badge.fury.io/js/%40vaadin%2Fvaadin-dropdown-menu)
[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/vaadin/vaadin-dropdown-menu)
[![Build Status](https://travis-ci.org/vaadin/vaadin-dropdown-menu.svg?branch=master)](https://travis-ci.org/vaadin/vaadin-dropdown-menu)
[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/vaadin/web-components?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

# &lt;vaadin-dropdown-menu&gt;

[Live Demo ↗](https://vaadin.com/components/vaadin-dropdown-menu/html-examples)
|
[API documentation ↗](https://vaadin.com/components/vaadin-dropdown-menu/html-api)


[&lt;vaadin-dropdown-menu&gt;](https://vaadin.com/components/vaadin-dropdown-menu) is a [Polymer 2](http://polymer-project.org) element similar to a native browser select element, part of the [Vaadin components](https://vaadin.com/components).

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

## Getting Started

Vaadin components use the Lumo theme by default.

## The file structure for Vaadin components

- `src/vaadin-dropdown-menu.html`

  Unstyled component.

- `theme/lumo/vaadin-dropdown-menu.html`

  Component with Lumo theme.

- `vaadin-dropdown-menu.html`

  Alias for theme/lumo/vaadin-dropdown-menu.html

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

  - Make sure your code is compliant with our code linters: `gulp lint`
  - Check that tests are passing: `polymer test`
  - [Submit a pull request](https://www.digitalocean.com/community/tutorials/how-to-create-a-pull-request-on-github) with detailed title and description
  - Wait for response from one of Vaadin components team members


## License

Apache License 2.0

Vaadin collects development time usage statistics to improve this product. For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
