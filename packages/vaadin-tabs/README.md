![Bower version](https://img.shields.io/bower/v/vaadin-tabs.svg)
[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://webcomponents.org/element/vaadin/vaadin-tabs)
[![Build Status](https://travis-ci.org/vaadin/vaadin-tabs.svg?branch=master)](https://travis-ci.org/vaadin/vaadin-tabs)
[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/vaadin/vaadin-core-elements?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

# &lt;vaadin-tabs&gt;

[Live Demo ↗](https://cdn.vaadin.com/vaadin-tabs/1.0.0/demo/)
|
[API documentation ↗](https://cdn.vaadin.com/vaadin-tabs/1.0.0/#/elements/vaadin-tab)


[&lt;vaadin-tabs&gt;](https://vaadin.com/elements/-/element/vaadin-tabs) is a [Polymer 2](http://polymer-project.org) element providing item navigation part of the [Vaadin Core Elements](https://vaadin.com/elements). It is designed for menu and tab components.

<!--
```
<custom-element-demo>
  <template>
    <script src="../webcomponentsjs/webcomponents-lite.js"></script>
    <link rel="import" href="vaadin-tabs.html">
    <next-code-block>
    </next-code-block>
  </template>
</custom-element-demo>
```
-->
```html
  <vaadin-tabs selected="4">
    <vaadin-tab>Page 1</vaadin-tab>
    <vaadin-tab>Page 2</vaadin-tab>
    <vaadin-tab>Page 3</vaadin-tab>
    <vaadin-tab>Page 4</vaadin-tab>
  </vaadin-tabs>
```

[<img src="https://raw.githubusercontent.com/vaadin/vaadin-tabs/master/screenshot.png" alt="Screenshot of vaadin-tabs">](https://vaadin.com/elements/-/element/vaadin-tabs)


## Running demos and tests in browser

1. Fork the `vaadin-tabs` repository and clone it locally.

1. Make sure you have [npm](https://www.npmjs.com/) installed.

1. When in the `vaadin-tabs` directory, run `npm install` and then `bower install` to install dependencies.

1. Run `polymer serve --open`, browser will automatically open the component API documentation.

1. You can also open demo or in-browser tests by adding **demo** or **test** to the URL, for example:

  - http://127.0.0.1:8080/components/vaadin-tabs/demo
  - http://127.0.0.1:8080/components/vaadin-tabs/test


## Running tests from the command line

1. When in the `vaadin-tabs` directory, run `polymer test`


## Following the coding style

We are using [ESLint](http://eslint.org/) for linting JavaScript code. You can check if your code is following our standards by running `gulp lint`, which will automatically lint all `.js` files as well as JavaScript snippets inside `.html` files.


## Contributing

  - Make sure your code is compliant with our code linters: `gulp lint`
  - Check that tests are passing: `polymer test`
  - [Submit a pull request](https://www.digitalocean.com/community/tutorials/how-to-create-a-pull-request-on-github) with detailed title and description
  - Wait for response from one of Vaadin Elements team members


## License

Apache License 2.0
