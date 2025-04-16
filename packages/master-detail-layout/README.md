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

## Themes

Vaadin components come with two built-in [themes](https://vaadin.com/docs/latest/styling), Lumo and Material.
The [main entrypoint](https://github.com/vaadin/web-components/blob/main/packages/master-detail-layout/vaadin-master-detail-layout.js) of the package uses the Lumo theme.

To use the Material theme, import the component from the `theme/material` folder:

```js
import '@vaadin/master-detail-layout/theme/material/vaadin-master-detail-layout.js';
```

You can also import the Lumo version of the component explicitly:

```js
import '@vaadin/master-detail-layout/theme/lumo/vaadin-master-detail-layout.js';
```

Finally, you can import the un-themed component from the `src` folder to get a minimal starting point:

```js
import '@vaadin/master-detail-layout/src/vaadin-master-detail-layout.js';
```

## Contributing

Read the [contributing guide](https://vaadin.com/docs/latest/contributing) to learn about our development process, how to propose bugfixes and improvements, and how to test your changes to Vaadin components.

## License

Apache License 2.0

Vaadin collects usage statistics at development time to improve this product.
For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
