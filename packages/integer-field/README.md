# @vaadin/integer-field

An extension of [`<vaadin-number-field>`](https://www.npmjs.com/package/@vaadin/number-field) component that only allows entering integer numbers.

[Documentation + Live Demo ↗](https://vaadin.com/docs/latest/components/number-field/#integer-field)

[![npm version](https://badgen.net/npm/v/@vaadin/integer-field)](https://www.npmjs.com/package/@vaadin/integer-field)
[![Discord](https://img.shields.io/discord/732335336448852018?label=discord)](https://discord.gg/PHmkCKC)

```html
<vaadin-integer-field label="X"></vaadin-integer-field>
```

## Installation

Install the component:

```sh
npm i @vaadin/integer-field
```

Once installed, import the component in your application:

```js
import '@vaadin/integer-field';
```

## Themes

Vaadin components come with two built-in [themes](https://vaadin.com/docs/latest/styling), Lumo and Material.
The [main entrypoint](https://github.com/vaadin/web-components/blob/master/packages/integer-field/vaadin-integer-field.js) of the package uses Lumo theme.

To use the Material theme, import the component from the `theme/material` folder:

```js
import '@vaadin/integer-field/theme/material/vaadin-integer-field.js';
```

You can also import the Lumo version of the component explicitly:

```js
import '@vaadin/integer-field/theme/lumo/vaadin-integer-field.js';
```

Finally, you can import the un-themed component from the `src` folder to get a minimal starting point:

```js
import '@vaadin/integer-field/src/vaadin-integer-field.js';
```

## Contributing

Read the [contributing guide](https://vaadin.com/docs/latest/contributing/overview) to learn about our development process, how to propose bugfixes and improvements, and how to test your changes to Vaadin components.

## License

Apache License 2.0

Vaadin collects usage statistics at development time to improve this product.
For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
