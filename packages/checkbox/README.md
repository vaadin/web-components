# @vaadin/checkbox

An input field representing a binary choice.

[Live Demo ↗](https://vaadin.com/docs/latest/ds/components/checkbox)

```html
<vaadin-checkbox>I accept the terms and conditions</vaadin-checkbox>
```

## Installation

Install the component:

```sh
npm i @vaadin/checkbox --save
```

Once installed, import the component in your application:

```js
import '@vaadin/checkbox';
```

## Themes

Vaadin components come with two built-in [themes](https://vaadin.com/docs/latest/ds/customization/using-themes),
Lumo and Material. The [main entrypoint](https://github.com/vaadin/web-components/blob/master/packages/checkbox/vaadin-checkbox.js)
of the package uses the Lumo theme.

To use the Material theme, import the component from the `theme/material` folder:

```js
import '@vaadin/checkbox/theme/material/vaadin-checkbox.js';
```

You can also import the Lumo version of the component explicitly:

```js
import '@vaadin/checkbox/theme/lumo/vaadin-checkbox.js';
```

Finally, you can import the un-themed component from the `src` folder to get a minimal starting point:

```js
import '@vaadin/checkbox/src/vaadin-checkbox.js';
```

## License

Apache License 2.0

Vaadin collects development time usage statistics to improve this product.
For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
