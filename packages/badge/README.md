# @vaadin/badge

A web component for displaying badges with various theme variants.

[Documentation + Live Demo ↗](https://vaadin.com/docs/latest/components/badge)

[![npm version](https://badgen.net/npm/v/@vaadin/badge)](https://www.npmjs.com/package/@vaadin/badge)

```html
<vaadin-badge>Badge</vaadin-badge>
<vaadin-badge theme="primary">Primary</vaadin-badge>
<vaadin-badge theme="success">Success</vaadin-badge>
<vaadin-badge theme="error">Error</vaadin-badge>
<vaadin-badge theme="warning">Warning</vaadin-badge>
<vaadin-badge theme="contrast">Contrast</vaadin-badge>
```

## Installation

Install the component:

```sh
npm i @vaadin/badge
```

Once installed, import the component in your application:

```js
import '@vaadin/badge';
```

## Themes

Vaadin components come with two built-in [themes](https://vaadin.com/docs/latest/styling), Lumo and Aura.
Use them with theme imports:

```js
// Lumo
import '@vaadin/vaadin-lumo-styles/components/badge.css';

// Aura
import '@vaadin/aura/aura.css';
```

## Theme Variants

The badge component supports the following theme variants:

- `primary` - Primary color variant
- `success` - Success color variant
- `error` - Error color variant
- `warning` - Warning color variant
- `contrast` - Contrast color variant
- `small` - Smaller size variant
- `pill` - Pill-shaped variant with rounded ends

You can combine multiple theme variants:

```html
<vaadin-badge theme="error primary">Error Primary</vaadin-badge>
<vaadin-badge theme="success small">Success Small</vaadin-badge>
```

## Empty Badge (Dot Indicator)

An empty badge without any text content will render as a circular dot indicator:

```html
<vaadin-badge theme="error"></vaadin-badge>
```

## Contributing

Read the [contributing guide](https://vaadin.com/docs/latest/contributing) to learn about our development process, how to propose bugfixes and improvements, and how to test your changes to Vaadin components.

## License

Apache License 2.0

Vaadin collects usage statistics at development time to improve this product.
For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
