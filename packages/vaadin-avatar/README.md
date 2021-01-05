# &lt;vaadin-avatar&gt;

[&lt;vaadin-avatar&gt;](https://vaadin.com/components/vaadin-avatar) is a Web Component providing avatar displaying functionality.

[Live Demo ↗](https://vaadin.com/components/vaadin-avatar/html-examples)
|
[API documentation ↗](https://vaadin.com/components/vaadin-avatar/html-api)

[![npm version](https://badgen.net/npm/v/@vaadin/vaadin-avatar)](https://www.npmjs.com/package/@vaadin/vaadin-avatar)
[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/vaadin/vaadin-avatar)
[![Build Status](https://travis-ci.org/vaadin/vaadin-avatar.svg?branch=master)](https://travis-ci.org/vaadin/vaadin-avatar)
[![Published on Vaadin Directory](https://img.shields.io/badge/Vaadin%20Directory-published-00b4f0.svg)](https://vaadin.com/directory/component/vaadinvaadin-avatar)
[![Stars on vaadin.com/directory](https://img.shields.io/vaadin-directory/star/vaadin-avatar-directory-urlidentifier.svg)](https://vaadin.com/directory/component/vaadinvaadin-avatar)
[![Discord](https://img.shields.io/discord/732335336448852018?label=discord)](https://discord.gg/PHmkCKC)

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

  `theme/lumo/vaadin-avatar.js`
  `theme/lumo/vaadin-avatar-group.js`

- The components with the Material theme:

  `theme/material/vaadin-avatar.js`
  `theme/material/vaadin-avatar-group.js`

- Alias for `theme/lumo/vaadin-avatar.js` `theme/lumo/vaadin-avatar-group.js`:

  `vaadin-avatar.js`
  `vaadin-avatar-group.js`


## Running API docs and tests in a browser

1. Fork the `vaadin-avatar` repository and clone it locally.

1. Make sure you have [node.js](https://nodejs.org/) 12.x installed.

1. Make sure you have [npm](https://www.npmjs.com/) installed.

1. When in the `vaadin-avatar` directory, run `npm install` to install dependencies.

1. Run `npm start`, browser will automatically open the component API documentation.

1. You can also open visual tests, for example:

  - http://127.0.0.1:3000/test/visual/default.html


## Running tests from the command line

1. When in the `vaadin-avatar` directory, run `npm test`

## Debugging tests in the browser

1. Run `npm run debug`, then choose manual mode (M) and open the link in browser.

## Following the coding style

We are using [ESLint](http://eslint.org/) for linting JavaScript code. You can check if your code is following our standards by running `npm run lint`, which will automatically lint all `.js` files.


## Big Thanks

Cross-browser Testing Platform and Open Source <3 Provided by [Sauce Labs](https://saucelabs.com).


## Contributing

To contribute to the component, please read [the guideline](https://github.com/vaadin/vaadin-core/blob/master/CONTRIBUTING.md) first.


## License

Apache License 2.0

Vaadin collects development time usage statistics to improve this product. For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
