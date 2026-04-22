# @vaadin/breadcrumb

A web component for displaying a breadcrumb trail of navigational steps leading to the current page.

[Documentation + Live Demo ↗](https://vaadin.com/docs/latest/components/breadcrumb)

[![npm version](https://badgen.net/npm/v/@vaadin/breadcrumb)](https://www.npmjs.com/package/@vaadin/breadcrumb)

> ⚠️ This component is experimental and the API may change. In order to use it, enable the feature flag by setting `window.Vaadin.featureFlags.breadcrumbComponent = true`.

```html
<vaadin-breadcrumb>
  <vaadin-breadcrumb-item path="/">Home</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item path="/reports">Reports</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item>Quarterly</vaadin-breadcrumb-item>
</vaadin-breadcrumb>
```

## Installation

Install the component:

```sh
npm i @vaadin/breadcrumb
```

Once installed, import the component in your application:

```js
import '@vaadin/breadcrumb';
```

## Contributing

Read the [contributing guide](https://vaadin.com/docs/latest/contributing) to learn about our development process, how to propose bugfixes and improvements, and how to test your changes to Vaadin components.

## License

Apache License 2.0

Vaadin collects usage statistics at development time to improve this product.
For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
