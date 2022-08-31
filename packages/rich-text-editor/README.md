# @vaadin/rich-text-editor

An input field web component for entering rich text.

> ℹ️&nbsp; A commercial Vaadin [subscription](https://vaadin.com/pricing) is required to use Rich Text Editor in your project.

[Documentation + Live Demo ↗](https://vaadin.com/docs/latest/components/rich-text-editor)

[![npm version](https://badgen.net/npm/v/@vaadin/rich-text-editor)](https://www.npmjs.com/package/@vaadin/rich-text-editor)
[![Discord](https://img.shields.io/discord/732335336448852018?label=discord)](https://discord.gg/PHmkCKC)

```html
<vaadin-rich-text-editor></vaadin-rich-text-editor>
```

[<img src="https://raw.githubusercontent.com/vaadin/web-components/master/packages/rich-text-editor/screenshot.png" width="656" alt="Screenshot of vaadin-rich-text-editor">](https://vaadin.com/docs/latest/components/rich-text-editor)

## Installation

Install the component:

```sh
npm i @vaadin/rich-text-editor
```

Once installed, import the component in your application:

```js
import '@vaadin/rich-text-editor';
```

## Themes

Vaadin components come with two built-in [themes](https://vaadin.com/docs/latest/styling), Lumo and Material.
The [main entrypoint](https://github.com/vaadin/web-components/blob/master/packages/rich-text-editor/vaadin-rich-text-editor.js) of the package uses the Lumo theme.

To use the Material theme, import the component from the `theme/material` folder:

```js
import '@vaadin/rich-text-editor/theme/material/vaadin-rich-text-editor.js';
```

You can also import the Lumo version of the component explicitly:

```js
import '@vaadin/rich-text-editor/theme/lumo/vaadin-rich-text-editor.js';
```

Finally, you can import the un-themed component from the `src` folder to get a minimal starting point:

```js
import '@vaadin/rich-text-editor/src/vaadin-rich-text-editor.js';
```

## Contributing

Read the [contributing guide](https://vaadin.com/docs/latest/contributing/overview) to learn about our development process, how to propose bugfixes and improvements, and how to test your changes to Vaadin components.

## License

Commercial Vaadin Developer License 4.0 (CVDLv4). For license terms, see LICENSE.

Vaadin collects usage statistics at development time to improve this product.
For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
