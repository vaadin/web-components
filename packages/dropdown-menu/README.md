# @vaadin/dropdown-menu

A web component that shows a button which opens a dropdown menu of actions.

> ⚠️ This component is experimental and the API may change. In order to use it, enable the feature flag by setting `window.Vaadin.featureFlags.dropdownMenuComponent = true`.

```html
<vaadin-dropdown-menu label="Actions">
  <vaadin-context-menu-list-box slot="overlay">
    <vaadin-context-menu-item>Edit</vaadin-context-menu-item>
    <vaadin-context-menu-item>Delete</vaadin-context-menu-item>
  </vaadin-context-menu-list-box>
</vaadin-dropdown-menu>
```

The component reuses the `vaadin-context-menu` internals. Inherited members such as `openOn`, `listenOn`, `closeOn`, `selector` and `renderer` are not supported.

## Installation

Install the component:

```sh
npm i @vaadin/dropdown-menu
```

Once installed, import the component in your application:

```js
import '@vaadin/dropdown-menu';
```

## Contributing

Read the [contributing guide](https://vaadin.com/docs/latest/contributing) to learn about our development process, how to propose bugfixes and improvements, and how to test your changes to Vaadin components.

## License

Apache License 2.0

Vaadin collects usage statistics at development time to improve this product.
For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
