# @vaadin/scroller

A component container for creating scrollable areas in the UI.

[Documentation + Live Demo ↗](https://vaadin.com/docs/latest/components/scroller)

```html
<vaadin-scroller scroll-direction="vertical">
  <section>
    <h3>Personal information</h3>
    <vaadin-text-field label="First name"></vaadin-text-field>
    <vaadin-text-field label="Last name"></vaadin-text-field>
    <vaadin-date-picker label="Birth date"></vaadin-date-picker>
  </section>
  <section>
    <h3>Employment information</h3>
    <vaadin-text-field label="Position"></vaadin-text-field>
    <vaadin-text-area label="Additional information"></vaadin-text-area>
  </section>
</vaadin-scroller>
```

## Installation

Install the component:

```sh
npm i @vaadin/scroller
```

Once installed, import the component in your application:

```js
import '@vaadin/scroller';
```

## Contributing

Read the [contributing guide](https://vaadin.com/docs/latest/contributing) to learn about our development process, how to propose bugfixes and improvements, and how to test your changes to Vaadin components.

## License

Apache License 2.0

Vaadin collects usage statistics at development time to improve this product.
For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
