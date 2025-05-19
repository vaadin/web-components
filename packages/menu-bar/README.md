# @vaadin/menu-bar

A web component for creating a horizontal button bar with hierarchical drop-down menus.

[Documentation + Live Demo ↗](https://vaadin.com/docs/latest/components/menu-bar)

[![npm version](https://badgen.net/npm/v/@vaadin/menu-bar)](https://www.npmjs.com/package/@vaadin/menu-bar)

```html
<vaadin-menu-bar></vaadin-menu-bar>

<script>
  document.querySelector('vaadin-menu-bar').items = [
    { text: 'View' },
    { text: 'Edit' },
    {
      text: 'Move',
      children: [{ text: 'To folder' }, { text: 'To trash' }],
    },
    { text: 'Duplicate' },
  ];
</script>
```

[<img src="https://raw.githubusercontent.com/vaadin/web-components/main/packages/menu-bar/screenshot.png" width="345" alt="Screenshot of vaadin-menu-bar">](https://vaadin.com/docs/latest/components/menu-bar)

## Installation

Install the component:

```sh
npm i @vaadin/menu-bar
```

Once installed, import the component in your application:

```js
import '@vaadin/menu-bar';
```

## Contributing

Read the [contributing guide](https://vaadin.com/docs/latest/contributing) to learn about our development process, how to propose bugfixes and improvements, and how to test your changes to Vaadin components.

## License

Apache License 2.0

Vaadin collects usage statistics at development time to improve this product.
For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
