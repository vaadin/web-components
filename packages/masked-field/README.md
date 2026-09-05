# @vaadin/masked-field

An extension of [`<vaadin-text-field>`](https://www.npmjs.com/package/@vaadin/text-field) component that lays out the value as the user types.

> [!WARNING]
> This component is experimental. Enable the feature flag before importing it:
>
> ```js
> window.Vaadin.featureFlags.maskedFieldComponent = true;
> ```

[![npm version](https://badgen.net/npm/v/@vaadin/masked-field)](https://www.npmjs.com/package/@vaadin/masked-field)

```html
<vaadin-masked-field label="Phone number" format-mask="+1 (000) 000-0000"></vaadin-masked-field>
```

- `format-completion-required` makes a value that does not fill the mask invalid, checked on commit like the other constraints.
- `format-prompt` shows the part of the mask the user has not filled yet, for example `+1 (___) ___-____`.

## Installation

Install the component:

```sh
npm i @vaadin/masked-field
```

Once installed, import the component in your application:

```js
import '@vaadin/masked-field';
```

## Contributing

Read the [contributing guide](https://vaadin.com/docs/latest/contributing) to learn about our development process, how to propose bugfixes and improvements, and how to test your changes to Vaadin components.

## License

Apache License 2.0

Vaadin collects usage statistics at development time to improve this product.
For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
