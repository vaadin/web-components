# @vaadin/checkbox-group

A web component that allows the user to choose several items from a group of binary choices.

[Documentation + Live Demo ↗](https://vaadin.com/docs/latest/components/checkbox)

[![npm version](https://badgen.net/npm/v/@vaadin/checkbox-group)](https://www.npmjs.com/package/@vaadin/checkbox-group)
[![Discord](https://img.shields.io/discord/732335336448852018?label=discord)](https://discord.gg/PHmkCKC)

```html
<vaadin-checkbox-group label="Export data">
  <vaadin-checkbox value="0" label="Order ID"></vaadin-checkbox>
  <vaadin-checkbox value="1" label="Product name"></vaadin-checkbox>
  <vaadin-checkbox value="2" label="Customer"></vaadin-checkbox>
  <vaadin-checkbox value="3" label="Status"></vaadin-checkbox>
</vaadin-checkbox-group>
```

## Installation

Install the component:

```sh
npm i @vaadin/checkbox-group
```

Once installed, import the component in your application:

```js
import '@vaadin/checkbox-group';
```

## Themes

Vaadin components come with two built-in [themes](https://vaadin.com/docs/latest/styling), Lumo and Material.
The [main entrypoint](https://github.com/vaadin/web-components/blob/master/packages/checkbox-group/vaadin-checkbox-group.js) of the package uses the Lumo theme.

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

## Contributing

Read the [contributing guide](https://vaadin.com/docs/latest/contributing/overview) to learn about our development process, how to propose bugfixes and improvements, and how to test your changes to Vaadin components.

## License

Apache License 2.0

Vaadin collects usage statistics at development time to improve this product.
For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
