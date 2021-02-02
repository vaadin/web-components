# &lt;vaadin-app-layout&gt;

[Live Demo ↗](https://vaadin.com/components/vaadin-app-layout/html-examples)
|
[API documentation ↗](https://vaadin.com/components/vaadin-app-layout/html-api)

[&lt;vaadin-app-layout&gt;](https://vaadin.com/components/vaadin-app-layout) is a Web Component providing a quick and easy way to get a common application layout structure done, part of the [Vaadin components](https://vaadin.com/components).

[![npm version](https://badgen.net/npm/v/@vaadin/vaadin-app-layout)](https://www.npmjs.com/package/@vaadin/vaadin-app-layout)
[![Build Status](https://travis-ci.org/vaadin/vaadin-app-layout.svg?branch=master)](https://travis-ci.org/vaadin/vaadin-app-layout)
[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/vaadin/vaadin-app-layout)
[![Published on Vaadin Directory](https://img.shields.io/badge/Vaadin%20Directory-published-00b4f0.svg)](https://vaadin.com/directory/component/vaadinvaadin-app-layout)
[![Stars on vaadin.com/directory](https://img.shields.io/vaadin-directory/star/vaadin-app-layout-directory-urlidentifier.svg)](https://vaadin.com/directory/component/vaadinvaadin-app-layout)
[![Discord](https://img.shields.io/discord/732335336448852018?label=discord)](https://discord.gg/PHmkCKC)

```html
<vaadin-app-layout>
  <vaadin-drawer-toggle slot="navbar touch-optimized"></vaadin-drawer-toggle>
  <h3 slot="navbar touch-optimized">Application Name</h3>
  <vaadin-tabs orientation="vertical" slot="drawer">
    <vaadin-tab>
      <a href="/profile">
        <iron-icon icon="lumo:user"></iron-icon>
        Profile
      </a>
    </vaadin-tab>
    <vaadin-tab>
      <a href="/contact">
        <iron-icon icon="lumo:phone"></iron-icon>
        Contact
      </a>
    </vaadin-tab>
  </vaadin-tabs>
  <div>Page content</div>
</vaadin-app-layout>
```

[<img src="https://raw.githubusercontent.com/vaadin/vaadin-app-layout/master/screenshot.png" width="900" alt="Screenshot of vaadin-app-layout">](https://vaadin.com/components/vaadin-app-layout)

[<img src="https://raw.githubusercontent.com/vaadin/vaadin-app-layout/master/screenshot-mobile.png" width="350" alt="Screenshot of vaadin-app-layout on mobile">](https://vaadin.com/components/vaadin-app-layout)


## Installation

Install `vaadin-app-layout`:

```sh
npm i @vaadin/vaadin-app-layout --save
```

Once installed, import it in your application:

```js
import '@vaadin/vaadin-app-layout/vaadin-app-layout.js';
import '@vaadin/vaadin-app-layout/vaadin-drawer-toggle.js';
```

## Getting Started

Vaadin components use the Lumo theme by default.

To use the Material theme, import the correspondent file from the `theme/material` folder.

## Entry points

- The components with the Lumo theme:

  `theme/lumo/vaadin-app-layout.js`
  `theme/lumo/vaadin-drawer-toggle.js`

- The components with the Material theme:

  `theme/material/vaadin-app-layout.js`
  `theme/material/vaadin-drawer-toggle.js`

- Aliases for `theme/lumo/vaadin-app-layout.js` `theme/lumo/vaadin-drawer-toggle.js`

  `vaadin-app-layout.js`
  `vaadin-drawer-toggle.js`

## Running API docs and tests in a browser

1. Fork the `vaadin-app-layout` repository and clone it locally.

1. Make sure you have [node.js](https://nodejs.org/) 12.x installed.

1. Make sure you have [npm](https://www.npmjs.com/) installed.

1. When in the `vaadin-app-layout` directory, run `npm install` to install dependencies.

1. Run `npm start`, browser will automatically open the component API documentation.

1. You can also open visual tests, for example:

  - http://localhost:8000/test/visual/drawer.html


## Running tests from the command line

1. When in the `vaadin-app-layout` directory, run `npm test`

## Debugging tests in the browser

1. Run `npm run debug`, then choose manual mode (M) and open the link in browser.

## Following the coding style

We are using [ESLint](http://eslint.org/) for linting JavaScript code. You can check if your code is following our standards by running `npm run lint`, which will automatically lint all `.js` files.


## Contributing

To contribute to the component, please read [the guideline](https://github.com/vaadin/vaadin-core/blob/master/CONTRIBUTING.md) first.

## License

Apache License 2.0

Vaadin collects development time usage statistics to improve this product. For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
