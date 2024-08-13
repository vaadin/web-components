# @vaadin/checkbox

An input field representing a binary choice.

[Documentation + Live Demo ↗](https://vaadin.com/docs/latest/components/checkbox)

[![npm version](https://badgen.net/npm/v/@vaadin/checkbox)](https://www.npmjs.com/package/@vaadin/checkbox)

```html
<vaadin-checkbox label="Checked" checked></vaadin-checkbox>
<vaadin-checkbox label="Unchecked"></vaadin-checkbox>
<vaadin-checkbox label="Indeterminate" indeterminate></vaadin-checkbox>
```

[<img src="https://raw.githubusercontent.com/vaadin/web-components/main/packages/checkbox/screenshot.png" width="400" alt="Screenshot of vaadin-checkbox">](https://vaadin.com/docs/latest/components/checkbox)

## Installation

Install the component:

```sh
npm i @vaadin/checkbox
```

Once installed, import the component in your application:

```js
import '@vaadin/checkbox';
```

## Themes

Vaadin components come with two built-in [themes](https://vaadin.com/docs/latest/styling), Lumo and Material.
The [main entrypoint](https://github.com/vaadin/web-components/blob/main/packages/checkbox/vaadin-checkbox.js) of the package uses the Lumo theme.

To use the Material theme, import the component from the `theme/material` folder:

```js
import '@vaadin/checkbox/theme/material/vaadin-checkbox.js';
```

You can also import the Lumo version of the component explicitly:

```js
import '@vaadin/checkbox/theme/lumo/vaadin-checkbox.js';
```

Finally, you can import the un-themed component from the `src` folder to get a minimal starting point:

```js
import '@vaadin/checkbox/src/vaadin-checkbox.js';
```

## Contributing

Read the [contributing guide](https://vaadin.com/docs/latest/contributing) to learn about our development process, how to propose bugfixes and improvements, and how to test your changes to Vaadin components.

## License

Apache License 2.0

Vaadin collects usage statistics at development time to improve this product.
For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
