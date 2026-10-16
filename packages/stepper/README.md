# @vaadin/stepper

> ⚠️ Experimental: enable with `window.Vaadin.featureFlags.stepperComponent = true` before importing.

A web component that shows the user's progress through a linear, multi-step process such as a checkout or an onboarding wizard.

```html
<vaadin-stepper>
  <vaadin-step completed path="/checkout/cart">Shopping cart</vaadin-step>
  <vaadin-step current>Shipping & billing</vaadin-step>
  <vaadin-step>Payment method</vaadin-step>
  <vaadin-step>Confirmation</vaadin-step>
</vaadin-stepper>
```

## Installation

Install the component:

```sh
npm i @vaadin/stepper
```

Once installed, import the component in your application:

```js
import '@vaadin/stepper';
```

## Contributing

Read the [contributing guide](https://vaadin.com/docs/latest/contributing) to learn about our development process, how to propose bugfixes and improvements, and how to test your changes to Vaadin components.

## License

Apache License 2.0

Vaadin collects usage statistics at development time to improve this product.
For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
