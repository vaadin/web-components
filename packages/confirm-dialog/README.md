# @vaadin/confirm-dialog

A modal dialog web component for confirming user actions.

[Documentation + Live Demo ↗](https://vaadin.com/docs/latest/components/confirm-dialog)

[![npm version](https://badgen.net/npm/v/@vaadin/confirm-dialog)](https://www.npmjs.com/package/@vaadin/confirm-dialog)
[![Discord](https://img.shields.io/discord/732335336448852018?label=discord)](https://discord.gg/PHmkCKC)

```html
<vaadin-confirm-dialog header="Unsaved changes" confirm-text="Save" reject-text="Discard" cancel reject>
  Do you want to save or discard your changes before navigating away?
</vaadin-confirm-dialog>
```

[<img src="https://raw.githubusercontent.com/vaadin/web-components/master/packages/confirm-dialog/screenshot.png" width="200" alt="Screenshot of vaadin-confirm-dialog">](https://vaadin.com/docs/latest/components/confirm-dialog)

## Installation

Install the component:

```sh
npm i @vaadin/confirm-dialog
```

Once installed, import the component in your application:

```js
import '@vaadin/confirm-dialog';
```

## Themes

Vaadin components come with two built-in [themes](https://vaadin.com/docs/latest/styling), Lumo and Material.
The [main entrypoint](https://github.com/vaadin/web-components/blob/master/packages/confirm-dialog/vaadin-confirm-dialog.js) of the package uses the Lumo theme.

To use the Material theme, import the component from the `theme/material` folder:

```js
import '@vaadin/confirm-dialog/theme/material/vaadin-confirm-dialog.js';
```

You can also import the Lumo version of the component explicitly:

```js
import '@vaadin/confirm-dialog/theme/lumo/vaadin-confirm-dialog.js';
```

Finally, you can import the un-themed component from the `src` folder to get a minimal starting point:

```js
import '@vaadin/confirm-dialog/src/vaadin-confirm-dialog.js';
```

## Contributing

Read the [contributing guide](https://vaadin.com/docs/latest/contributing/overview) to learn about our development process, how to propose bugfixes and improvements, and how to test your changes to Vaadin components.

## License

Apache License 2.0

Vaadin collects usage statistics at development time to improve this product.
For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
