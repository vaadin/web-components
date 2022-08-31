# @vaadin/email-field

An extension of [`<vaadin-text-field>`](https://www.npmjs.com/package/@vaadin/text-field) component that only accepts email addresses as input.

[Documentation + Live Demo ↗](https://vaadin.com/docs/latest/components/email-field)

[![npm version](https://badgen.net/npm/v/@vaadin/email-field)](https://www.npmjs.com/package/@vaadin/email-field)
[![Discord](https://img.shields.io/discord/732335336448852018?label=discord)](https://discord.gg/PHmkCKC)

```html
<vaadin-email-field label="Email"></vaadin-email-field>
```

## Installation

Install the component:

```sh
npm i @vaadin/email-field
```

Once installed, import the component in your application:

```js
import '@vaadin/email-field';
```

## Themes

Vaadin components come with two built-in [themes](https://vaadin.com/docs/latest/styling), Lumo and Material.
The [main entrypoint](https://github.com/vaadin/web-components/blob/master/packages/email-field/vaadin-email-field.js) of the package uses Lumo theme.

To use the Material theme, import the component from the `theme/material` folder:

```js
import '@vaadin/email-field/theme/material/vaadin-email-field.js';
```

You can also import the Lumo version of the component explicitly:

```js
import '@vaadin/email-field/theme/lumo/vaadin-email-field.js';
```

Finally, you can import the un-themed component from the `src` folder to get a minimal starting point:

```js
import '@vaadin/email-field/src/vaadin-email-field.js';
```

## Contributing

Read the [contributing guide](https://vaadin.com/docs/latest/contributing/overview) to learn about our development process, how to propose bugfixes and improvements, and how to test your changes to Vaadin components.

## License

Apache License 2.0

Vaadin collects usage statistics at development time to improve this product.
For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
