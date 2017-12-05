![Bower version](https://img.shields.io/bower/v/vaadin-item.svg)
[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/vaadin/vaadin-item)
[![Build Status](https://travis-ci.org/vaadin/vaadin-item.svg?branch=master)](https://travis-ci.org/vaadin/vaadin-item)
[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/vaadin/vaadin-core-elements?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

# &lt;vaadin-item&gt;

[Live Demo ↗](https://cdn.vaadin.com/vaadin-core-elements/master/vaadin-item/demo/)
|
[API documentation ↗](https://cdn.vaadin.com/vaadin-core-elements/master/vaadin-item/)


[&lt;vaadin-item&gt;](https://vaadin.com/elements/-/element/vaadin-item) is a [Polymer 2](http://polymer-project.org) element providing a container for item elements, part of the [Vaadin Core Elements](https://vaadin.com/elements).

<!--
```
<custom-element-demo>
  <template>
    <script src="../webcomponentsjs/webcomponents-lite.js"></script>
    <link rel="import" href="vaadin-item.html">
    <next-code-block></next-code-block>
  </template>
</custom-element-demo>
```
-->
```html
<vaadin-item>Simple Item</vaadin-item>
<vaadin-item disabled>Disabled Item</vaadin-item>
```

[<img src="https://raw.githubusercontent.com/vaadin/vaadin-item/master/screenshot.png" width="169" alt="Screenshot of vaadin-item">](https://vaadin.com/elements/vaadin-item)


## Running demos and tests in browser

1. Fork the `vaadin-item` repository and clone it locally.

1. Make sure you have [npm](https://www.npmjs.com/) installed.

1. When in the `vaadin-item` directory, run `npm install` and then `bower install` to install dependencies.

1. Run `polymer serve --open`, browser will automatically open the component API documentation.

1. You can also open demo or in-browser tests by adding **demo** or **test** to the URL, for example:

  - http://127.0.0.1:8080/components/vaadin-item/demo
  - http://127.0.0.1:8080/components/vaadin-item/test


## Running tests from the command line

1. When in the `vaadin-item` directory, run `polymer test`


## Following the coding style

We are using [ESLint](http://eslint.org/) for linting JavaScript code. You can check if your code is following our standards by running `gulp lint`, which will automatically lint all `.js` files as well as JavaScript snippets inside `.html` files.


## Contributing

  - Make sure your code is compliant with our code linters: `gulp lint`
  - Check that tests are passing: `polymer test`
  - [Submit a pull request](https://www.digitalocean.com/community/tutorials/how-to-create-a-pull-request-on-github) with detailed title and description
  - Wait for response from one of Vaadin Elements team members


## License

Apache License 2.0
