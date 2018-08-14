[![npm version](https://badgen.net/npm/v/@vaadin/vaadin-board)](https://www.npmjs.com/package/@vaadin/vaadin-board)
[![Bower version](https://badgen.net/github/release/vaadin/vaadin-board)](https://github.com/vaadin/vaadin-board/releases)
[![Build Status](https://travis-ci.org/vaadin/vaadin-board.svg?branch=master)](https://travis-ci.org/vaadin/vaadin-board)
[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/vaadin/web-components?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

 [![Published on Vaadin  Directory](https://img.shields.io/badge/Vaadin%20Directory-published-00b4f0.svg)](https://vaadin.com/directory/component/vaadinvaadin-board)
[![Stars on vaadin.com/directory](https://img.shields.io/vaadin-directory/star/vaadinvaadin-board.svg)](https://vaadin.com/directory/component/vaadinvaadin-board)


# \<vaadin-board\>

[Live Demo ↗](https://vaadin.com/components/vaadin-board/html-examples)
|
[API documentation ↗](https://vaadin.com/components/vaadin-board/html-api)


[&lt;vaadin-board&gt;](https://vaadin.com/components/vaadin-board) is a Web component to create flexible responsive layouts and build nice looking dashboard.
Vaadin Board key feature is how it effectively reorders the widgets on different screen sizes, maximizing the use of space and looking stunning.

```html
<vaadin-board>
  <vaadin-board-row>
    <div class="top a" board-cols="2">top A</div>
    <div class="top b">top B</div>
    <div class="top c">top C</div>
  </vaadin-board-row>
  <vaadin-board-row>
    <div class="mid">mid</div>
  </vaadin-board-row>
  <vaadin-board-row>
    <div class="low a">low A</div>
    <vaadin-board-row>
      <div class="top a">low B / A</div>
      <div class="top b">low B / B</div>
      <div class="top c">low B / C</div>
      <div class="top d">low B / D</div>
    </vaadin-board-row>
  </vaadin-board-row>
</vaadin-board>
```

[<img src="https://raw.githubusercontent.com/vaadin/vaadin-board/master/screenshot.png" alt="Screenshot of vaadin-board">](https://vaadin.com/components/vaadin-board)


### Installation

The Vaadin components are distributed as Bower and npm packages.
Please note that the version range is the same, as the API has not changed.
You should not mix Bower and npm versions in the same application, though.

Unlike the official Polymer Elements, the converted Polymer 3 compatible Vaadin components
are only published on npm, not pushed to GitHub repositories.

### Polymer 2 and HTML Imports compatible version

Install `vaadin-board`: 

```sh
$ bower i vaadin/vaadin-board --save
```

Once installed, import it in your application:

```html
<link rel="import" href="bower_components/vaadin-board/vaadin-board.html">
```

### Polymer 3 and ES Modules compatible version

Install `vaadin-board`:

```sh
npm i @vaadin/vaadin-board --save
```

Once installed, import it in your application:

```js
import '@vaadin/vaadin-board/vaadin-board.js';
```

## Running demos and tests in browser

1. Clone the repository
`git clone https://github.com/vaadin/vaadin-board.git`

1. Make sure you have [npm](https://www.npmjs.com/) installed.

1. When in the `vaadin-element` directory, run `npm install` and then `bower install` to install dependencies.

1. Make sure you have [polymer-cli](https://www.npmjs.com/package/polymer-cli) installed globally: `npm i -g polymer-cli`.

1. Run `polymer serve --open`, browser will automatically open the component API documentation.

1. You can also open demo or in-browser tests by adding **demo** or **test** to the URL, for example:

  - http://127.0.0.1:8080/components/vaadin-board/demo
  - http://127.0.0.1:8080/components/vaadin-board/test


## Running tests from the command line

1. When in the `vaadin-board` directory, run `polymer test`


## Following the coding style

We are using [ESLint](http://eslint.org/) for linting JavaScript code. You can check if your code is following our standards by running `gulp lint`, which will automatically lint all `.js` files as well as JavaScript snippets inside `.html` files.


## Contributing

  To contribute to the component, please read [the guideline](https://github.com/vaadin/vaadin-core/blob/master/CONTRIBUTING.md) first.


## License

Vaadin Board is distributed under [Commercial Vaadin Add-on License version 3](http://vaadin.com/license/cval-3) (CVALv3). For license terms, see LICENSE.txt.

Vaadin collects development time usage statistics to improve this product. For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
