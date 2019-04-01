[![npm version](https://badgen.net/npm/v/@vaadin/vaadin-login)](https://www.npmjs.com/package/@vaadin/vaadin-login)
[![Bower version](https://badgen.net/github/release/vaadin/vaadin-login)](https://github.com/vaadin/vaadin-login/releases)
[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/vaadin/vaadin-login)
[![Build Status](https://travis-ci.org/vaadin/vaadin-login.svg?branch=master)](https://travis-ci.org/vaadin/vaadin-login)
[![Coverage Status](https://coveralls.io/repos/github/vaadin/vaadin-login/badge.svg?branch=master)](https://coveralls.io/github/vaadin/vaadin-login?branch=master)
[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/vaadin/web-components?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

 [![Published on Vaadin  Directory](https://img.shields.io/badge/Vaadin%20Directory-published-00b4f0.svg)](https://vaadin.com/directory/component/vaadinvaadin-login)
[![Stars on vaadin.com/directory](https://img.shields.io/vaadin-directory/star/vaadin-login-directory-urlidentifier.svg)](https://vaadin.com/directory/component/vaadinvaadin-login)


# &lt;vaadin-login&gt;

[Live Demo ↗](https://vaadin.com/components/vaadin-login/html-examples)
|
[API documentation ↗](https://vaadin.com/components/vaadin-login/html-api)

[Vaadin Login](https://vaadin.com/components/vaadin-login) consists of two components:

&lt;vaadin-login-overlay&gt; is a Web Component providing a painless login experience, part of the [Vaadin components](https://vaadin.com/components). Component shows the &lt;vaadin-login-form&gt; inside of an overlay.

```html
<vaadin-login-overlay opened></vaadin-login-overlay>
```

[<img src="https://raw.githubusercontent.com/vaadin/vaadin-login/master/screenshot.png" width="700" alt="Screenshot of vaadin-login-overlay">](https://vaadin.com/components/vaadin-login)

&lt;vaadin-login-form&gt; is a Web Component providing a form to require users to log in into an application.

```html
<vaadin-login-form></vaadin-login-form>
```

## Installation

The Vaadin components are distributed as Bower and npm packages.
Please note that the version range is the same, as the API has not changed.
You should not mix Bower and npm versions in the same application, though.

Unlike the official Polymer Elements, the converted Polymer 3 compatible Vaadin components
are only published on npm, not pushed to GitHub repositories.

### Polymer 2 and HTML Imports compatible version

Install `vaadin-login`:

```sh
bower i vaadin/vaadin-login --save
```

Once installed, import it in your application:

```html
<link rel="import" href="bower_components/vaadin-login/vaadin-login-overlay.html">
```
### Polymer 3 and ES Modules compatible version


Install `vaadin-login`:

```sh
npm i @vaadin/vaadin-login --save
```

Once installed, import it in your application:

```js
import '@vaadin/vaadin-login/vaadin-login-overlay.js';
```

## Getting started

Vaadin components use the Lumo theme by default.

To use the Material theme, import the correspondent file from the `theme/material` folder.

## Entry points

- The component with the Lumo theme:

  `theme/lumo/vaadin-login-overlay.html`
  `theme/lumo/vaadin-login-form.html`

- The component with the Material theme:

  `theme/material/vaadin-login-overlay.html`
  `theme/material/vaadin-login-form.html`

- Aliases for lumo themed components:

  `vaadin-login-overlay.html`
  `vaadin-login-form.html`


## Running demos and tests in browser

1. Fork the `vaadin-login` repository and clone it locally.

1. Make sure you have [npm](https://www.npmjs.com/) installed.

1. When in the `vaadin-login` directory, run `npm install` and then `bower install` to install dependencies.

1. Make sure you have [polymer-cli](https://www.npmjs.com/package/polymer-cli) installed globally: `npm i -g polymer-cli`.

1. Run `npm start`, browser will automatically open the component API documentation.

1. You can also open demo or in-browser tests by adding **demo** or **test** to the URL, for example:

  - http://127.0.0.1:8080/components/vaadin-login/demo
  - http://127.0.0.1:8080/components/vaadin-login/test


## Running tests from the command line

1. When in the `vaadin-login` directory, run `polymer test`


## Following the coding style

We are using [ESLint](http://eslint.org/) for linting JavaScript code. You can check if your code is following our standards by running `npm run lint`, which will automatically lint all `.js` files as well as JavaScript snippets inside `.html` files.


## Big Thanks

Cross-browser Testing Platform and Open Source <3 Provided by [Sauce Labs](https://saucelabs.com).


## Contributing

  To contribute to the component, please read [the guideline](https://github.com/vaadin/vaadin-core/blob/master/CONTRIBUTING.md) first.


## License

Apache License 2.0

Vaadin collects development time usage statistics to improve this product. For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
