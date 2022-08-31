# @vaadin/password-field

An extension of [`<vaadin-text-field>`](https://www.npmjs.com/package/@vaadin/text-field) component for entering passwords.

[Documentation + Live Demo ↗](https://vaadin.com/docs/latest/components/password-field)

[![npm version](https://badgen.net/npm/v/@vaadin/password-field)](https://www.npmjs.com/package/@vaadin/password-field)
[![Discord](https://img.shields.io/discord/732335336448852018?label=discord)](https://discord.gg/PHmkCKC)

```html
<vaadin-password-field label="Password"></vaadin-password-field>
```

## Installation

Install the component:

```sh
npm i @vaadin/password-field
```

Once installed, import the component in your application:

```js
import '@vaadin/password-field';
```

## Themes

Vaadin components come with two built-in [themes](https://vaadin.com/docs/latest/styling), Lumo and Material.
The [main entrypoint](https://github.com/vaadin/web-components/blob/master/packages/password-field/vaadin-password-field.js) of the package uses Lumo theme.

To use the Material theme, import the component from the `theme/material` folder:

```js
import '@vaadin/password-field/theme/material/vaadin-password-field.js';
```

You can also import the Lumo version of the component explicitly:

```js
import '@vaadin/password-field/theme/lumo/vaadin-password-field.js';
```

Finally, you can import the un-themed component from the `src` folder to get a minimal starting point:

```js
import '@vaadin/password-field/src/vaadin-password-field.js';
```

## Contributing

Read the [contributing guide](https://vaadin.com/docs/latest/contributing/overview) to learn about our development process, how to propose bugfixes and improvements, and how to test your changes to Vaadin components.

## License

Apache License 2.0

Vaadin collects usage statistics at development time to improve this product.
For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
