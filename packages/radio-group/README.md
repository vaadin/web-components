# @vaadin/radio-group

A web component that allows the user to choose one item from a group of choices.

[Documentation + Live Demo ↗](https://vaadin.com/docs/latest/components/radio-button)

```html
<vaadin-radio-group label="Travel class">
  <vaadin-radio-button value="economy" label="Economy"></vaadin-radio-button>
  <vaadin-radio-button value="business" label="Business"></vaadin-radio-button>
  <vaadin-radio-button value="firstClass" label="First Class"></vaadin-radio-button>
</vaadin-radio-group>
```

[<img src="https://raw.githubusercontent.com/vaadin/web-components/main/packages/radio-group/screenshot.png" width="370" alt="Screenshot of vaadin-radio-group">](https://vaadin.com/docs/latest/components/radio-button)

## Installation

Install the component:

```sh
npm i @vaadin/radio-group
```

Once installed, import the component in your application:

```js
import '@vaadin/radio-group';
```

## Themes

Vaadin components come with two built-in [themes](https://vaadin.com/docs/latest/styling), Lumo and Material.
The [main entrypoint](https://github.com/vaadin/web-components/blob/main/packages/radio-group/vaadin-radio-group.js) of the package uses the Lumo theme.

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

## Contributing

Read the [contributing guide](https://vaadin.com/docs/latest/contributing) to learn about our development process, how to propose bugfixes and improvements, and how to test your changes to Vaadin components.

## License

Apache License 2.0

Vaadin collects usage statistics at development time to improve this product.
For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
