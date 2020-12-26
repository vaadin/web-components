# &lt;vaadin-context-menu&gt;

[Live Demo ↗](https://vaadin.com/components/vaadin-context-menu/html-examples)
|
[API documentation ↗](https://vaadin.com/components/vaadin-context-menu/html-api)

[&lt;vaadin-context-menu&gt;](https://vaadin.com/components/vaadin-context-menu) is a Web Component providing a contextual menu, part of the [Vaadin components](https://vaadin.com/components).

[![npm version](https://badgen.net/npm/v/@vaadin/vaadin-context-menu)](https://www.npmjs.com/package/@vaadin/vaadin-context-menu)
[![Build Status](https://travis-ci.org/vaadin/vaadin-context-menu.svg?branch=master)](https://travis-ci.org/vaadin/vaadin-context-menu)
[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/vaadin/vaadin-context-menu)
[![Published on Vaadin Directory](https://img.shields.io/badge/Vaadin%20Directory-published-00b4f0.svg)](https://vaadin.com/directory/component/vaadinvaadin-context-menu)
[![Stars on vaadin.com/directory](https://img.shields.io/vaadin-directory/star/vaadinvaadin-context-menu.svg)](https://vaadin.com/directory/component/vaadinvaadin-context-menu)
[![Discord](https://img.shields.io/discord/732335336448852018?label=discord)](https://discord.gg/PHmkCKC)

```html
<vaadin-context-menu>
  Open a context menu with <b>right click</b> or with <b>long touch.</b>
</vaadin-context-menu>

<script>
  const contextMenu = document.querySelector('vaadin-context-menu');
  contextMenu.renderer = function(root) {
    let listBox = root.firstElementChild;
    // Check if there is a list-box generated with the previous renderer call to update its content instead of recreation
    if (listBox) {
      listBox.innerHTML = '';
    } else {
      listBox = document.createElement('vaadin-list-box');
      root.appendChild(listBox);
    }

    ['First', 'Second', 'Third'].forEach(function(name) {
      const item = document.createElement('vaadin-item');
      item.textContent = name + ' menu item';
      listBox.appendChild(item);
    });
  };
</script>
```

[<img src="https://raw.githubusercontent.com/vaadin/vaadin-context-menu/master/screenshot.png" width="493" alt="Screenshot of vaadin-context-menu">](https://vaadin.com/components/vaadin-context-menu)

**Note:** [`<vaadin-list-box>`](https://github.com/vaadin/vaadin-list-box) component used in the above example should be installed and imported separately.

## Installation

Install `vaadin-context-menu`:

```sh
npm i @vaadin/vaadin-context-menu --save
```

Once installed, import it in your application:

```js
import '@vaadin/vaadin-context-menu/vaadin-context-menu.js';
```

## Getting started

Vaadin components use the Lumo theme by default.

To use the Material theme, import the correspondent file from the `theme/material` folder.

## Entry points

- The component with the Lumo theme:

  `theme/lumo/vaadin-context-menu.js`

- The component with the Material theme:

  `theme/material/vaadin-context-menu.js`

- Alias for `theme/lumo/vaadin-context-menu.js`:

  `vaadin-context-menu.js`


## Running API docs and tests in a browser

1. Fork the `vaadin-context-menu` repository and clone it locally.

1. Make sure you have [node.js](https://nodejs.org/) 12.x installed.

1. Make sure you have [npm](https://www.npmjs.com/) installed.

1. When in the `vaadin-context-menu` directory, run `npm install` to install dependencies.

1. Run `npm start`, browser will automatically open the component API documentation.

1. You can also open visual tests, for example:

  - http://127.0.0.1:3000/test/visual/default.html


## Running tests from the command line

1. When in the `vaadin-context-menu` directory, run `npm test`

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
