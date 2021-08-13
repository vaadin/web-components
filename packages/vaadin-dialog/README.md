# &lt;vaadin-dialog&gt;

[Live Demo ↗](https://vaadin.com/components/vaadin-dialog/html-examples/dialog-basic-demos)
|
[API documentation ↗](https://vaadin.com/components/vaadin-dialog/html-api)

[&lt;vaadin-dialog&gt;](https://vaadin.com/components/vaadin-dialog) is a Web Component for customized modal dialogs, part of the [Vaadin components](https://vaadin.com/components).

[![npm version](https://badgen.net/npm/v/@vaadin/vaadin-dialog)](https://www.npmjs.com/package/@vaadin/vaadin-dialog)
[![Published on Vaadin Directory](https://img.shields.io/badge/Vaadin%20Directory-published-00b4f0.svg)](https://vaadin.com/directory/component/vaadinvaadin-dialog)
[![Discord](https://img.shields.io/discord/732335336448852018?label=discord)](https://discord.gg/PHmkCKC)

```html
<vaadin-dialog opened></vaadin-dialog>

<script>
  const dialog = document.querySelector('vaadin-dialog');
  dialog.renderer = function (root, dialog) {
    root.textContent = 'Sample dialog';
  };
</script>
```

[<img src="https://raw.githubusercontent.com/vaadin/vaadin-dialog/master/screenshot.png" width="264" alt="Screenshot of vaadin-dialog">](https://vaadin.com/components/vaadin-dialog)

## Installation

Install `vaadin-dialog`:

```sh
npm i @vaadin/vaadin-dialog --save
```

Once installed, import it in your application:

```js
import '@vaadin/vaadin-dialog/vaadin-dialog.js';
```

## Getting started

Vaadin components use the Lumo theme by default.

To use the Material theme, import the correspondent file from the `theme/material` folder.

## Entry points

- The component with the Lumo theme:

  `theme/lumo/vaadin-dialog.js`

- The component with the Material theme:

  `theme/material/vaadin-dialog.js`

- Alias for `theme/lumo/vaadin-dialog.js`:

  `vaadin-dialog.js`

## Contributing

Read the [contributing guide](https://vaadin.com/docs/latest/guide/contributing/overview) to learn about our development process, how to propose bugfixes and improvements, and how to test your changes to Vaadin components.

## License

Apache License 2.0

Vaadin collects development time usage statistics to improve this product. For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
