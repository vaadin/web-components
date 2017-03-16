![Bower version](https://img.shields.io/bower/v/vaadin-split-layout.svg)
[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/vaadin/vaadin-split-layout)
![Polymer 2 supported](https://img.shields.io/badge/Polymer2-supported-blue.svg)
[![Build status](https://travis-ci.org/vaadin/vaadin-split-layout.svg?branch=master)](https://travis-ci.org/vaadin/vaadin-split-layout)
[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/vaadin/vaadin-core-elements?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

# &lt;vaadin-split-layout&gt;

[Live Demo ↗](https://cdn.vaadin.com/vaadin-core-elements/master/vaadin-split-layout/demo/)

[&lt;vaadin-split-layout&gt;](https://vaadin.com/elements/-/element/vaadin-split-layout) is a  [Polymer](http://polymer-project.org) element implementing a split layout for two content elements with a draggable splitter between them, part of the [vaadin-core-elements](https://vaadin.com/elements) element bundle.

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
       background: #e0e0e0;
       display:flex;
       justify-content:center;
       align-items:center;
     }
    </style>
    <script src="../webcomponentsjs/webcomponents-lite.min.js"></script>
    <link rel="import" href="vaadin-split-layout.html">
    <next-code-block></next-code-block>
  </template>
</custom-element-demo>
```
-->
```html
<vaadin-split-layout>
  <vaadin-split-layout vertical>
    <div>First layout content</div>
    <div>Second layout content</div>
  </vaadin-split-layout>
  <vaadin-split-layout vertical>
    <div>Third layout content</div>
    <div>Fourth layout content</div>
  </vaadin-split-layout>
</vaadin-split-layout>
```

[<img src="https://raw.githubusercontent.com/vaadin/vaadin-split-layout/master/screenshot.png" alt="Screenshot of vaadin-split-layout">](https://vaadin.com/elements/-/element/vaadin-split-layout)


## Contributing

1. Fork the `vaadin-split-layout` repository and clone it locally.

1. Make sure you have [npm](https://www.npmjs.com/) installed.

1. When in the `vaadin-split-layout` directory, run `npm install` to install dependencies.


## Running demos and tests in browser

1. Install [polymer-cli](https://www.npmjs.com/package/polymer-cli): `npm install -g polymer-cli`

1. When in the `vaadin-split-layout` directory, run `polymer serve`, after that you will be able to access:

  - Polymer1-compatible version:

    - API documentation: http://127.0.0.1:8000/components/vaadin-split-layout/
    - Examples: http://127.0.0.1:8000/components/vaadin-split-layout/demo/
    - Tests: http://127.0.0.1:8000/components/vaadin-split-layout/test/

  - Polymer2-compatible version:

    - API documentation: http://127.0.0.1:8001/components/vaadin-split-layout/
    - Examples: http://127.0.0.1:8001/components/vaadin-split-layout/demo/
    - Tests: http://127.0.0.1:8001/components/vaadin-split-layout/test/


## Running tests from the command line

1. When in the `vaadin-split-layout` directory, run `polymer test`


## Following the coding style

We are using [ESLint](http://eslint.org/) for linting JavaScript code. You can check if your code is following our standards by running `gulp lint`, which will automatically lint all `.js` files as well as JavaScript snippets inside `.html` files.


## Creating a pull request

  - Make sure your code is compliant with our code linters: `gulp lint`
  - Check that tests are passing: `npm test`
  - [Submit a pull request](https://www.digitalocean.com/community/tutorials/how-to-create-a-pull-request-on-github) with detailed title and description
  - Wait for response from one of Vaadin Elements team members


## License

Apache License 2.0
