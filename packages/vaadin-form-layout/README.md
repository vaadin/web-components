![Bower version](https://img.shields.io/bower/v/vaadin-form-layout.svg)
[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/vaadin/vaadin-form-layout)
[![Build Status](https://travis-ci.org/vaadin/vaadin-form-layout.svg?branch=master)](https://travis-ci.org/vaadin/vaadin-form-layout)
[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/vaadin/vaadin-core-elements?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

# &lt;vaadin-form-layout&gt;

[Live Demo ↗](https://vaadin.com/elements/vaadin-form-layout/html-examples)
|
[API documentation ↗](https://vaadin.com/elements/vaadin-form-layout/html-api)

[&lt;vaadin-form-layout&gt;](https://vaadin.com/elements/vaadin-form-layout) is a [Polymer 2](http://polymer-project.org) element providing configurable responsive layout for form elements, part of the [Vaadin Core Elements](https://vaadin.com/elements).

<!--
```
<custom-element-demo height="150">
  <template>
    <script src="../webcomponentsjs/webcomponents-lite.js"></script>
    <link rel="import" href="vaadin-form-layout.html">
    <link rel="import" href="../vaadin-text-field/vaadin-text-field.html">
    <next-code-block></next-code-block>
  </template>
</custom-element-demo>
```
-->
```html
<vaadin-form-layout>
  <vaadin-text-field label="First Name" value="Jane"></vaadin-text-field>
  <vaadin-text-field label="Last Name" value="Doe"></vaadin-text-field>
  <vaadin-text-field label="Email" value="jane.doe@example.com"></vaadin-text-field>
</vaadin-form-layout>
```

[<img src="https://raw.githubusercontent.com/vaadin/vaadin-form-layout/master/screenshot.png" width="930" alt="Screenshot of vaadin-form-layout">](https://vaadin.com/elements/-/element/vaadin-form-layout)


## Running demos and tests in browser

1. Fork the `vaadin-form-layout` repository and clone it locally.

1. Make sure you have [npm](https://www.npmjs.com/) installed.

1. When in the `vaadin-form-layout` directory, run `npm install` and then `bower install` to install dependencies.

1. Run `polymer serve --open`, browser will automatically open the component API documentation.

1. You can also open demo or in-browser tests by adding **demo** or **test** to the URL, for example:

  - http://127.0.0.1:8080/components/vaadin-form-layout/demo
  - http://127.0.0.1:8080/components/vaadin-form-layout/test


## Running tests from the command line

1. When in the `vaadin-form-layout` directory, run `polymer test`


## Following the coding style

We are using [ESLint](http://eslint.org/) for linting JavaScript code. You can check if your code is following our standards by running `gulp lint`, which will automatically lint all `.js` files as well as JavaScript snippets inside `.html` files.


## Contributing

  - Make sure your code is compliant with our code linters: `gulp lint`
  - Check that tests are passing: `npm test`
  - [Submit a pull request](https://www.digitalocean.com/community/tutorials/how-to-create-a-pull-request-on-github) with detailed title and description
  - Wait for response from one of Vaadin Elements team members


## License

Apache License 2.0
