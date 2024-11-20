# @vaadin/card

A visual content container.

> ⚠️ This component is experimental and the API may change. In order to use it, enable the feature flag by setting `window.Vaadin.featureFlags.cardComponent = true`.

[Documentation + Live Demo ↗](https://vaadin.com/docs/latest/components/card)

[![npm version](https://badgen.net/npm/v/@vaadin/card)](https://www.npmjs.com/package/@vaadin/card)

```html
<vaadin-card class="flex flex-col overflow-hidden">
  <img
    src="https://images.unsplash.com/photo-1519681393784-d120267933ba?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80"
    alt="">
  <div class="flex flex-col items-start p-m">
    <h3>Card Title</h3>
    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut.</p>
    <span theme="badge">Label</span>
  </div>
</vaadin-card>
```

[<img src="https://raw.githubusercontent.com/vaadin/web-components/main/packages/card/screenshot.png" width="296" alt="Screenshot of vaadin-card">](https://vaadin.com/docs/latest/components/card)

## Installation

Install the component:

```sh
npm i @vaadin/card
```

Once installed, import the component in your application:

```js
import '@vaadin/card';
```

## Contributing

Read the [contributing guide](https://vaadin.com/docs/latest/contributing) to learn about our development process, how to propose bugfixes and improvements, and how to test your changes to Vaadin components.

## License

Apache License 2.0

Vaadin collects usage statistics at development time to improve this product.
For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
