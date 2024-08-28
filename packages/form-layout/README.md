# @vaadin/form-layout

A web component for building responsive forms with multiple columns.

[Documentation + Live Demo ↗](https://vaadin.com/docs/latest/components/form-layout)

[![npm version](https://badgen.net/npm/v/@vaadin/form-layout)](https://www.npmjs.com/package/@vaadin/form-layout)

```html
<vaadin-form-layout>
  <vaadin-text-field label="First Name" value="Jane"></vaadin-text-field>
  <vaadin-text-field label="Last Name" value="Doe"></vaadin-text-field>
  <vaadin-text-field label="Email" value="jane.doe@example.com"></vaadin-text-field>
</vaadin-form-layout>
```

[<img src="https://raw.githubusercontent.com/vaadin/web-components/main/packages/form-layout/screenshot.png" width="880" alt="Screenshot of vaadin-form-layout">](https://vaadin.com/docs/latest/components/form-layout)

## Installation

Install the component:

```sh
npm i @vaadin/form-layout
```

Once installed, import the component in your application:

```js
import '@vaadin/form-layout';
```

## Themes

Vaadin components come with two built-in [themes](https://vaadin.com/docs/latest/styling), Lumo and Material.
The [main entrypoint](https://github.com/vaadin/web-components/blob/main/packages/form-layout/vaadin-form-layout.js) of the package uses the Lumo theme.

To use the Material theme, import the component from the `theme/material` folder:

```js
import '@vaadin/form-layout/theme/material/vaadin-form-layout.js';
```

You can also import the Lumo version of the component explicitly:

```js
import '@vaadin/form-layout/theme/lumo/vaadin-form-layout.js';
```

Finally, you can import the un-themed component from the `src` folder to get a minimal starting point:

```js
import '@vaadin/form-layout/src/vaadin-form-layout.js';
```

## Contributing

Read the [contributing guide](https://vaadin.com/docs/latest/contributing) to learn about our development process, how to propose bugfixes and improvements, and how to test your changes to Vaadin components.

## License

Apache License 2.0

Vaadin collects usage statistics at development time to improve this product.
For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
