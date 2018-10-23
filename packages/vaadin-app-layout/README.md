[![npm version](https://badgen.net/npm/v/@vaadin/vaadin-app-layout)](https://www.npmjs.com/package/@vaadin/vaadin-app-layout)
[![Bower version](https://badgen.net/github/release/vaadin/vaadin-app-layout)](https://github.com/vaadin/vaadin-app-layout/releases)
[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/vaadin/vaadin-app-layout)
[![Build Status](https://travis-ci.org/vaadin/vaadin-app-layout.svg?branch=master)](https://travis-ci.org/vaadin/vaadin-app-layout)
[![Coverage Status](https://coveralls.io/repos/github/vaadin/vaadin-app-layout/badge.svg?branch=master)](https://coveralls.io/github/vaadin/vaadin-app-layout?branch=master)
[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/vaadin/web-components?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

 [![Published on Vaadin  Directory](https://img.shields.io/badge/Vaadin%20Directory-published-00b4f0.svg)](https://vaadin.com/directory/component/vaadinvaadin-app-layout)
[![Stars on vaadin.com/directory](https://img.shields.io/vaadin-directory/star/vaadin-app-layout-directory-urlidentifier.svg)](https://vaadin.com/directory/component/vaadinvaadin-app-layout)


# &lt;vaadin-app-layout&gt;

[Live Demo ↗](https://vaadin.com/components/vaadin-app-layout/html-examples)
|
[API documentation ↗](https://vaadin.com/components/vaadin-app-layout/html-api)


[&lt;vaadin-app-layout&gt;](https://vaadin.com/components/vaadin-app-layout) is a Web Component providing a quick and easy way to get a common application layout structure done, part of the [Vaadin components](https://vaadin.com/components).

```html
<vaadin-app-layout>
  <h3 slot="branding">Application Name</h3>
  <vaadin-tabs slot="menu">
      <vaadin-tab>Page 1</vaadin-tab>
      <vaadin-tab>Page 2</vaadin-tab>
  </vaadin-tabs>
  <div>Page content</div>
</vaadin-app-layout>
```

[<img src="https://raw.githubusercontent.com/vaadin/vaadin-app-layout/master/screenshot.png" width="500" alt="Screenshot of vaadin-app-layout">](https://vaadin.com/components/vaadin-app-layout)

[<img src="https://raw.githubusercontent.com/vaadin/vaadin-app-layout/master/screenshot-mobile.png" width="350" alt="Screenshot of vaadin-app-layout on mobile">](https://vaadin.com/components/vaadin-app-layout)


## Installation

The Vaadin components are distributed as Bower and npm packages.
Please note that the version range is the same, as the API has not changed.
You should not mix Bower and npm versions in the same application, though.

Unlike the official Polymer Elements, the converted Polymer 3 compatible Vaadin components
are only published on npm, not pushed to GitHub repositories.

### Polymer 2 and HTML Imports compatible version

Install `vaadin-app-layout`:

```sh
bower i vaadin/vaadin-app-layout --save
```

Once installed, import it in your application:

```html
<link rel="import" href="bower_components/vaadin-app-layout/vaadin-app-layout.html">
```
### Polymer 3 and ES Modules compatible version


Install `vaadin-app-layout`:

```sh
npm i @vaadin/vaadin-app-layout --save
```

Once installed, import it in your application:

```js
import '@vaadin/vaadin-app-layout/vaadin-app-layout.js';
```

## Getting Started

Vaadin components use the Lumo theme by default.

## The file structure for Vaadin components

- `src/vaadin-app-layout.html`

  Unstyled component.

- `theme/lumo/vaadin-app-layout.html`

  Component with Lumo theme.

- `vaadin-app-layout.html`

  Alias for theme/lumo/vaadin-app-layout.html


## Running demos and tests in browser

1. Fork the `vaadin-app-layout` repository and clone it locally.

1. Make sure you have [npm](https://www.npmjs.com/) installed.

1. When in the `vaadin-app-layout` directory, run `npm install` and then `bower install` to install dependencies.

1. Make sure you have [polymer-cli](https://www.npmjs.com/package/polymer-cli) installed globally: `npm i -g polymer-cli`.

1. Run `polymer serve --open`, browser will automatically open the component API documentation.

1. You can also open demo or in-browser tests by adding **demo** or **test** to the URL, for example:

  - http://127.0.0.1:8080/components/vaadin-app-layout/demo
  - http://127.0.0.1:8080/components/vaadin-app-layout/test


## Running tests from the command line

1. When in the `vaadin-app-layout` directory, run `polymer test`


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
