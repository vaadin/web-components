# @vaadin/custom-field

A web component for wrapping multiple components as a single field.

[Documentation + Live Demo ↗](https://vaadin.com/docs/latest/ds/components/custom-field)

[![npm version](https://badgen.net/npm/v/@vaadin/custom-field)](https://www.npmjs.com/package/@vaadin/custom-field)
[![Discord](https://img.shields.io/discord/732335336448852018?label=discord)](https://discord.gg/PHmkCKC)

```html
<vaadin-custom-field label="Enrollment period" helper-text="Cannot be longer than 30 days" required>
  <vaadin-date-picker id="start" placeholder="Start date"></vaadin-date-picker>
  &ndash;
  <vaadin-date-picker id="end" placeholder="End date"></vaadin-date-picker>
</vaadin-custom-field>
```

[<img src="https://raw.githubusercontent.com/vaadin/web-components/master/packages/custom-field/screenshot.png" width="401" alt="Screenshot of vaadin-custom-field">](https://vaadin.com/docs/latest/ds/components/custom-field)

## Installation

Install the component:

```sh
npm i @vaadin/custom-field
```

Once installed, import the component in your application:

```js
import '@vaadin/custom-field';
```

## Themes

Vaadin components come with two built-in [themes](https://vaadin.com/docs/latest/ds/customization/using-themes), Lumo and Material.
The [main entrypoint](https://github.com/vaadin/web-components/blob/master/packages/custom-field/vaadin-custom-field.js) of the package uses the Lumo theme.

To use the Material theme, import the component from the `theme/material` folder:

```js
import '@vaadin/custom-field/theme/material/vaadin-custom-field.js';
```

You can also import the Lumo version of the component explicitly:

```js
import '@vaadin/custom-field/theme/lumo/vaadin-custom-field.js';
```

Finally, you can import the un-themed component from the `src` folder to get a minimal starting point:

```js
import '@vaadin/custom-field/src/vaadin-custom-field.js';
```

## Contributing

Read the [contributing guide](https://vaadin.com/docs/latest/guide/contributing/overview) to learn about our development process, how to propose bugfixes and improvements, and how to test your changes to Vaadin components.

## License

Apache License 2.0

Vaadin collects usage statistics at development time to improve this product.
For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
