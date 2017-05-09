![Bower version](https://img.shields.io/bower/v/vaadin-combo-box.svg)
[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/vaadin/vaadin-combo-box)
![Polymer 2 supported](https://img.shields.io/badge/Polymer2-supported-blue.svg)
[![Build Status](https://travis-ci.org/vaadin/vaadin-combo-box.svg?branch=master)](https://travis-ci.org/vaadin/vaadin-combo-box)
[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/vaadin/vaadin-core-elements?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

# &lt;vaadin-combo-box&gt;

[Live Demo ↗](https://cdn.vaadin.com/vaadin-core-elements/master/vaadin-combo-box/demo/)

[&lt;vaadin-combo-box&gt;](https://vaadin.com/elements/-/element/vaadin-combo-box) is a [Polymer](http://polymer-project.org) element combining a dropdown list with an input field for filtering the list of items, part of the [Vaadin Core Elements](https://vaadin.com/elements).

<!--
```
<custom-element-demo height="300">
  <template>
    <script src="../webcomponentsjs/webcomponents-lite.js"></script>
    <link rel="import" href="../iron-ajax/iron-ajax.html">
    <link rel="import" href="../paper-item/all-imports.html">
    <link rel="import" href="vaadin-combo-box.html">
    <next-code-block></next-code-block>
  </template>
</custom-element-demo>
```
-->
```html
<div>
  <style is="custom-style">
    paper-icon-item {
      margin: -13px -16px;
    }
    paper-icon-item img {
      border-radius: 50%;
    }
  </style>
  <template is="dom-bind">
    <iron-ajax url="https://randomuser.me/api?results=100&inc=name,email,picture" last-response="{{response}}" auto></iron-ajax>

    <vaadin-combo-box items="[[response.results]]" item-value-path="email" item-label-path="email">
      <template>
        <paper-icon-item>
          <img src="[[item.picture.thumbnail]]" item-icon>
          <paper-item-body two-line>
            <div>[[item.name.first]] [[item.name.last]]</div>
            <div secondary>[[item.email]]</div>
          </paper-item-body>
        </paper-icon-item>
      </template>
    </vaadin-combo-box>
  </template>
</div>

```

[<img src="https://raw.githubusercontent.com/vaadin/vaadin-combo-box/master/docs/img/vaadin-combo-box-item-template-material.png" width="311" alt="Screenshot of vaadin-combo-box" />](https://vaadin.com/elements/-/element/vaadin-combo-box)


## Contributing

1. Fork the `vaadin-combo-box` repository and clone it locally.

1. Make sure you have [npm](https://www.npmjs.com/) installed.

1. When in the `vaadin-combo-box` directory, run `npm install` to install dependencies.


## Running demos and tests in browser

1. Install [polymer-cli](https://www.npmjs.com/package/polymer-cli): `npm install -g polymer-cli`

1. When in the `vaadin-combo-box` directory, run `polymer install --variants` to install Bower dependencies

1. Run `polymer serve -o`, that will open 3 tabs in your default browser: one pointing the Polymer1 API index of the component,
the second one pointing to the Polymer2 API, and the third one to the main page indicating the variants of the project.
Hence, you can visit demos and tests by changing the URL path in the first two tabs.

    - API documentation: http://localhost:port_number/components/vaadin-combo-box/index.html
    - Examples: http://localhost:port_number/components/vaadin-combo-box/demo/index.html
    - Tests: http://localhost:port_number/components/vaadin-combo-box/test/index.html


## Running tests from the command line

1. When in the `vaadin-combo-box` directory, run `polymer test`


## Following the coding style

We are using [ESLint](http://eslint.org/) for linting JavaScript code. You can check if your code is following our standards by running `gulp lint`, which will automatically lint all `.js` files as well as JavaScript snippets inside `.html` files.


## Creating a pull request

  - Make sure your code is compliant with our code linters: `gulp lint`
  - Check that tests are passing: `npm test`
  - [Submit a pull request](https://www.digitalocean.com/community/tutorials/how-to-create-a-pull-request-on-github) with detailed title and description
  - Wait for response from one of Vaadin Elements team members


## License

Apache License 2.0
