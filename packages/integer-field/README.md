# @vaadin/integer-field

An extension of `vaadin-number-field` component that only accepts entering integer numbers.

[Live Demo ↗](https://vaadin.com/docs/latest/ds/components/number-field/#integer-field)

```html
<vaadin-integer-field label="X"></vaadin-integer-field>
```

## Installation

Install the component:

```sh
npm i @vaadin/integer-field --save
```

Once installed, import the component in your application:

```js
import '@vaadin/integer-field';
```

## Themes

Vaadin components come with two built-in [themes](https://vaadin.com/docs/latest/ds/customization/using-themes),
Lumo and Material. The [main entrypoint](https://github.com/vaadin/web-components/blob/master/packages/integer-field/vaadin-integer-field.js)
of the package uses Lumo theme.

To use the Material theme, import the component from the `theme/material` folder:

```js
import '@vaadin/integer-field/theme/material/vaadin-integer-field.js';
```

You can also import the Lumo version of the component explicitly:

```js
import '@vaadin/integer-field/theme/lumo/vaadin-integer-field.js';
```

Finally, you can import the un-themed component from the `src` folder to get a minimal starting point:

```js
import '@vaadin/integer-field/src/vaadin-integer-field.js';
```

## License

Apache License 2.0

Vaadin collects development time usage statistics to improve this product.
For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
