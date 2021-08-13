# &lt;vaadin-confirm-dialog&gt;

[Live Demo ↗](https://vaadin.com/components/vaadin-confirm-dialog/html-examples)
|
[API documentation ↗](https://vaadin.com/components/vaadin-confirm-dialog/html-api)

[&lt;vaadin-confirm-dialog&gt;](https://vaadin.com/components/vaadin-confirm-dialog) is a Web Component providing an easy way to ask the user to confirm a choice, part of the [Vaadin components](https://vaadin.com/components).

[![npm version](https://badgen.net/npm/v/@vaadin/vaadin-confirm-dialog)](https://www.npmjs.com/package/@vaadin/vaadin-confirm-dialog)
[![Published on Vaadin Directory](https://img.shields.io/badge/Vaadin%20Directory-published-00b4f0.svg)](https://vaadin.com/directory/component/vaadinvaadin-confirm-dialog)
[![Discord](https://img.shields.io/discord/732335336448852018?label=discord)](https://discord.gg/PHmkCKC)

```html
<vaadin-confirm-dialog header="Unsaved changes" confirm-text="Save" reject-text="Discard" cancel reject>
  Do you want to save or discard your changes before navigating away?
</vaadin-confirm-dialog>
```

[<img src="https://raw.githubusercontent.com/vaadin/vaadin-confirm-dialog/master/screenshot.png" width="200" alt="Screenshot of vaadin-confirm-dialog">](https://vaadin.com/components/vaadin-confirm-dialog)

## Installation

Install `vaadin-confirm-dialog`:

```sh
npm i @vaadin/vaadin-confirm-dialog --save
```

Once installed, import it in your application:

```js
import '@vaadin/vaadin-confirm-dialog/vaadin-confirm-dialog.js';
```

## Getting started

Vaadin components use the Lumo theme by default.

To use the Material theme, import the correspondent file from the `theme/material` folder.

## Entry points

- The component with the Lumo theme:

  `theme/lumo/vaadin-confirm-dialog.js`

- The component with the Material theme:

  `theme/material/vaadin-confirm-dialog.js`

- Alias for `theme/lumo/vaadin-confirm-dialog.js`:

  `vaadin-confirm-dialog.js`

## Contributing

Read the [contributing guide](https://vaadin.com/docs/latest/guide/contributing/overview) to learn about our development process, how to propose bugfixes and improvements, and how to test your changes to Vaadin components.

## License

Commercial Vaadin Developer License 4.0 (CVDLv4). For license terms, see LICENSE.

Vaadin collects development time usage statistics to improve this product. For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
