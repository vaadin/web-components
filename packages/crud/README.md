# @vaadin/crud

A web component for displaying, editing, creating, and deleting items from a dataset.

> ℹ️&nbsp; A commercial Vaadin [subscription](https://vaadin.com/pricing) is required to use CRUD in your project.

[Documentation + Live Demo ↗](https://vaadin.com/docs/latest/components/crud)

[![npm version](https://badgen.net/npm/v/@vaadin/crud)](https://www.npmjs.com/package/@vaadin/crud)
[![Discord](https://img.shields.io/discord/732335336448852018?label=discord)](https://discord.gg/PHmkCKC)

```html
<vaadin-crud items='[{"name": "Juan", "surname": "Garcia"}]'></vaadin-crud>
```

[<img src="https://raw.githubusercontent.com/vaadin/web-components/master/packages/crud/screenshot.gif" width="702" alt="Screenshot of vaadin-crud">](https://vaadin.com/docs/latest/components/crud)

## Installation

Install the component:

```sh
npm i @vaadin/crud
```

Once installed, import the component in your application:

```js
import '@vaadin/crud';
```

## Themes

Vaadin components come with two built-in [themes](https://vaadin.com/docs/latest/styling), Lumo and Material.
The [main entrypoint](https://github.com/vaadin/web-components/blob/master/packages/crud/vaadin-crud.js) of the package uses the Lumo theme.

To use the Material theme, import the component from the `theme/material` folder:

```js
import '@vaadin/crud/theme/material/vaadin-crud.js';
```

You can also import the Lumo version of the component explicitly:

```js
import '@vaadin/crud/theme/lumo/vaadin-crud.js';
```

Finally, you can import the un-themed component from the `src` folder to get a minimal starting point:

```js
import '@vaadin/crud/src/vaadin-crud.js';
```

## Contributing

Read the [contributing guide](https://vaadin.com/docs/latest/contributing/overview) to learn about our development process, how to propose bugfixes and improvements, and how to test your changes to Vaadin components.

## License

This program is available under Vaadin Commercial License and Service Terms. For license terms, see LICENSE.

Vaadin collects usage statistics at development time to improve this product.
For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
