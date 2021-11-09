# @vaadin/charts

A feature-rich interactive charting library providing multiple different chart types.

> ℹ️&nbsp; A commercial Vaadin [subscription](https://vaadin.com/pricing) is required to use Charts in your project.

[Documentation + Live Demo ↗](https://charts.demo.vaadin.com/vaadin-charts/)

[![npm version](https://badgen.net/npm/v/@vaadin/charts)](https://www.npmjs.com/package/@vaadin/charts)
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

[<img src="https://raw.githubusercontent.com/vaadin/web-components/master/packages/charts/screenshot.png" width="530" alt="Screenshot of vaadin-chart">](https://vaadin.com/docs/latest/ds/components/charts)

## Installation

Install the component:

```sh
npm i @vaadin/charts
```

Once installed, import the component in your application:

```js
import '@vaadin/charts';
```

## Contributing

Read the [contributing guide](https://vaadin.com/docs/latest/guide/contributing/overview) to learn about our development process, how to propose bugfixes and improvements, and how to test your changes to Vaadin components.

## License

Commercial Vaadin Developer License 4.0 (CVDLv4). For license terms, see LICENSE.txt.

Vaadin collects usage statistics at development time to improve this product.
For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
