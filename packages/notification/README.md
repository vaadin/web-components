# @vaadin/notification

A web component for providing feedback to the user.

[Documentation + Live Demo ↗](https://vaadin.com/docs/latest/components/notification)

[![npm version](https://badgen.net/npm/v/@vaadin/notification)](https://www.npmjs.com/package/@vaadin/notification)

```html
<vaadin-notification opened position="middle" duration="-1"></vaadin-notification>

<script>
  const notification = document.querySelector('vaadin-notification');

  notification.renderer = function (root) {
    root.textContent = 'Your work has been saved';
  };
</script>
```

[<img src="https://raw.githubusercontent.com/vaadin/web-components/main/packages/notification/screenshot.png" width="336" alt="Screenshot of vaadin-notification">](https://vaadin.com/docs/latest/components/notification)

## Installation

Install the component:

```sh
npm i @vaadin/notification
```

Once installed, import the component in your application:

```js
import '@vaadin/notification';
```

## Contributing

Read the [contributing guide](https://vaadin.com/docs/latest/contributing) to learn about our development process, how to propose bugfixes and improvements, and how to test your changes to Vaadin components.

## License

Apache License 2.0

Vaadin collects usage statistics at development time to improve this product.
For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
