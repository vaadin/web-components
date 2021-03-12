# Vaadin Charts

[Live Demo ↗](https://vaadin.com/components/vaadin-charts/examples)
|
[API documentation ↗](https://vaadin.com/components/vaadin-charts/html-api)

[Vaadin Charts](https://vaadin.com/components/vaadin-charts) is a Web Component for creating high quality charts, part of the [Vaadin components](https://vaadin.com/components).

[![npm version](https://badgen.net/npm/v/@vaadin/vaadin-charts)](https://www.npmjs.com/package/@vaadin/vaadin-charts)
[![Build Status](https://travis-ci.org/vaadin/vaadin-charts.svg?branch=master)](https://travis-ci.org/vaadin/vaadin-charts)
[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/vaadin/vaadin-charts)
[![Published on Vaadin Directory](https://img.shields.io/badge/Vaadin%20Directory-published-00b4f0.svg)](https://vaadin.com/directory/component/vaadinvaadin-element)
[![Stars on vaadin.com/directory](https://img.shields.io/vaadin-directory/star/vaadin-charts.svg)](https://vaadin.com/directory/component/vaadinvaadin-charts)
[![Discord](https://img.shields.io/discord/732335336448852018?label=discord)](https://discord.gg/PHmkCKC)

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

[<img src="https://raw.githubusercontent.com/vaadin/vaadin-charts/master/screenshot.png" width="530" alt="Screenshot of vaadin-chart">](https://vaadin.com/components/vaadin-chart)

## Relevant links

- **Product page** https://vaadin.com/charts
- **Trial license** https://vaadin.com/pro/licenses


## Installation

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

## Running API docs and tests in a browser

1. Fork the `vaadin-charts` repository and clone it locally.

1. Make sure you have [node.js](https://nodejs.org/) 12.x installed.

1. Make sure you have [npm](https://www.npmjs.com/) installed.

1. When in the `vaadin-charts` directory, run `npm install` to install dependencies.

1. Run `npm start`, browser will automatically open the component API documentation.

1. You can also open visual tests, for example:

  - http://localhost:8000/test/visual/default.html

## Running tests from the command line

1. When in the `vaadin-charts` directory, run `npm test`

## Debugging tests in the browser

1. Run `npm run debug`, then choose manual mode (M) and open the link in browser.


## Following the coding style

We are using [ESLint](http://eslint.org/) for linting JavaScript code. You can check if your code is following our standards by running `npm run lint`, which will automatically lint all `.js` files.


## Contributing

  To contribute to the component, please read [the guideline](https://github.com/vaadin/vaadin-core/blob/master/CONTRIBUTING.md) first.


## License

_Vaadin Charts_ is distributed under the terms of
[Commercial Vaadin Developer License 4.0](https://vaadin.com/license/cvdl-4.0) ("CVDLv4"). A copy of the license is included as ```LICENSE.txt``` in this software package.

Vaadin collects development time usage statistics to improve this product. For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
