[![npm version](https://badge.fury.io/js/%40vaadin%2Fvaadin-text-field.svg)](https://badge.fury.io/js/%40vaadin%2Fvaadin-text-field)
[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/vaadin/vaadin-text-field)
[![Build Status](https://travis-ci.org/vaadin/vaadin-text-field.svg?branch=master)](https://travis-ci.org/vaadin/vaadin-text-field)
[![Coverage Status](https://coveralls.io/repos/github/vaadin/vaadin-text-field/badge.svg?branch=master)](https://coveralls.io/github/vaadin/vaadin-text-field?branch=master)
[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/vaadin/web-components?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

[![Published on Vaadin  Directory](https://img.shields.io/badge/Vaadin%20Directory-published-00b4f0.svg)](https://vaadin.com/directory/component/vaadinvaadin-text-field)
[![Stars on vaadin.com/directory](https://img.shields.io/vaadin-directory/star/vaadinvaadin-text-field.svg)](https://vaadin.com/directory/component/vaadinvaadin-text-field)

# &lt;vaadin-text-field&gt;

[Live Demo ↗](https://vaadin.com/components/vaadin-text-field/html-examples)
|
[API documentation ↗](https://vaadin.com/components/vaadin-text-field/html-api)

[&lt;vaadin-text-field&gt;](https://vaadin.com/components/vaadin-text-field) is a themable Web Component providing input controls in forms, part of the [Vaadin components](https://vaadin.com/components).

<!--
```
<custom-element-demo>
  <template>
    <script src="../webcomponentsjs/webcomponents-lite.js"></script>
    <link rel="import" href="vaadin-text-field.html">
    <link rel="import" href="vaadin-password-field.html">
    <link rel="import" href="vaadin-text-area.html">
    <next-code-block></next-code-block>
  </template>
</custom-element-demo>
```
-->
```html
<vaadin-text-field label="Username"></vaadin-text-field>
<vaadin-password-field label="Password"></vaadin-password-field>
<vaadin-text-area label="Description"></vaadin-text-area>
```

[<img src="https://raw.githubusercontent.com/vaadin/vaadin-text-field/master/screenshot.png" width="710" alt="Screenshot of vaadin-text-field">](https://vaadin.com/components/vaadin-text-field)

## Installation

The Vaadin components are distributed as Bower and npm packages.
Please note that the version range is the same, as the API has not changed.
You should not mix Bower and npm versions in the same application, though.

Unlike the official Polymer Elements, the converted Polymer 3 compatible Vaadin components
are only published on npm, not pushed to GitHub repositories.

### Polymer 2 and HTML Imports Compatible Version

Install `vaadin-text-field`:

```sh
bower i vaadin/vaadin-text-field --save
```

Once installed, import it in your application:

```html
<link rel="import" href="bower_components/vaadin-text-field/vaadin-text-field.html">
```
### Polymer 3 and ES Modules Compatible Version

Install `vaadin-text-field`:

```sh
npm i @vaadin/vaadin-text-field --save
```

Once installed, import it in your application:

```js
import '@vaadin/vaadin-text-field/vaadin-text-field.js';
```

## Getting Started

Vaadin components use the Lumo theme by default.

## The file structure for Vaadin components

- `src/vaadin-text-field.html`
- `src/vaadin-text-area.html`
- `src/vaadin-password-field.html`

  Unstyled components.

- `theme/lumo/vaadin-text-field.html`
- `theme/lumo/vaadin-text-area.html`
- `theme/lumo/vaadin-password-field.html`

  Components with Lumo theme.

- `vaadin-text-field.html`
- `vaadin-text-area.html`
- `vaadin-password-field.html`

  Aliases for theme/lumo/vaadin-text-field.html
  theme/lumo/vaadin-text-area.html
  theme/lumo/vaadin-password-field.html

## Running demos and tests in browser

1. Fork the `vaadin-text-field` repository and clone it locally.

1. Make sure you have [npm](https://www.npmjs.com/) installed.

1. When in the `vaadin-text-field` directory, run `npm install` and then `bower install` to install dependencies.

1. Run `polymer serve --open`, browser will automatically open the component API documentation.

1. You can also open demo or in-browser tests by adding **demo** or **test** to the URL, for example:

  - http://127.0.0.1:8080/components/vaadin-text-field/demo
  - http://127.0.0.1:8080/components/vaadin-text-field/test


## Running tests from the command line

1. When in the `vaadin-text-field` directory, run `polymer test`


## Following the coding style

We are using [ESLint](http://eslint.org/) for linting JavaScript code. You can check if your code is following our standards by running `gulp lint`, which will automatically lint all `.js` files as well as JavaScript snippets inside `.html` files.


## Creating a pull request

  - Make sure your code is compliant with our code linters: `gulp lint`
  - Check that tests are passing: `polymer test`
  - [Submit a pull request](https://www.digitalocean.com/community/tutorials/how-to-create-a-pull-request-on-github) with detailed title and description
  - Wait for response from one of Vaadin components team members


## License

Apache License 2.0

Vaadin collects development time usage statistics to improve this product. For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
