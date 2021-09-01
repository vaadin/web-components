# @vaadin/checkbox-group

A web component that allows the user to choose several items from a group of binary choices.

[Live Demo ↗](https://vaadin.com/docs/latest/ds/components/checkbox)

```html
<vaadin-checkbox-group label="Export data">
  <vaadin-checkbox value="0">Order ID</vaadin-checkbox>
  <vaadin-checkbox value="1">Product name</vaadin-checkbox>
  <vaadin-checkbox value="2">Customer</vaadin-checkbox>
  <vaadin-checkbox value="3">Status</vaadin-checkbox>
</vaadin-checkbox-group>
```

## Installation

Install the component:

```sh
npm i @vaadin/checkbox-group --save
```

Once installed, import the component in your application:

```js
import '@vaadin/checkbox-group';
```

## Themes

Vaadin components come with two built-in [themes](https://vaadin.com/docs/latest/ds/customization/using-themes),
Lumo and Material. The [main entrypoint](https://github.com/vaadin/web-components/blob/master/packages/checkbox-group/vaadin-checkbox-group.js)
of the package uses the Lumo theme.

To use the Material theme, import the component from the `theme/material` folder:

```js
import '@vaadin/checkbox-group/theme/material/vaadin-checkbox-group.js';
```

You can also import the Lumo version of the component explicitly:

```js
import '@vaadin/checkbox-group/theme/lumo/vaadin-checkbox-group.js';
```

Finally, you can import the un-themed component from the `src` folder to get a minimal starting point:

```js
import '@vaadin/checkbox-group/src/vaadin-checkbox-group.js';
```

## License

Apache License 2.0

Vaadin collects development time usage statistics to improve this product.
For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
