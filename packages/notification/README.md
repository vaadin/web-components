# @vaadin/notification

A web component for providing feedback to the user.

[Documentation + Live Demo ↗](https://vaadin.com/docs/latest/ds/components/notification)

[![npm version](https://badgen.net/npm/v/@vaadin/notification)](https://www.npmjs.com/package/@vaadin/notification)
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

[<img src="https://raw.githubusercontent.com/vaadin/web-components/master/packages/notification/screenshot.png" width="336" alt="Screenshot of vaadin-notification">](https://vaadin.com/docs/latest/ds/components/notification)

## Installation

Install the component:

```sh
npm i @vaadin/notification
```

Once installed, import the component in your application:

```js
import '@vaadin/notification';
```

## Themes

Vaadin components come with two built-in [themes](https://vaadin.com/docs/latest/ds/customization/using-themes), Lumo and Material.
The [main entrypoint](https://github.com/vaadin/web-components/blob/master/packages/notification/vaadin-notification.js) of the package uses the Lumo theme.

To use the Material theme, import the component from the `theme/material` folder:

```js
import '@vaadin/notification/theme/material/vaadin-notification.js';
```

You can also import the Lumo version of the component explicitly:

```js
import '@vaadin/notification/theme/lumo/vaadin-notification.js';
```

Finally, you can import the un-themed component from the `src` folder to get a minimal starting point:

```js
import '@vaadin/notification/src/vaadin-notification.js';
```

## Contributing

Read the [contributing guide](https://vaadin.com/docs/latest/guide/contributing/overview) to learn about our development process, how to propose bugfixes and improvements, and how to test your changes to Vaadin components.

## License

Apache License 2.0

Vaadin collects usage statistics at development time to improve this product.
For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
