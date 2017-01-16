![Bower version](https://img.shields.io/bower/v/vaadin-context-menu.svg)
[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/vaadin/vaadin-context-menu)
[![Build Status](https://travis-ci.org/vaadin/vaadin-context-menu.svg?branch=master)](https://travis-ci.org/vaadin/vaadin-context-menu)
[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/vaadin/vaadin-core-elements?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

# &lt;vaadin-context-menu&gt;

[Live Demo ↗](https://cdn.vaadin.com/vaadin-core-elements/master/vaadin-context-menu/demo/)

[&lt;vaadin-context-menu&gt;](https://vaadin.com/elements/-/element/vaadin-context-menu) is a [Polymer](http://polymer-project.org) element providing a contextual menu, part of the [Vaadin Core Elements](https://vaadin.com/elements).

<!--
```
<custom-element-demo height="260">
  <template>
    <style>
     vaadin-context-menu {
       font-family: sans-serif;
     }
    </style>
    <script src="../webcomponentsjs/webcomponents-lite.min.js"></script>
    <link rel="import" href="../paper-menu/paper-menu.html">
    <link rel="import" href="../paper-item/paper-item.html">
    <link rel="import" href="vaadin-context-menu.html">
    <next-code-block></next-code-block>
  </template>
</custom-element-demo>
```
-->
```html
<vaadin-context-menu>
  <template>
    <paper-menu>
      <paper-item>First menu item</paper-item>
      <paper-item>Second menu item</paper-item>
    </paper-menu>
  </template>

  <p>This paragraph has the context menu provided in the above template.</p>
  <p>Another paragraph with the context menu.</p>
</vaadin-context-menu>
```

[<img src="https://raw.githubusercontent.com/vaadin/vaadin-context-menu/master/docs/img/vaadin-context-menu-on-content.png" width="355" alt="Screenshot of vaadin-context-menu">](https://vaadin.com/elements/-/element/vaadin-context-menu)


## Contributing

1. Fork the `vaadin-context-menu` repository and clone it locally.

1. Make sure you have [npm](https://www.npmjs.com/) installed.

1. When in the `vaadin-context-menu` directory, run `npm install` to install dependencies.


## Running demos and tests in browser

1. Install [polyserve](https://www.npmjs.com/package/polyserve): `npm install -g polyserve`

1. When in the `vaadin-context-menu` directory, run `polyserve --open`, browser will automatically open the component API documentation.

1. You can also open demo or in-browser tests by adding **demo** or **test** to the URL, for example:

  - http://127.0.0.1:8080/components/vaadin-context-menu/demo
  - http://127.0.0.1:8080/components/vaadin-context-menu/test


## Running tests from the command line

1. Install [web-component-tester](https://www.npmjs.com/package/web-component-tester): `npm install -g web-component-tester`

1. When in the `vaadin-context-menu` directory, run `wct` or `npm test`


## Following the coding style

We are using [ESLint](http://eslint.org/) for linting JavaScript code. You can check if your code is following our standards by running `gulp lint`, which will automatically lint all `.js` files as well as JavaScript snippets inside `.html` files.


## Creating a pull request

  - Make sure your code is compliant with our code linters: `gulp lint`
  - Check that tests are passing: `npm test`
  - [Submit a pull request](https://www.digitalocean.com/community/tutorials/how-to-create-a-pull-request-on-github) with detailed title and description
  - Wait for response from one of Vaadin Elements team members


## License

Apache License 2.0
