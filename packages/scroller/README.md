# @vaadin/scroller

A component container for creating scrollable areas in the UI.

[Documentation + Live Demo ↗](https://vaadin.com/docs/latest/ds/components/scroller)

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

## Themes

Vaadin components come with two built-in [themes](https://vaadin.com/docs/latest/ds/customization/using-themes), Lumo and Material.
The [main entrypoint](https://github.com/vaadin/web-components/blob/master/packages/scroller/vaadin-scroller.js) of the package uses the Lumo theme.

To use the Material theme, import the component from the `theme/material` folder:

```js
import '@vaadin/scroller/theme/material/vaadin-scroller.js';
```

You can also import the Lumo version of the component explicitly:

```js
import '@vaadin/scroller/theme/lumo/vaadin-scroller.js';
```

Finally, you can import the un-themed component from the `src` folder to get a minimal starting point:

```js
import '@vaadin/scroller/src/vaadin-scroller.js';
```

## Contributing

Read the [contributing guide](https://vaadin.com/docs/latest/guide/contributing/overview) to learn about our development process, how to propose bugfixes and improvements, and how to test your changes to Vaadin components.

## License

Apache License 2.0

Vaadin collects usage statistics at development time to improve this product.
For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
