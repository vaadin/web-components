# &lt;vaadin-avatar&gt;

[&lt;vaadin-avatar&gt;](https://vaadin.com/components/vaadin-avatar) is a Web Component providing avatar displaying functionality.

[Live Demo ↗](https://vaadin.com/components/vaadin-avatar/html-examples)
|
[API documentation ↗](https://vaadin.com/components/vaadin-avatar/html-api)

[![npm version](https://badgen.net/npm/v/@vaadin/vaadin-avatar)](https://www.npmjs.com/package/@vaadin/vaadin-avatar)
[![Bower version](https://badgen.net/github/release/vaadin/vaadin-avatar)](https://github.com/vaadin/vaadin-avatar/releases)
[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/vaadin/vaadin-avatar)
[![Build Status](https://travis-ci.org/vaadin/vaadin-avatar.svg?branch=master)](https://travis-ci.org/vaadin/vaadin-avatar)
[![Coverage Status](https://coveralls.io/repos/github/vaadin/vaadin-avatar/badge.svg?branch=master)](https://coveralls.io/github/vaadin/vaadin-avatar?branch=master)
[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/vaadin/web-components?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)
[![Published on Vaadin Directory](https://img.shields.io/badge/Vaadin%20Directory-published-00b4f0.svg)](https://vaadin.com/directory/component/vaadinvaadin-avatar)
[![Stars on vaadin.com/directory](https://img.shields.io/vaadin-directory/star/vaadin-avatar-directory-urlidentifier.svg)](https://vaadin.com/directory/component/vaadinvaadin-avatar)
<!--
```
<custom-element-demo>
  <template>
    <script src="../webcomponentsjs/webcomponents-lite.js"></script>
    <link rel="import" href="vaadin-avatar.html">
    <next-code-block></next-code-block>
  </template>
</custom-element-demo>
```
-->
```html
<vaadin-avatar></vaadin-avatar>
<vaadin-avatar name="Jens Jansson"></vaadin-avatar>
<vaadin-avatar abbr="SK"></vaadin-avatar>
<vaadin-avatar-group max="2"></vaadin-avatar-group>
<script>
  document.querySelector('vaadin-avatar-group').items = [
    {name: 'Foo Bar', colorIndex: 1},
    {colorIndex: 2},
    {name: 'Foo Bar', colorIndex: 3}
  ];
</script>
```

[<img src="https://raw.githubusercontent.com/vaadin/vaadin-avatar/master/screenshot.png" width="200" alt="Screenshot of vaadin-avatar">](https://vaadin.com/components/vaadin-avatar)


## Installation

The Vaadin components are distributed as Bower and npm packages.
Please note that the version range is the same, as the API has not changed.
You should not mix Bower and npm versions in the same application, though.

The converted ES Modules are only published on npm, not pushed to GitHub repositories.

### Bower (HTML Imports compatible version)

Install `vaadin-avatar`:

```sh
bower i vaadin/vaadin-avatar --save
```

Once installed, import it in your application:

```html
<link rel="import" href="bower_components/vaadin-avatar/vaadin-avatar.html">
<link rel="import" href="bower_components/vaadin-avatar/vaadin-avatar-group.html">
```

### npm (ES Modules compatible version)

Install `vaadin-avatar`:

```sh
npm i @vaadin/vaadin-avatar --save
```

Once installed, import it in your application:

```js
import '@vaadin/vaadin-avatar/vaadin-avatar.js';
import '@vaadin/vaadin-avatar/vaadin-avatar-group.js';
```

## Getting started

Vaadin components use the Lumo theme by default.

To use the Material theme, import the correspondent file from the `theme/material` folder.

## Entry points

- The components with the Lumo theme:

  `theme/lumo/vaadin-avatar.html`
  `theme/lumo/vaadin-avatar-group.html`

- The components with the Material theme:

  `theme/material/vaadin-avatar.html`
  `theme/material/vaadin-avatar-group.html`

- Alias for `theme/lumo/vaadin-avatar.html` `theme/lumo/vaadin-avatar-group.html`:

  `vaadin-avatar.html`
  `vaadin-avatar-group.html`


## Running demos and tests in a browser

1. Fork the `vaadin-avatar` repository and clone it locally.

1. Make sure you have [npm](https://www.npmjs.com/) and [Bower](https://bower.io) installed.

1. When in the `vaadin-avatar` directory, run `npm install` and then `bower install` to install dependencies.

1. Make sure you have [polymer-cli](https://www.npmjs.com/package/polymer-cli) installed globally: `npm i -g polymer-cli`.

1. Run `npm start`, browser will automatically open the component API documentation.

1. You can also open demo or in-browser tests by adding **demo** or **test** to the URL, for example:

  - http://127.0.0.1:3000/components/vaadin-avatar/demo
  - http://127.0.0.1:3000/components/vaadin-avatar/test


## Running tests from the command line

1. When in the `vaadin-avatar` directory, run `npm test`


## Following the coding style

We are using [ESLint](http://eslint.org/) for linting JavaScript code. You can check if your code is following our standards by running `npm run lint`, which will automatically lint all `.js` files as well as JavaScript snippets inside `.html` files.


## Big Thanks

Cross-browser Testing Platform and Open Source <3 Provided by [Sauce Labs](https://saucelabs.com).


## Contributing

  To contribute to the component, please read [the guideline](https://github.com/vaadin/vaadin-core/blob/master/CONTRIBUTING.md) first.


## License

Apache License 2.0

Vaadin collects development time usage statistics to improve this product. For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
