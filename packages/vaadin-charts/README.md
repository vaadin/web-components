![Bower version](https://img.shields.io/bower/v/vaadin-charts.svg)
[![Build Status](https://travis-ci.org/vaadin/vaadin-charts.svg?branch=master)](https://travis-ci.org/vaadin/vaadin-charts)
[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/vaadin/web-components?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

# Vaadin Charts

[Vaadin Charts](https://vaadin.com/charts) is a [Polymer 2](http://polymer-project.org) element providing &lt;vaadin-chart&gt; for creating high quality charts, part of [Vaadin Elements](https://vaadin.com/elements).

## Relevant links

- **Product page** https://vaadin.com/charts
- **Trial license** https://vaadin.com/pro/licenses


## Using Vaadin Charts in your project

### Install Vaadin Charts
```
$ bower install --save vaadin-charts#6.1.0-beta3
```

### Import Vaadin Charts
Add html import
```html
<link rel="import" href="bower_components/vaadin-charts/vaadin-chart.html">
<script src="../../webcomponentsjs/webcomponents-lite.js"></script>
```

### Use Vaadin Charts
Create your first Vaadin Chart
```html
<vaadin-chart>
  ...
</vaadin-chart>
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

1. Run `polymer serve --open`, browser will automatically open the component API documentation.

1. You can also open demo or in-browser tests by adding **demo** or **test** to the URL, for example:

  - http://127.0.0.1:8080/components/vaadin-charts/demo
  - http://127.0.0.1:8080/components/vaadin-charts/test


## Running tests from the command line

1. When in the `vaadin-charts` directory, run `polymer test`


## Following the coding style

We are using [ESLint](http://eslint.org/) for linting JavaScript code. You can check if your code is following our standards by running `gulp lint`, which will automatically lint all `.js` files as well as JavaScript snippets inside `.html` files.


## Contributing

  - Make sure your code is compliant with our code linters: `gulp lint`
  - Check that tests are passing: `polymer test`
  - [Submit a pull request](https://www.digitalocean.com/community/tutorials/how-to-create-a-pull-request-on-github) with detailed title and description
  - Wait for response from one team member


## License

_Vaadin Charts_ is distributed under the terms of
[Commercial Vaadin Add-On License version 3.0](https://vaadin.com/license/cval-3) ("CVALv3"). A copy of the license is included as ```LICENSE.txt``` in this software package.

Vaadin collects development time usage statistics to improve this product. For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
