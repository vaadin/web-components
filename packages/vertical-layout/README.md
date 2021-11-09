# @vaadin/vertical-layout

A web component that places its content top-to-bottom in a column.

[Documentation + Live Demo ↗](https://vaadin.com/docs/latest/ds/components/basic-layouts/#horizontal-layout)

```html
<vaadin-vertical-layout theme="spacing padding">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
  <div>Item 4</div>
</vaadin-vertical-layout>
```

## Installation

Install the component:

```sh
npm i @vaadin/vertical-layout
```

Once installed, import the component in your application:

```js
import '@vaadin/vertical-layout';
```

## Themes

Vaadin components come with two built-in [themes](https://vaadin.com/docs/latest/ds/customization/using-themes), Lumo and Material.
The [main entrypoint](https://github.com/vaadin/web-components/blob/master/packages/vertical-layout/vaadin-vertical-layout.js) of the package uses the Lumo theme.

To use the Material theme, import the component from the `theme/material` folder:

```js
import '@vaadin/vertical-layout/theme/material/vaadin-vertical-layout.js';
```

You can also import the Lumo version of the component explicitly:

```js
import '@vaadin/vertical-layout/theme/lumo/vaadin-vertical-layout.js';
```

Finally, you can import the un-themed component from the `src` folder to get a minimal starting point:

```js
import '@vaadin/vertical-layout/src/vaadin-vertical-layout.js';
```

## Contributing

Read the [contributing guide](https://vaadin.com/docs/latest/guide/contributing/overview) to learn about our development process, how to propose bugfixes and improvements, and how to test your changes to Vaadin components.

## License

Apache License 2.0

Vaadin collects usage statistics at development time to improve this product.
For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
