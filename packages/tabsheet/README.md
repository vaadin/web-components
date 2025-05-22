# @vaadin/tabsheet

A web component for organizing and grouping content into sections.

[Documentation + Live Demo ↗](https://vaadin.com/docs/latest/components/tabs/#tab-sheet)

[![npm version](https://badgen.net/npm/v/@vaadin/tabsheet)](https://www.npmjs.com/package/@vaadin/tabsheet)

```html
<vaadin-tabsheet>
  <vaadin-tabs slot="tabs">
    <vaadin-tab id="tab-1">Tab 1</vaadin-tab>
    <vaadin-tab id="tab-2">Tab 2</vaadin-tab>
    <vaadin-tab id="tab-3">Tab 3</vaadin-tab>
  </vaadin-tabs>

  <div tab="tab-1">Panel 1</div>
  <div tab="tab-2">Panel 2</div>
  <div tab="tab-3">Panel 3</div>
</vaadin-tabsheet>
```

[<img src="https://raw.githubusercontent.com/vaadin/web-components/main/packages/tabsheet/screenshot.png" width="735" alt="Screenshot of vaadin-tabsheet">](https://vaadin.com/docs/latest/components/tabs/#tab-sheet)

## Installation

Install the component:

```sh
npm i @vaadin/tabsheet
```

Once installed, import the component in your application:

```js
import '@vaadin/tabsheet';
```

## Contributing

Read the [contributing guide](https://vaadin.com/docs/latest/contributing) to learn about our development process, how to propose bugfixes and improvements, and how to test your changes to Vaadin components.

## License

Apache License 2.0

Vaadin collects usage statistics at development time to improve this product.
For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
