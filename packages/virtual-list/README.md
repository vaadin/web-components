# @vaadin/virtual-list

A web component for rendering a long list of items without sacrificing performance.

[Documentation + Live Demo ↗](https://vaadin.com/docs/latest/components/virtual-list)

[![npm version](https://badgen.net/npm/v/@vaadin/virtual-list)](https://www.npmjs.com/package/@vaadin/virtual-list)

```html
<vaadin-virtual-list></vaadin-virtual-list>

<script>
  const list = document.querySelector('vaadin-virtual-list');
  list.items = items; // An array of data items
  list.renderer = (root, list, { item, index }) => {
    root.textContent = `#${index}: ${item.name}`;
  };
</script>
```

## Installation

Install the component:

```sh
npm i @vaadin/virtual-list
```

Once installed, import the component in your application:

```js
import '@vaadin/virtual-list';
```

## Contributing

Read the [contributing guide](https://vaadin.com/docs/latest/contributing) to learn about our development process, how to propose bugfixes and improvements, and how to test your changes to Vaadin components.

## License

Apache License 2.0

Vaadin collects usage statistics at development time to improve this product.
For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
