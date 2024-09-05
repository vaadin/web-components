# @vaadin/popover

A web component for creating overlays that are positioned next to specified DOM element (target).

[Documentation + Live Demo ↗](https://vaadin.com/docs/latest/components/popover)

[![npm version](https://badgen.net/npm/v/@vaadin/popover)](https://www.npmjs.com/package/@vaadin/popover)

## Installation

Install the component:

```sh
npm i @vaadin/popover
```

Once installed, import the component in your application:

```js
import '@vaadin/popover';
```

## Themes

Vaadin components come with two built-in [themes](https://vaadin.com/docs/latest/styling), Lumo and Material.
The [main entrypoint](https://github.com/vaadin/web-components/blob/main/packages/popover/vaadin-popover.js) of the package uses Lumo theme.

To use the Material theme, import the component from the `theme/material` folder:

```js
import '@vaadin/popover/theme/material/vaadin-popover.js';
```

You can also import the Lumo version of the component explicitly:

```js
import '@vaadin/popover/theme/lumo/vaadin-popover.js';
```

Finally, you can import the un-themed component from the `src` folder to get a minimal starting point:

```js
import '@vaadin/popover/src/vaadin-popover.js';
```

## Contributing

Read the [contributing guide](https://vaadin.com/docs/latest/contributing) to learn about our development process, how to propose bugfixes and improvements, and how to test your changes to Vaadin components.

## License

Apache License 2.0

Vaadin collects usage statistics at development time to improve this product.
For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
