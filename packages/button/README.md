# @vaadin/button

An accessible and customizable button that allows users to perform actions.

[Live Demo ↗](https://vaadin.com/docs/latest/ds/components/button)

```html
<vaadin-button>Press me</vaadin-button>
```

## Installation

Install the component:

```sh
npm i @vaadin/button --save
```

Once installed, import the component in your application:

```js
import '@vaadin/button';
```

## Themes

Vaadin components come with two built-in [themes](https://vaadin.com/docs/latest/ds/customization/using-themes),
Lumo and Material. The [main entrypoint](https://github.com/vaadin/web-components/blob/master/packages/button/vaadin-button.js)
of the package uses the Lumo theme.

To use the Material theme, import the component from the `theme/material` folder:

```js
import '@vaadin/button/theme/material/vaadin-button.js';
```

You can also import the Lumo version of the component explicitly:

```js
import '@vaadin/button/theme/lumo/vaadin-button.js';
```

Finally, you can import the un-themed component from the `src` folder to get a minimal starting point:

```js
import '@vaadin/button/src/vaadin-button.js';
```

## License

Apache License 2.0

Vaadin collects development time usage statistics to improve this product.
For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
