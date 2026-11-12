# @vaadin/navigation-layout

A layout for navigation content, with fixed start and end areas and a scrollable area in between.

```html
<vaadin-navigation-layout>
  <vaadin-navigation-layout-toggle slot="start">Toggle</vaadin-navigation-layout-toggle>
  <vaadin-side-nav>...</vaadin-side-nav>
  <div slot="end">Footer</div>
</vaadin-navigation-layout>
```

## Installation

Install the component:

```sh
npm i @vaadin/navigation-layout
```

Once installed, import the component in your application:

```js
import '@vaadin/navigation-layout';
import '@vaadin/navigation-layout/vaadin-navigation-layout-toggle.js';
```

## Contributing

Read the [contributing guide](https://vaadin.com/docs/latest/contributing) to learn about our development process, how to propose bugfixes and improvements, and how to test your changes to Vaadin components.

## License

Apache License 2.0

Vaadin collects usage statistics at development time to improve this product.
For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
