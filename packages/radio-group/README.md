# @vaadin/radio-group

A web component that allows the user to choose one item from a group of choices.

[Live Demo ↗](https://vaadin.com/docs/latest/ds/components/radio-button)

```html
<vaadin-radio-group label="Travel class">
  <vaadin-radio-button value="economy">Economy</vaadin-radio-button>
  <vaadin-radio-button value="business">Business</vaadin-radio-button>
  <vaadin-radio-button value="firstClass">First Class</vaadin-radio-button>
</vaadin-radio-group>
```

## Installation

Install the component:

```sh
npm i @vaadin/radio-group --save
```

Once installed, import the component in your application:

```js
import '@vaadin/radio-group';
```

## Themes

Vaadin components come with two built-in [themes](https://vaadin.com/docs/latest/ds/customization/using-themes),
Lumo and Material. The [main entrypoint](https://github.com/vaadin/web-components/blob/master/packages/radio-group/vaadin-radio-group.js)
of the package uses the Lumo theme.

To use the Material theme, import the component from the `theme/material` folder:

```js
import '@vaadin/radio-group/theme/material/vaadin-radio-group.js';
```

You can also import the Lumo version of the component explicitly:

```js
import '@vaadin/radio-group/theme/lumo/vaadin-radio-group.js';
```

Finally, you can import the un-themed component from the `src` folder to get a minimal starting point:

```js
import '@vaadin/radio-group/src/vaadin-radio-group.js';
```

## License

Apache License 2.0

Vaadin collects development time usage statistics to improve this product.
For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
