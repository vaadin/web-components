# @vaadin/combo-box

A web component for choosing a value from a filterable list of options presented in an overlay.

[Documentation + Live Demo ↗](https://vaadin.com/docs/latest/components/combo-box)

[![npm version](https://badgen.net/npm/v/@vaadin/combo-box)](https://www.npmjs.com/package/@vaadin/combo-box)

```html
<vaadin-combo-box
  label="User"
  placeholder="Please select"
  item-value-path="email"
  item-label-path="email"
></vaadin-combo-box>

<script>
  const comboBox = document.querySelector('vaadin-combo-box');

  fetch('https://randomuser.me/api?results=100&inc=name,email')
    .then((res) => res.json())
    .then((json) => (comboBox.items = json.results));
</script>
```

[<img src="https://raw.githubusercontent.com/vaadin/web-components/main/packages/combo-box/screenshot.png" width="208" alt="Screenshot of vaadin-combo-box">](https://vaadin.com/docs/latest/components/combo-box)

## Installation

Install the component:

```sh
npm i @vaadin/combo-box
```

Once installed, import the component in your application:

```js
import '@vaadin/combo-box';
```

## Themes

Vaadin components come with two built-in [themes](https://vaadin.com/docs/latest/styling), Lumo and Material.
The [main entrypoint](https://github.com/vaadin/web-components/blob/main/packages/combo-box/vaadin-combo-box.js) of the package uses the Lumo theme.

To use the Material theme, import the component from the `theme/material` folder:

```js
import '@vaadin/combo-box/theme/material/vaadin-combo-box.js';
```

You can also import the Lumo version of the component explicitly:

```js
import '@vaadin/combo-box/theme/lumo/vaadin-combo-box.js';
```

Finally, you can import the un-themed component from the `src` folder to get a minimal starting point:

```js
import '@vaadin/combo-box/src/vaadin-combo-box.js';
```

## Contributing

Read the [contributing guide](https://vaadin.com/docs/latest/contributing) to learn about our development process, how to propose bugfixes and improvements, and how to test your changes to Vaadin components.

## License

Apache License 2.0

Vaadin collects usage statistics at development time to improve this product.
For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
