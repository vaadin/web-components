[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/vaadin/vaadin-time-picker)
[![Build Status](https://travis-ci.org/vaadin/vaadin-time-picker.svg?branch=master)](https://travis-ci.org/vaadin/vaadin-time-picker)
[![Coverage Status](https://coveralls.io/repos/github/vaadin/vaadin-time-picker/badge.svg?branch=master)](https://coveralls.io/github/vaadin/vaadin-time-picker?branch=master)
[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/vaadin/web-components?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)
[![Published on Vaadin  Directory](https://img.shields.io/badge/Vaadin%20Directory-published-00b4f0.svg)](https://vaadin.com/directory/component/vaadinvaadin-time-picker)

# &lt;vaadin-time-picker&gt;

[Live Demo ↗](https://cdn.vaadin.com/vaadin-time-picker/1.0.0/demo/)
|
[API documentation ↗](https://cdn.vaadin.com/vaadin-time-picker/1.0.0)


[&lt;vaadin-time-picker&gt;](https://vaadin.com/components/vaadin-time-picker) is a [Web Component](http://webcomponents.org) providing a time-selection field, part of the [Vaadin components](https://vaadin.com/components).

<!--
```
<custom-element-demo>
  <template>
    <script src="../webcomponentsjs/webcomponents-lite.js"></script>
    <link rel="import" href="vaadin-time-picker.html">
    <next-code-block></next-code-block>
  </template>
</custom-element-demo>
```
-->
```html
<vaadin-time-picker label="Delivery Time"></vaadin-time-picker>
```

[<img src="https://raw.githubusercontent.com/vaadin/vaadin-time-picker/master/screenshot.gif" alt="Screenshot of vaadin-time-picker">](https://vaadin.com/components/vaadin-time-picker)


## Getting Started

Vaadin components use the Lumo theme by default.

## The file structure for Vaadin components

- `src/vaadin-time-picker.html`

  Unstyled component.

- `theme/lumo/vaadin-time-picker.html`

  Component with Lumo theme.

- `vaadin-time-picker.html`

  Alias for theme/lumo/vaadin-time-picker.html


## Running demos and tests in browser

1. Fork the `vaadin-time-picker` repository and clone it locally.

1. Make sure you have [npm](https://www.npmjs.com/) installed.

1. When in the `vaadin-time-picker` directory, run `npm install` and then `bower install` to install dependencies.

1. Run `polymer serve --open`, browser will automatically open the component API documentation.

1. You can also open demo or in-browser tests by adding **demo** or **test** to the URL, for example:

  - http://127.0.0.1:8080/components/vaadin-time-picker/demo
  - http://127.0.0.1:8080/components/vaadin-time-picker/test


## Running tests from the command line

1. When in the `vaadin-time-picker` directory, run `polymer test`


## Following the coding style

We are using [ESLint](http://eslint.org/) for linting JavaScript code. You can check if your code is following our standards by running `gulp lint`, which will automatically lint all `.js` files as well as JavaScript snippets inside `.html` files.


## Contributing

  To contribute to the component, please read [the guideline](https://github.com/vaadin/vaadin-core/blob/master/CONTRIBUTING.md) first.


## License

Apache License 2.0

Vaadin collects development time usage statistics to improve this product. For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
