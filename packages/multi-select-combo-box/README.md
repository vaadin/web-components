# @vaadin/multi-select-combo-box

A web component that wraps `<vaadin-combo-box>` and allows selecting multiple items.

[Documentation + Live Demo ↗](https://vaadin.com/docs/latest/components/multi-select-combo-box)

```html
<vaadin-multi-select-combo-box style="width: 300px"></vaadin-multi-select-combo-box>
<script>
  const comboBox = document.querySelector('vaadin-multi-select-combo-box');
  comboBox.items = ['apple', 'banana', 'lemon', 'orange'];
  comboBox.selectedItems = ['apple', 'banana'];
</script>
```

[<img src="https://raw.githubusercontent.com/vaadin/web-components/main/packages/multi-select-combo-box/screenshot.png" width="300" alt="Screenshot of vaadin-multi-select-combo-box">](https://vaadin.com/docs/latest/components/multi-select-combo-box)

## Installation

Install the component:

```sh
npm i @vaadin/multi-select-combo-box
```

Once installed, import the component in your application:

```js
import '@vaadin/multi-select-combo-box';
```

## Contributing

Read the [contributing guide](https://vaadin.com/docs/latest/contributing) to learn about our development process, how to propose bugfixes and improvements, and how to test your changes to Vaadin components.

## License

Apache License 2.0

Vaadin collects usage statistics at development time to improve this product.
For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
