![Bower version](https://img.shields.io/bower/v/vaadin-nav.svg)
[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://beta.webcomponents.org/element/vaadin/vaadin-nav)
[![Build Status](https://travis-ci.org/vaadin/vaadin-nav.svg?branch=master)](https://travis-ci.org/vaadin/vaadin-nav)
[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/vaadin/vaadin-core-elements?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

# &lt;vaadin-nav&gt;

[Live Demo ↗](https://cdn.vaadin.com/vaadin-core-elements/master/vaadin-nav/demo/)
|
[API documentation ↗](https://cdn.vaadin.com/vaadin-core-elements/master/vaadin-nav/)


[&lt;vaadin-nav&gt;](https://vaadin.com/elements/-/element/vaadin-nav) is a [Polymer 2](http://polymer-project.org) element providing item navigation part of the [Vaadin Core Elements](https://vaadin.com/elements). It is designed for menu and tab components.

<!--
```
<custom-element-demo>
  <template>
    <script src="../webcomponentsjs/webcomponents-lite.js"></script>
    <link rel="import" href="vaadin-nav.html">
    <next-code-block>
    </next-code-block>
  </template>
</custom-element-demo>
```
-->
```html
<vaadin-nav direction="horizontal" selected="2">
  <vaadin-item>Foo</vaadin-item>
  <vaadin-item>Bar</vaadin-item>
  <vaadin-item>Baz</vaadin-item>
</vaadin-nav>
```

[<img src="https://raw.githubusercontent.com/vaadin/vaadin-nav/master/screenshot.png" width="200" alt="Screenshot of vaadin-nav">](https://vaadin.com/elements/-/element/vaadin-nav)


## Running demos and tests in browser

1. Fork the `vaadin-nav` repository and clone it locally.

1. Make sure you have [npm](https://www.npmjs.com/) installed.

1. When in the `vaadin-nav` directory, run `npm install` and then `bower install` to install dependencies.

1. Run `polymer serve --open`, browser will automatically open the component API documentation.

1. You can also open demo or in-browser tests by adding **demo** or **test** to the URL, for example:

  - http://127.0.0.1:8080/components/vaadin-nav/demo
  - http://127.0.0.1:8080/components/vaadin-nav/test


## Running tests from the command line

1. When in the `vaadin-nav` directory, run `polymer test`


## Following the coding style

We are using [ESLint](http://eslint.org/) for linting JavaScript code. You can check if your code is following our standards by running `gulp lint`, which will automatically lint all `.js` files as well as JavaScript snippets inside `.html` files.


## Contributing

  - Make sure your code is compliant with our code linters: `gulp lint`
  - Check that tests are passing: `polymer test`
  - [Submit a pull request](https://www.digitalocean.com/community/tutorials/how-to-create-a-pull-request-on-github) with detailed title and description
  - Wait for response from one of Vaadin Elements team members


## License

Apache License 2.0
