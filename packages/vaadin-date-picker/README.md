![Bower version](https://img.shields.io/bower/v/vaadin-date-picker.svg)
[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/vaadin/vaadin-date-picker)
[![Build Status](https://travis-ci.org/vaadin/vaadin-date-picker.svg?branch=master)](https://travis-ci.org/vaadin/vaadin-date-picker)
[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/vaadin/vaadin-core-elements?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

# &lt;vaadin-date-picker&gt;

[Live Demo ↗](https://vaadin.com/elements/vaadin-date-picker/html-examples)
|
[API documentation ↗](https://vaadin.com/elements/vaadin-date-picker/html-api)

[&lt;vaadin-date-picker&gt;](https://vaadin.com/elements/vaadin-date-picker) is a [Polymer](http://polymer-project.org) element providing a date selection field which includes a scrollable month calendar view, part of the [Vaadin Core Elements](https://vaadin.com/elements).

<!--
```
<custom-element-demo height="550">
  <template>
    <script src="../webcomponentsjs/webcomponents-lite.js"></script>
    <link rel="import" href="vaadin-date-picker.html">
    <next-code-block></next-code-block>
  </template>
</custom-element-demo>
```
-->
```html
<vaadin-date-picker label="Pick a date">
</vaadin-date-picker>
```

[<img src="https://raw.githubusercontent.com/vaadin/vaadin-date-picker/master/screenshot.png" width="439" alt="Screenshot of vaadin-date-picker">](https://vaadin.com/elements/-/element/vaadin-date-picker)


## Running demos and tests in browser

1. Fork the `vaadin-date-picker` repository and clone it locally.

1. Make sure you have [npm](https://www.npmjs.com/) installed.

1. When in the `vaadin-date-picker` directory, run `npm install` and then `bower install` to install dependencies.

1. Run `polymer serve --open`, browser will automatically open the component API documentation.

1. You can also open demo or in-browser tests by adding **demo** or **test** to the URL, for example:

  - http://127.0.0.1:8080/components/vaadin-date-picker/demo
  - http://127.0.0.1:8080/components/vaadin-date-picker/test


## Running tests from the command line

1. When in the `vaadin-date-picker` directory, run `polymer test`


## Following the coding style

We are using [ESLint](http://eslint.org/) for linting JavaScript code. You can check if your code is following our standards by running `gulp lint`, which will automatically lint all `.js` files as well as JavaScript snippets inside `.html` files.


## Creating a pull request

  - Make sure your code is compliant with our code linters: `gulp lint`
  - Check that tests are passing: `polymer test`
  - [Submit a pull request](https://www.digitalocean.com/community/tutorials/how-to-create-a-pull-request-on-github) with detailed title and description
  - Wait for response from one of Vaadin Elements team members


## License

Apache License 2.0
