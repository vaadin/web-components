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

## Themes

Vaadin components come with two built-in [themes](https://vaadin.com/docs/latest/styling), Lumo and Material.
The [main entrypoint](https://github.com/vaadin/web-components/blob/main/packages/menu-bar/vaadin-menu-bar.js) of the package uses the Lumo theme.

To use the Material theme, import the component from the `theme/material` folder:

```js
import '@vaadin/menu-bar/theme/material/vaadin-menu-bar.js';
```

You can also import the Lumo version of the component explicitly:

```js
import '@vaadin/menu-bar/theme/lumo/vaadin-menu-bar.js';
```

Finally, you can import the un-themed component from the `src` folder to get a minimal starting point:

```js
import '@vaadin/menu-bar/src/vaadin-menu-bar.js';
```

## Contributing

Read the [contributing guide](https://vaadin.com/docs/latest/contributing) to learn about our development process, how to propose bugfixes and improvements, and how to test your changes to Vaadin components.

## License

Apache License 2.0

Vaadin collects usage statistics at development time to improve this product.
For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
