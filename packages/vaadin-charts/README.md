[![npm version](https://badgen.net/npm/v/@vaadin/vaadin-charts)](https://www.npmjs.com/package/@vaadin/vaadin-charts)
[![Bower version](https://badgen.net/github/release/vaadin/vaadin-charts)](https://github.com/vaadin/vaadin-charts/releases)
[![Build Status](https://travis-ci.org/vaadin/vaadin-charts.svg?branch=master)](https://travis-ci.org/vaadin/vaadin-charts)
[![Coverage Status](https://coveralls.io/repos/github/vaadin/vaadin-charts/badge.svg?branch=master)](https://coveralls.io/github/vaadin/vaadin-charts?branch=master)
[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/vaadin/vaadin-charts)
[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/vaadin/web-components?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

[![Published on Vaadin  Directory](https://img.shields.io/badge/Vaadin%20Directory-published-00b4f0.svg)](https://vaadin.com/directory/component/vaadinvaadin-element)
[![Stars on vaadin.com/directory](https://img.shields.io/vaadin-directory/star/vaadin-charts.svg)](https://vaadin.com/directory/component/vaadinvaadin-charts)


# Vaadin Charts

[Live Demo ↗](https://vaadin.com/components/vaadin-charts/examples)
|
[API documentation ↗](https://vaadin.com/components/vaadin-charts/html-api)


[Vaadin Charts](https://vaadin.com/components/vaadin-charts) is a Web Component for creating high quality charts, part of the [Vaadin components](https://vaadin.com/components).

<!--
```
<custom-element-demo>
  <template>
    <script src="../webcomponentsjs/webcomponents-lite.js"></script>
    <link rel="import" href="vaadin-chart.html">
    <next-code-block></next-code-block>
  </template>
</custom-element-demo>
```
-->
```html
<vaadin-chart type="pie">
  <vaadin-chart-series values='[
      ["Firefox", 45.0],
      ["IE", 26.8],
      ["Chrome", 12.8],
      ["Safari", 8.5],
      ["Opera", 6.2],
      ["Others", 0.7]]'>
  </vaadin-chart-series>
</vaadin-chart>
```

[<img src="https://raw.githubusercontent.com/vaadin/vaadin-charts/master/screenshot.png" alt="Screenshot of vaadin-chart">](https://vaadin.com/components/vaadin-chart)

## Relevant links

- **Product page** https://vaadin.com/charts
- **Trial license** https://vaadin.com/pro/licenses


## Installation

Vaadin components are distributed as Bower and npm packages.
Please note that the version range is the same, as the API has not changed.
You should not mix Bower and npm versions in the same application, though.

Unlike the official Polymer Elements, the converted Polymer 3 compatible Vaadin components
are only published on npm, not pushed to GitHub repositories.

### Polymer 2 and HTML Imports compatible version

Install `vaadin-charts`:

```sh
bower i vaadin/vaadin-charts --save
```

Once installed, import it in your application:

```html
<link rel="import" href="bower_components/vaadin-charts/vaadin-chart.html">
```

### Polymer 3 and ES Modules compatible version


Install `vaadin-charts`:

```sh
npm i @vaadin/vaadin-charts --save
```

Once installed, import it in your application:

```js
import '@vaadin/vaadin-charts/vaadin-chart.js';
```

### Install License Key
After one day using Vaadin Charts in a development environment you will see a pop-up that asks you to enter the license key.
You can get your trial key from [https://vaadin.com/pro/licenses](https://vaadin.com/pro/licenses).
If the license is valid, it will be saved to the local storage of the browser and you will not see the pop-up again.

[<img src="https://raw.githubusercontent.com/vaadin/vaadin-charts/6.0-preview/screenshot.png" width="400" alt="Screenshot of vaadin-chart">](https://vaadin.com/elements/-/element/vaadin-chart)


## Running demos and tests in browser

1. Fork the `vaadin-charts` repository and clone it locally.

1. Make sure you have [npm](https://www.npmjs.com/) installed.

1. When in the `vaadin-charts` directory, run `npm install` and then `bower install` to install dependencies.

1. Make sure you have [polymer-cli](https://www.npmjs.com/package/polymer-cli) installed globally: `npm i -g polymer-cli`.

1. Run `polymer serve --open`, browser will automatically open the component API documentation.

1. You can also open demo or in-browser tests by adding **demo** or **test** to the URL, for example:

  - http://127.0.0.1:8080/components/vaadin-charts/demo
  - http://127.0.0.1:8080/components/vaadin-charts/test


## Running tests from the command line

1. When in the `vaadin-charts` directory, run `polymer test`


## Following the coding style

We are using [ESLint](http://eslint.org/) for linting JavaScript code. You can check if your code is following our standards by running `npm run lint`, which will automatically lint all `.js` files as well as JavaScript snippets inside `.html` files.


## Contributing

  To contribute to the component, please read [the guideline](https://github.com/vaadin/vaadin-core/blob/master/CONTRIBUTING.md) first.


## License

_Vaadin Charts_ is distributed under the terms of
[Commercial Vaadin Add-On License version 3.0](https://vaadin.com/license/cval-3) ("CVALv3"). A copy of the license is included as ```LICENSE.txt``` in this software package.

Vaadin collects development time usage statistics to improve this product. For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
