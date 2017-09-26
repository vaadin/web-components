![Bower version](https://img.shields.io/bower/v/vaadin-checkbox.svg)
[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/vaadin/vaadin-checkbox)
[![Build Status](https://travis-ci.org/vaadin/vaadin-checkbox.svg?branch=master)](https://travis-ci.org/vaadin/vaadin-checkbox)
[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/vaadin/vaadin-core-elements?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

# &lt;vaadin-checkbox&gt;

[Live Demo ↗](https://vaadin.com/elements/vaadin-checkbox/html-examples)
|
[API documentation ↗](https://vaadin.com/elements/vaadin-checkbox/html-api)

[&lt;vaadin-checkbox&gt;](https://vaadin.com/elements/vaadin-checkbox) is a [Polymer 2](http://polymer-project.org) element providing an accessible and customizable checkbox, part of the [Vaadin Core Elements](https://vaadin.com/elements).

<!--
```
<custom-element-demo>
  <template>
    <script src="../webcomponentsjs/webcomponents-lite.js"></script>
    <link rel="import" href="vaadin-checkbox.html">
    <next-code-block></next-code-block>
  </template>
</custom-element-demo>
```
-->
```html
<vaadin-checkbox checked>
  Make my profile visible
</vaadin-checkbox>
```

<!-- TODO: uncomment when we have a nice screenshot to show
[<img src="https://raw.githubusercontent.com/vaadin/vaadin-checkbox/master/screenshot.png" width="200" alt="Screenshot of vaadin-checkbox">](https://vaadin.com/elements/-/element/vaadin-checkbox)
-->

## Running demos and tests in browser

1. Fork the `vaadin-checkbox` repository and clone it locally.

1. Make sure you have [npm](https://www.npmjs.com/) installed.

1. When in the `vaadin-checkbox` directory, run `npm install` and then `bower install` to install dependencies.

1. Run `polymer serve --open`, browser will automatically open the component API documentation.

1. You can also open demo or in-browser tests by adding **demo** or **test** to the URL, for example:

  - http://127.0.0.1:8080/components/vaadin-checkbox/demo
  - http://127.0.0.1:8080/components/vaadin-checkbox/test


## Running tests from the command line

1. When in the `vaadin-checkbox` directory, run `polymer test`


## Following the coding style

We are using [ESLint](http://eslint.org/) for linting JavaScript code. You can check if your code is following our standards by running `gulp lint`, which will automatically lint all `.js` files as well as JavaScript snippets inside `.html` files.


## Creating a pull request

  - Make sure your code is compliant with our code linters: `gulp lint`
  - Check that tests are passing: `polymer test`
  - [Submit a pull request](https://www.digitalocean.com/community/tutorials/how-to-create-a-pull-request-on-github) with detailed title and description
  - Wait for response from one of Vaadin Elements team members


## License

Apache License 2.0
