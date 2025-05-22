# @vaadin/avatar-group

A web component for grouping multiple [`<vaadin-avatar>`](https://www.npmjs.com/package/@vaadin/avatar-group) components together.

[Documentation + Live Demo ↗](https://vaadin.com/docs/latest/components/avatar/#avatar-group)

[![npm version](https://badgen.net/npm/v/@vaadin/avatar-group)](https://www.npmjs.com/package/@vaadin/avatar-group)

```html
<vaadin-avatar-group max-items-visible="3"></vaadin-avatar-group>
<script>
  document.querySelector('vaadin-avatar-group').items = [
    { name: 'Foo Bar', colorIndex: 1 },
    { colorIndex: 2 },
    { name: 'Foo Bar', colorIndex: 3 },
    { colorIndex: 4 },
  ];
</script>
```

[<img src="https://raw.githubusercontent.com/vaadin/web-components/main/packages/avatar-group/screenshot.png" width="108" alt="Screenshot of vaadin-avatar-group">](https://vaadin.com/docs/latest/components/avatar/#avatar-group)

## Installation

Install the component:

```sh
npm i @vaadin/avatar-group
```

Once installed, import the component in your application:

```js
import '@vaadin/avatar-group';
```

## Contributing

Read the [contributing guide](https://vaadin.com/docs/latest/contributing) to learn about our development process, how to propose bugfixes and improvements, and how to test your changes to Vaadin components.

## License

Apache License 2.0

Vaadin collects usage statistics at development time to improve this product.
For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
