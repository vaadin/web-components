# @vaadin/avatar-group

A web component for grouping multiple [`<vaadin-avatar>`](https://www.npmjs.com/package/@vaadin/avatar-group) components together.

[Documentation + Live Demo ↗](https://vaadin.com/docs/latest/components/avatar/#avatar-group)

[![npm version](https://badgen.net/npm/v/@vaadin/avatar-group)](https://www.npmjs.com/package/@vaadin/avatar-group)
[![Discord](https://img.shields.io/discord/732335336448852018?label=discord)](https://discord.gg/PHmkCKC)

```html
<vaadin-avatar-group max-items-visible="3"></vaadin-avatar-group>
<script>
  document.querySelector('vaadin-avatar-group').items = [
    { name: 'Foo Bar', colorIndex: 1 },
    { colorIndex: 2 },
    { name: 'Foo Bar', colorIndex: 3 },
    { colorIndex: 4 }
  ];
</script>
```

[<img src="https://raw.githubusercontent.com/vaadin/web-components/master/packages/avatar-group/screenshot.png" width="108" alt="Screenshot of vaadin-avatar-group">](https://vaadin.com/docs/latest/components/avatar/#avatar-group)

## Installation

Install the component:

```sh
npm i @vaadin/avatar-group
```

Once installed, import the component in your application:

```js
import '@vaadin/avatar-group';
```

## Themes

Vaadin components come with two built-in [themes](https://vaadin.com/docs/latest/styling), Lumo and Material.
The [main entrypoint](https://github.com/vaadin/web-components/blob/master/packages/avatar-group/vaadin-avatar-group.js) of the package uses the Lumo theme.

To use the Material theme, import the component from the `theme/material` folder:

```js
import '@vaadin/avatar-group/theme/material/vaadin-avatar-group.js';
```

You can also import the Lumo version of the component explicitly:

```js
import '@vaadin/avatar-group/theme/lumo/vaadin-avatar-group.js';
```

Finally, you can import the un-themed component from the `src` folder to get a minimal starting point:

```js
import '@vaadin/avatar-group/src/vaadin-avatar-group.js';
```

## Contributing

Read the [contributing guide](https://vaadin.com/docs/latest/contributing/overview) to learn about our development process, how to propose bugfixes and improvements, and how to test your changes to Vaadin components.

## License

Apache License 2.0

Vaadin collects usage statistics at development time to improve this product.
For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
