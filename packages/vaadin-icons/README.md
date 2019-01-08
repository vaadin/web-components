[![npm version](https://badgen.net/npm/v/@vaadin/vaadin-icons)](https://www.npmjs.com/package/@vaadin/vaadin-icons)
[![Bower version](https://badgen.net/github/release/vaadin/vaadin-icons)](https://github.com/vaadin/vaadin-icons/releases)
[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/vaadin/vaadin-icons)
[![Build status](https://travis-ci.org/vaadin/vaadin-icons.svg?branch=master)](https://travis-ci.org/vaadin/vaadin-icons)
[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/vaadin/web-components?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

[![Published on Vaadin Directory](https://img.shields.io/badge/Vaadin%20Directory-published-00b4f0.svg)](https://vaadin.com/directory/component/vaadinvaadin-icons)
[![Stars on vaadin.com/directory](https://img.shields.io/vaadin-directory/star/vaadinvaadin-icons.svg)](https://vaadin.com/directory/component/vaadinvaadin-icons)

# Vaadin Icons

[<img src="https://raw.github.com/vaadin/vaadin-icons/master/screenshot.png" width="611" alt="Screenshot of some icons in the Vaadin Icons collection" />](https://vaadin.com/icons)


[Vaadin Icons](https://vaadin.com/icons) is a set of 600+ icons designed for web applications. Free to use, anywhere!

Visit **https://vaadin.com/icons** for more information and instructions how to get started using them.

## Installation

The Vaadin components are distributed as Bower and npm packages.
Please note that the version range is the same, as the API has not changed.
You should not mix Bower and npm versions in the same application, though.

Unlike the official Polymer Elements, the converted Polymer 3 compatible Vaadin components
are only published on npm, not pushed to GitHub repositories.

### Polymer 2 and HTML Imports compatible version

Install `vaadin-icons`:

```sh
bower i vaadin/vaadin-icons --save
```

Once installed, import it in your application:

```html
<link rel="import" href="bower_components/vaadin-icons/vaadin-icons.html">
```

### Polymer 3 and ES Modules compatible version

Install `vaadin-icons`:

```sh
npm i @vaadin/vaadin-icons --save
```

Once installed, import it in your application:

```js
import '@vaadin/vaadin-icons/vaadin-icons.js';
```


## Running demos in browser

1. Install [polymer-cli](https://www.npmjs.com/package/polymer-cli): `npm install -g polymer-cli`

1. When in the `vaadin-icons` directory, run `bower install` to install Bower dependencies

1. Run `npm start`, after that you will be able to access:

  - http://127.0.0.1:3000/components/vaadin-icons/demo


## License

The icon files (SVG, PNG, fonts) are licensed under Creative Commons [CC-BY 4.0](https://creativecommons.org/licenses/by/4.0/) license.

The source code in this repository is licensed under Apache License 2.0.

All brand icons are trademarks of their respective owners.
The use of these trademarks does not indicate endorsement of the trademark holder by Vaadin Icons, nor vice versa.
