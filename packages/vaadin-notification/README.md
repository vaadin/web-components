[![npm version](https://badge.fury.io/js/%40vaadin%2Fvaadin-notification.svg)](https://badge.fury.io/js/%40vaadin%2Fvaadin-notification)
[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/vaadin/vaadin-notification)
[![Build Status](https://travis-ci.org/vaadin/vaadin-notification.svg?branch=master)](https://travis-ci.org/vaadin/vaadin-notification)
[![Coverage Status](https://coveralls.io/repos/github/vaadin/vaadin-notification/badge.svg?branch=master)](https://coveralls.io/github/vaadin/vaadin-notification?branch=master)
[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/vaadin/web-components?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

[![Published on Vaadin  Directory](https://img.shields.io/badge/Vaadin%20Directory-published-00b4f0.svg)](https://vaadin.com/directory/component/vaadinvaadin-notification)
[![Stars on vaadin.com/directory](https://img.shields.io/vaadin-directory/star/vaadinvaadin-notification.svg)](https://vaadin.com/directory/component/vaadinvaadin-notification)

# &lt;vaadin-notification&gt;

[Live Demo ↗](https://vaadin.com/components/vaadin-notification/html-examples)
|
[API documentation ↗](https://vaadin.com/components/vaadin-notification/html-api)


[&lt;vaadin-notification&gt;](https://vaadin.com/components/vaadin-notification) is a Web Component providing accessible and customizable notifications (toasts), part of the [Vaadin components](https://vaadin.com/components).

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

[<img src="https://raw.githubusercontent.com/vaadin/vaadin-notification/master/screenshot.png" width="336" alt="Screenshot of vaadin-notification">](https://vaadin.com/components/vaadin-notification)

## Installation

The Vaadin components are distributed as Bower and npm packages.
Please note that the version range is the same, as the API has not changed.
You should not mix Bower and npm versions in the same application, though.

Unlike the official Polymer Elements, the converted Polymer 3 compatible Vaadin components
are only published on npm, not pushed to GitHub repositories.

### Polymer 2 and HTML Imports Compatible Version

Install `vaadin-notification`:

```sh
bower i vaadin/vaadin-notification --save
```

Once installed, import it in your application:

```html
<link rel="import" href="bower_components/vaadin-notification/vaadin-notification.html">
```
### Polymer 3 and ES Modules Compatible Version

Install `vaadin-notification`:

```sh
npm i @vaadin/vaadin-notification --save
```

Once installed, import it in your application:

```js
import '@vaadin/vaadin-notification/vaadin-notification.js';
```

## Getting Started

Vaadin components use the Lumo theme by default.

## The file structure for Vaadin components

- `src/vaadin-notification.html`

  Unstyled component.

- `theme/lumo/vaadin-notification.html`

  Component with Lumo theme.

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
  - Wait for response from one of Vaadin components team members


## License

Apache License 2.0

Vaadin collects development time usage statistics to improve this product. For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
