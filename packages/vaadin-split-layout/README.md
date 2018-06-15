[![npm version](https://badge.fury.io/js/%40vaadin%2Fvaadin-split-layout.svg)](https://badge.fury.io/js/%40vaadin%2Fvaadin-split-layout)
[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/vaadin/vaadin-split-layout)
[![Build status](https://travis-ci.org/vaadin/vaadin-split-layout.svg?branch=master)](https://travis-ci.org/vaadin/vaadin-split-layout)
[![Coverage Status](https://coveralls.io/repos/github/vaadin/vaadin-split-layout/badge.svg?branch=master)](https://coveralls.io/github/vaadin/vaadin-split-layout?branch=master)
[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/vaadin/web-components?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

[![Published on Vaadin  Directory](https://img.shields.io/badge/Vaadin%20Directory-published-00b4f0.svg)](https://vaadin.com/directory/component/vaadinvaadin-split-layout)
[![Stars on vaadin.com/directory](https://img.shields.io/vaadin-directory/star/vaadinvaadin-split-layout.svg)](https://vaadin.com/directory/component/vaadinvaadin-split-layout)

# &lt;vaadin-split-layout&gt;

[Live Demo ↗](https://vaadin.com/components/vaadin-split-layout/html-examples)
|
[API documentation ↗](https://vaadin.com/components/vaadin-split-layout/html-api)

[&lt;vaadin-split-layout&gt;](https://vaadin.com/components/vaadin-split-layout) is a Web Component implementing a split layout for two content elements with a draggable splitter between them, part of the [Vaadin components](https://vaadin.com/components).

<!---
```
<custom-element-demo height="218">
  <template>
    <style>
      vaadin-split-layout {
        height: 200px;
      }
      vaadin-split-layout > div {
        font-family: sans-serif;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    </style>
    <script src="../webcomponentsjs/webcomponents-lite.js"></script>
    <link rel="import" href="vaadin-split-layout.html">
    <next-code-block></next-code-block>
  </template>
</custom-element-demo>
```
-->
```html
<vaadin-split-layout>
  <vaadin-split-layout orientation="vertical">
    <div>First layout content</div>
    <div>Second layout content</div>
  </vaadin-split-layout>
  <vaadin-split-layout orientation="vertical">
    <div>Third layout content</div>
    <div>Fourth layout content</div>
  </vaadin-split-layout>
</vaadin-split-layout>
```

[<img src="https://raw.githubusercontent.com/vaadin/vaadin-split-layout/master/screenshot.png" width="616" alt="Screenshot of vaadin-split-layout">](https://vaadin.com/components/vaadin-split-layout)

## Installation

The Vaadin components are distributed as Bower and npm packages.
Please note that the version range is the same, as the API has not changed.
You should not mix Bower and npm versions in the same application, though.

Unlike the official Polymer Elements, the converted Polymer 3 compatible Vaadin components
are only published on npm, not pushed to GitHub repositories.

### Polymer 2 and HTML Imports Compatible Version

Install `vaadin-split-layout`:

```sh
bower i vaadin/vaadin-split-layout --save
```

Once installed, import it in your application:

```html
<link rel="import" href="bower_components/vaadin-split-layout/vaadin-split-layout.html">
```
### Polymer 3 and ES Modules Compatible Version

Install `vaadin-split-layout`:

```sh
npm i @vaadin/vaadin-split-layout --save
```

Once installed, import it in your application:

```js
import '@vaadin/vaadin-split-layout/vaadin-split-layout.js';
```

## Getting Started

Vaadin components use the Lumo theme by default.

## The file structure for Vaadin components

- `src/vaadin-split-layout.html`

  Unstyled component.

- `theme/lumo/vaadin-split-layout.html`

  Component with Lumo theme.

- `vaadin-split-layout.html`

  Alias for theme/lumo/vaadin-split-layout.html

## Running demos and tests in browser

1. Fork the `vaadin-split-layout` repository and clone it locally.

1. Make sure you have [npm](https://www.npmjs.com/) installed.

1. When in the `vaadin-split-layout` directory, run `npm install` and then `polymer install --variants` to install dependencies.

1. Run `polymer serve`, after that you will be able to access:

  - Polymer1-compatible version:

    - API documentation: http://127.0.0.1:8000/components/vaadin-split-layout/
    - Examples: http://127.0.0.1:8000/components/vaadin-split-layout/demo/
    - Tests: http://127.0.0.1:8000/components/vaadin-split-layout/test/

  - Polymer2-compatible version:

    - API documentation: http://127.0.0.1:8001/components/vaadin-split-layout/
    - Examples: http://127.0.0.1:8001/components/vaadin-split-layout/demo/
    - Tests: http://127.0.0.1:8001/components/vaadin-split-layout/test/

Note that ports `8000` and `8001` could be different in your environment.


## Running tests from the command line

1. When in the `vaadin-split-layout` directory, run `polymer test`


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
