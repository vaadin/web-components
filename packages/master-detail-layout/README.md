# @vaadin/master-detail-layout

A web component for building UIs with a master (or primary) area and a detail (or secondary) area.

> ⚠️ This component is experimental and the API may change. In order to use it, enable the feature flag by setting `window.Vaadin.featureFlags.masterDetailLayoutComponent = true`.

```html
<vaadin-master-detail-layout>
  <div>Master content</div>
  <div slot="detail">Detail content</div>
</vaadin-master-detail-layout>
```

## Installation

Install the component:

```sh
npm i @vaadin/master-detail-layout
```

Once installed, import the component in your application:

```js
import '@vaadin/master-detail-layout';
```

## Contributing

Read the [contributing guide](https://vaadin.com/docs/latest/contributing) to learn about our development process, how to propose bugfixes and improvements, and how to test your changes to Vaadin components.

## License

Apache License 2.0

Vaadin collects usage statistics at development time to improve this product.
For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
