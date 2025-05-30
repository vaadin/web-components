# @vaadin/custom-field

A web component for wrapping multiple components as a single field.

[Documentation + Live Demo ↗](https://vaadin.com/docs/latest/components/custom-field)

[![npm version](https://badgen.net/npm/v/@vaadin/custom-field)](https://www.npmjs.com/package/@vaadin/custom-field)

```html
<vaadin-custom-field label="Enrollment period" helper-text="Cannot be longer than 30 days" required>
  <vaadin-date-picker id="start" placeholder="Start date"></vaadin-date-picker>
  &ndash;
  <vaadin-date-picker id="end" placeholder="End date"></vaadin-date-picker>
</vaadin-custom-field>
```

[<img src="https://raw.githubusercontent.com/vaadin/web-components/main/packages/custom-field/screenshot.png" width="401" alt="Screenshot of vaadin-custom-field">](https://vaadin.com/docs/latest/components/custom-field)

## Installation

Install the component:

```sh
npm i @vaadin/custom-field
```

Once installed, import the component in your application:

```js
import '@vaadin/custom-field';
```

## Contributing

Read the [contributing guide](https://vaadin.com/docs/latest/contributing) to learn about our development process, how to propose bugfixes and improvements, and how to test your changes to Vaadin components.

## License

Apache License 2.0

Vaadin collects usage statistics at development time to improve this product.
For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
