# @vaadin/multi-select-combo-box

> ⚠️ Work in progress, please do not use this component yet.

A web component that wraps `<vaadin-combo-box>` and allows selecting multiple items.

```html
<vaadin-multi-select-combo-box id="fruit"></vaadin-multi-select-combo-box>
<script>
  const comboBox = document.querySelector('#fruit');
  comboBox.items = ['apple', 'banana', 'lemon', 'orange'];
  comboBox.selectedItems = ['lemon', 'orange'];
</script>
```

## Installation

Install the component:

```sh
npm i @vaadin/multi-select-combo-box
```

Once installed, import the component in your application:

```js
import '@vaadin/multi-select-combo-box';
```

## Themes

Vaadin components come with two built-in [themes](https://vaadin.com/docs/latest/ds/customization/using-themes), Lumo and Material.
The [main entrypoint](https://github.com/vaadin/web-components/blob/master/packages/multi-select-combo-box/vaadin-multi-select-combo-box.js) of the package uses the Lumo theme.

To use the Material theme, import the component from the `theme/material` folder:

```js
import '@vaadin/multi-select-combo-box/theme/material/vaadin-multi-select-combo-box.js';
```

You can also import the Lumo version of the component explicitly:

```js
import '@vaadin/multi-select-combo-box/theme/lumo/vaadin-multi-select-combo-box.js';
```

Finally, you can import the un-themed component from the `src` folder to get a minimal starting point:

```js
import '@vaadin/multi-select-combo-box/src/vaadin-multi-select-combo-box.js';
```

## Contributing

Read the [contributing guide](https://vaadin.com/docs/latest/guide/contributing/overview) to learn about our development process, how to propose bugfixes and improvements, and how to test your changes to Vaadin components.

## License

Apache License 2.0

Vaadin collects usage statistics at development time to improve this product.
For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
