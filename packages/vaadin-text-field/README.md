![Bower version](https://img.shields.io/bower/v/vaadin-text-field.svg)
[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://beta.webcomponents.org/element/vaadin/vaadin-text-field)
[![Build Status](https://travis-ci.org/vaadin/vaadin-text-field.svg?branch=master)](https://travis-ci.org/vaadin/vaadin-text-field)
[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/vaadin/vaadin-core-elements?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

# &lt;vaadin-text-field&gt;

[Live Demo ↗](https://cdn.vaadin.com/vaadin-text-field/1.0.0-alpha5/demo/)

[&lt;vaadin-text-field&gt;](https://vaadin.com/elements/-/element/vaadin-text-field) is a [Polymer](http://polymer-project.org) element providing an input control in forms., part of the [Vaadin Core Elements](https://vaadin.com/elements).

<!--
```
<custom-element-demo>
  <template>
    <link rel="import" href="vaadin-text-field.html">
    <next-code-block></next-code-block>
  </template>
</custom-element-demo>
```
-->
```html
<vaadin-text-field>
  ...
</vaadin-text-field>
```

[<img src="https://raw.githubusercontent.com/vaadin/vaadin-text-field/master/screenshot.png" width="200" alt="Screenshot of vaadin-text-field">](https://vaadin.com/elements/-/element/vaadin-text-field)


## Contributing

1. Fork the `vaadin-text-field` repository and clone it locally.

1. Make sure you have [npm](https://www.npmjs.com/) installed.

1. When in the `vaadin-text-field` directory, run `npm install` to install dependencies.


## Running demos and tests in browser

1. Install [polyserve](https://www.npmjs.com/package/polyserve): `npm install -g polyserve`

1. When in the `vaadin-text-field` directory, run `polyserve --open`, browser will automatically open the component API documentation.

1. You can also open demo or in-browser tests by adding **demo** or **test** to the URL, for example:

  - http://127.0.0.1:8080/components/vaadin-text-field/demo
  - http://127.0.0.1:8080/components/vaadin-text-field/test


## Running tests from the command line

1. Install [web-component-tester](https://www.npmjs.com/package/web-component-tester): `npm install -g web-component-tester`

1. When in the `vaadin-text-field` directory, run `wct` or `npm test`


## Following the coding style

We are using [ESLint](http://eslint.org/) for linting JavaScript code. You can check if your code is following our standards by running `gulp lint`, which will automatically lint all `.js` files as well as JavaScript snippets inside `.html` files.


## Creating a pull request

  - Make sure your code is compliant with our code linters: `gulp lint`
  - Check that tests are passing: `npm test`
  - [Submit a pull request](https://www.digitalocean.com/community/tutorials/how-to-create-a-pull-request-on-github) with detailed title and description
  - Wait for response from one of Vaadin Elements team members


## License

Apache License 2.0
