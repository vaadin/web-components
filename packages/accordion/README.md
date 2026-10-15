# @vaadin/accordion

A web component for displaying a vertically stacked set of expandable panels.

[Documentation + Live Demo ↗](https://vaadin.com/docs/latest/components/accordion)

[![npm version](https://badgen.net/npm/v/@vaadin/accordion)](https://www.npmjs.com/package/@vaadin/accordion)

```html
<vaadin-accordion>
  <vaadin-accordion-panel theme="filled">
    <vaadin-accordion-heading slot="summary">Accordion Panel 1</vaadin-accordion-heading>
    <div>Accordion is a set of expandable sections.</div>
  </vaadin-accordion-panel>
  <vaadin-accordion-panel theme="filled">
    <vaadin-accordion-heading slot="summary">Accordion Panel 2</vaadin-accordion-heading>
    <div>Only one accordion panel can be opened.</div>
  </vaadin-accordion-panel>
</vaadin-accordion>
```

[<img src="https://raw.githubusercontent.com/vaadin/web-components/main/packages/accordion/screenshot.png" alt="Screenshot of vaadin-accordion" width="900">](https://vaadin.com/docs/latest/components/accordion)

## Installation

Install the component:

```sh
npm i @vaadin/accordion
```

Once installed, import the component in your application:

```js
import '@vaadin/accordion';
```

## Contributing

Read the [contributing guide](https://vaadin.com/docs/latest/contributing) to learn about our development process, how to propose bugfixes and improvements, and how to test your changes to Vaadin components.

## License

Apache License 2.0

Vaadin collects usage statistics at development time to improve this product.
For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
