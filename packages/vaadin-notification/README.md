# &lt;vaadin-notification&gt;

[Live Demo ↗](https://vaadin.com/components/vaadin-notification/html-examples)
|
[API documentation ↗](https://vaadin.com/components/vaadin-notification/html-api)

[&lt;vaadin-notification&gt;](https://vaadin.com/components/vaadin-notification) is a Web Component providing accessible and customizable notifications (toasts), part of the [Vaadin components](https://vaadin.com/components).

[![npm version](https://badgen.net/npm/v/@vaadin/vaadin-notification)](https://www.npmjs.com/package/@vaadin/vaadin-notification)
[![Published on Vaadin Directory](https://img.shields.io/badge/Vaadin%20Directory-published-00b4f0.svg)](https://vaadin.com/directory/component/vaadinvaadin-notification)
[![Discord](https://img.shields.io/discord/732335336448852018?label=discord)](https://discord.gg/PHmkCKC)

```html
<vaadin-notification opened position="middle" duration="-1"></vaadin-notification>

<script>
  const notification = document.querySelector('vaadin-notification');

  notification.renderer = function (root) {
    root.textContent = 'Your work has been saved';
  };
</script>
```

[<img src="https://raw.githubusercontent.com/vaadin/vaadin-notification/master/screenshot.png" width="336" alt="Screenshot of vaadin-notification">](https://vaadin.com/components/vaadin-notification)

## Installation

Install `vaadin-notification`:

```sh
npm i @vaadin/vaadin-notification --save
```

Once installed, import it in your application:

```js
import '@vaadin/vaadin-notification/vaadin-notification.js';
```

## Getting started

Vaadin components use the Lumo theme by default.

To use the Material theme, import the correspondent file from the `theme/material` folder.

## Entry points

- The component with the Lumo theme:

  `theme/lumo/vaadin-notification.js`

- The component with the Material theme:

  `theme/material/vaadin-notification.js`

- Alias for `theme/lumo/vaadin-notification.js`:

- `vaadin-notification.js`

## Contributing

Read the [contributing guide](https://vaadin.com/docs/latest/guide/contributing/overview) to learn about our development process, how to propose bugfixes and improvements, and how to test your changes to Vaadin components.

## License

Apache License 2.0

Vaadin collects development time usage statistics to improve this product. For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
