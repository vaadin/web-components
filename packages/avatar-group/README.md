# &lt;vaadin-avatar&gt;

[&lt;vaadin-avatar-group&gt;](https://vaadin.com/components/vaadin-avatar) is a Web Component providing avatar in groups displaying functionality.

[Live Demo ↗](https://vaadin.com/components/vaadin-avatar/html-examples)
|
[API documentation ↗](https://vaadin.com/components/vaadin-avatar/html-api)

[![npm version](https://badgen.net/npm/v/@vaadin/avatar-group)](https://www.npmjs.com/package/@vaadin/avatar)
[![Published on Vaadin Directory](https://img.shields.io/badge/Vaadin%20Directory-published-00b4f0.svg)](https://vaadin.com/directory/component/vaadinvaadin-avatar)
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

[<img src="https://raw.githubusercontent.com/vaadin/web-components/master/packages/avatar-group/screenshot.png" width="200" alt="Screenshot of vaadin-avatar-group">](https://vaadin.com/components/vaadin-avatar)

## Installation

Install `vaadin-avatar-group`:

```sh
npm i @vaadin/avatar-group --save
```

Once installed, import it in your application:

```js
import '@vaadin/avatar-group/vaadin-avatar-group.js';
```

## Getting started

Vaadin components use the Lumo theme by default.

To use the Material theme, import the correspondent file from the `theme/material` folder.

## Entry points

- The component with the Lumo theme:

  `theme/lumo/vaadin-avatar-group.js`

- The component with the Material theme:

  `theme/material/vaadin-avatar-group.js`

- Alias for `theme/lumo/vaadin-avatar-group.js`:

  `vaadin-avatar-group.js`

## Contributing

Read the [contributing guide](https://vaadin.com/docs/latest/guide/contributing/overview) to learn about our development process, how to propose bugfixes and improvements, and how to test your changes to Vaadin components.

## License

Apache License 2.0

Vaadin collects development time usage statistics to improve this product. For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
