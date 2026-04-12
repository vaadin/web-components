# @vaadin/breadcrumb

A web component for displaying breadcrumb navigation.

> **Note:** This component is experimental. Enable the feature flag before importing:
> `window.Vaadin.featureFlags.breadcrumbComponent = true`

[Documentation + Live Demo ↗](https://vaadin.com/docs/latest/components/breadcrumb)

[![npm version](https://badgen.net/npm/v/@vaadin/breadcrumb)](https://www.npmjs.com/package/@vaadin/breadcrumb)

```html
<vaadin-breadcrumb>
  <vaadin-breadcrumb-item path="/home">Home</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item path="/products">Products</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item>Current Page</vaadin-breadcrumb-item>
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
