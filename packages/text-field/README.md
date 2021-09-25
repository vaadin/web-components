# @vaadin/text-field

A web component that allows the user to input and edit text.

[Live Demo ↗](https://vaadin.com/docs/latest/ds/components/text-field)

```html
<vaadin-text-field label="Street Address"></vaadin-text-field>
```

## Installation

Install the component:

```sh
npm i @vaadin/text-field --save
```

Once installed, import the component in your application:

```js
import '@vaadin/text-field';
```

## Themes

Vaadin components come with two built-in [themes](https://vaadin.com/docs/latest/ds/customization/using-themes),
Lumo and Material. The [main entrypoint](https://github.com/vaadin/web-components/blob/master/packages/text-field/vaadin-text-field.js)
of the package uses Lumo theme.

To use the Material theme, import the component from the `theme/material` folder:

```js
import '@vaadin/text-field/theme/material/vaadin-text-field.js';
```

You can also import the Lumo version of the component explicitly:

```js
import '@vaadin/text-field/theme/lumo/vaadin-text-field.js';
```

Finally, you can import the un-themed component from the `src` folder to get a minimal starting point:

```js
import '@vaadin/text-field/src/vaadin-text-field.js';
```

## License

Apache License 2.0

Vaadin collects development time usage statistics to improve this product.
For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
