# Vaadin Charts

[Live Demo ↗](https://vaadin.com/components/vaadin-charts/examples)
|
[API documentation ↗](https://vaadin.com/components/vaadin-charts/html-api)

[Vaadin Charts](https://vaadin.com/components/vaadin-charts) is a Web Component for creating high quality charts, part of the [Vaadin components](https://vaadin.com/components).

[![npm version](https://badgen.net/npm/v/@vaadin/vaadin-charts)](https://www.npmjs.com/package/@vaadin/vaadin-charts)
[![Published on Vaadin Directory](https://img.shields.io/badge/Vaadin%20Directory-published-00b4f0.svg)](https://vaadin.com/directory/component/vaadinvaadin-element)
[![Discord](https://img.shields.io/discord/732335336448852018?label=discord)](https://discord.gg/PHmkCKC)

```html
<vaadin-chart type="pie">
  <vaadin-chart-series
    values='[
      ["Firefox", 45.0],
      ["IE", 26.8],
      ["Chrome", 12.8],
      ["Safari", 8.5],
      ["Opera", 6.2],
      ["Others", 0.7]]'
  >
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

## Contributing

Read the [contributing guide](https://vaadin.com/docs/latest/guide/contributing/overview) to learn about our development process, how to propose bugfixes and improvements, and how to test your changes to Vaadin components.

## License

_Vaadin Charts_ is distributed under the terms of
[Commercial Vaadin Developer License 4.0](https://vaadin.com/license/cvdl-4.0) ("CVDLv4"). A copy of the license is included as `LICENSE.txt` in this software package.

Vaadin collects development time usage statistics to improve this product. For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
