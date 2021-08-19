# @vaadin/text-area

An input field component for multi-line text input.

[Live Demo ↗](https://vaadin.com/docs/latest/ds/components/text-area)

```html
<vaadin-text-area label="Comment"></vaadin-text-area>
```

## Installation

Install the component:

```sh
npm i @vaadin/text-area --save
```

Once installed, import the component in your application:

```js
import '@vaadin/text-area';
```

## Themes

Vaadin components come with two built-in [themes](https://vaadin.com/docs/latest/ds/customization/using-themes),
Lumo and Material. The [main entrypoint](https://github.com/vaadin/web-components/blob/master/packages/text-area/vaadin-text-area.js)
of the package uses Lumo theme.

To use the Material theme, import the component from the `theme/material` folder:

```js
import '@vaadin/text-area/theme/material/vaadin-text-area.js';
```

You can also import the Lumo version of the component explicitly:

```js
import '@vaadin/text-area/theme/lumo/vaadin-text-area.js';
```

Finally, you can import the un-themed component from the `src` folder to get a minimal starting point:

```js
import '@vaadin/text-area/src/vaadin-text-area.js';
```

## License

Apache License 2.0

Vaadin collects development time usage statistics to improve this product.
For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
