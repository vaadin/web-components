# @vaadin/dialog

A web component for presenting information and user interface elements in an overlay.

[Documentation + Live Demo ↗](https://vaadin.com/docs/latest/components/dialog)

[![npm version](https://badgen.net/npm/v/@vaadin/dialog)](https://www.npmjs.com/package/@vaadin/dialog)

```html
<vaadin-dialog opened></vaadin-dialog>

<script>
  const dialog = document.querySelector('vaadin-dialog');
  dialog.renderer = function (root, dialog) {
    root.textContent = 'Sample dialog';
  };
</script>
```

[<img src="https://raw.githubusercontent.com/vaadin/web-components/main/packages/dialog/screenshot.png" width="264" alt="Screenshot of vaadin-dialog">](https://vaadin.com/docs/latest/components/dialog)

## Installation

Install the component:

```sh
npm i @vaadin/dialog
```

Once installed, import the component in your application:

```js
import '@vaadin/dialog';
```

## Contributing

Read the [contributing guide](https://vaadin.com/docs/latest/contributing) to learn about our development process, how to propose bugfixes and improvements, and how to test your changes to Vaadin components.

## License

Apache License 2.0

Vaadin collects usage statistics at development time to improve this product.
For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
