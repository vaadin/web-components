# @vaadin/query-field

A web component for search and filter queries that mix free text with structured `name:value` filters.

[![npm version](https://badgen.net/npm/v/@vaadin/query-field)](https://www.npmjs.com/package/@vaadin/query-field)

```html
<vaadin-query-field label="Search records"></vaadin-query-field>
```

```js
const field = document.querySelector('vaadin-query-field');
field.filters = [
  { name: 'label', label: 'Record label', options: ['Warp Records', 'Ninja Tune'] },
  { name: 'year', label: 'Release year', type: 'number' },
];
```

## Installation

Install the component:

```sh
npm i @vaadin/query-field
```

The component is experimental. Enable the feature flag before importing it:

```js
window.Vaadin ??= {};
window.Vaadin.featureFlags ??= {};
window.Vaadin.featureFlags.queryFieldComponent = true;
import '@vaadin/query-field';
```

## Contributing

Read the [contributing guide](https://vaadin.com/docs/latest/contributing) to learn about our development process, how to propose bugfixes and improvements, and how to test your changes to Vaadin components.

## License

Apache License 2.0

Vaadin collects usage statistics at development time to improve this product.
For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
