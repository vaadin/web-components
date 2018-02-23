![Bower version](https://img.shields.io/bower/v/vaadin-notification.svg)
[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/vaadin/vaadin-notification)
[![Build Status](https://travis-ci.org/vaadin/vaadin-notification.svg?branch=master)](https://travis-ci.org/vaadin/vaadin-notification)
[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/vaadin/vaadin-core-elements?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

# &lt;vaadin-notification&gt;

[Live Demo ↗](https://vaadin.com/elements/vaadin-notification/html-examples)
|
[API documentation ↗](https://vaadin.com/elements/vaadin-notification/html-api)


[&lt;vaadin-notification&gt;](https://vaadin.com/elements/vaadin-notification) is a [Polymer 2](http://polymer-project.org) element providing accessible and customizable notifications (toasts), part of the [Vaadin Core Elements](https://vaadin.com/elements).

<!--
```
<custom-element-demo height="120">
  <template>
    <script src="../webcomponentsjs/webcomponents-lite.js"></script>
    <link rel="import" href="vaadin-notification.html">
    <next-code-block></next-code-block>
  </template>
</custom-element-demo>
```
-->
```html
<vaadin-notification opened position="middle" duration="-1">
  <template>
    Your work has been saved
  </template>
</vaadin-notification>
```

[<img src="https://raw.githubusercontent.com/vaadin/vaadin-notification/master/screenshot.png" width="336" alt="Screenshot of vaadin-notification">](https://vaadin.com/elements/vaadin-notification)

## Getting Started

Vaadin Elements use the Lumo theme by default.

## The file structure for Vaadin Elements

- `src/vaadin-notification.html`

  Unstyled element.

- `theme/lumo/vaadin-notification.html`

  Element with Lumo theme.

- `vaadin-notification.html`

  Alias for theme/lumo/vaadin-notification.html

## Running demos and tests in browser

1. Fork the `vaadin-notification` repository and clone it locally.

1. Make sure you have [npm](https://www.npmjs.com/) installed.

1. When in the `vaadin-notification` directory, run `npm install` and then `bower install` to install dependencies.

1. Run `polymer serve --open`, browser will automatically open the component API documentation.

1. You can also open demo or in-browser tests by adding **demo** or **test** to the URL, for example:

  - http://127.0.0.1:8080/components/vaadin-notification/demo
  - http://127.0.0.1:8080/components/vaadin-notification/test


## Running tests from the command line

1. When in the `vaadin-notification` directory, run `polymer test`


## Following the coding style

We are using [ESLint](http://eslint.org/) for linting JavaScript code. You can check if your code is following our standards by running `gulp lint`, which will automatically lint all `.js` files as well as JavaScript snippets inside `.html` files.


## Contributing

  - Make sure your code is compliant with our code linters: `gulp lint`
  - Check that tests are passing: `polymer test`
  - [Submit a pull request](https://www.digitalocean.com/community/tutorials/how-to-create-a-pull-request-on-github) with detailed title and description
  - Wait for response from one of Vaadin Elements team members


## License

Apache License 2.0

Vaadin collects development time usage statistics to improve this product. For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
