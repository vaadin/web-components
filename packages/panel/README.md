# @vaadin/panel

A layout component for a view, with a header, a scrollable content area and a footer.

> [!WARNING]
> This component is experimental. It is only registered when the `panelComponent` feature flag is enabled:
>
> ```js
> window.Vaadin ||= {};
> window.Vaadin.featureFlags ||= {};
> window.Vaadin.featureFlags.panelComponent = true;
> ```

```html
<vaadin-panel header-title="Edit User">
  <vaadin-button slot="header-prefix" theme="tertiary" aria-label="Close">×</vaadin-button>
  <vaadin-button slot="header-suffix" theme="tertiary">Cancel</vaadin-button>
  <vaadin-button slot="header-suffix" theme="primary">Save</vaadin-button>
  <form>...</form>
  <vaadin-button slot="footer">Delete</vaadin-button>
</vaadin-panel>
```

## Installation

Install the component:

```sh
npm i @vaadin/panel
```

Once installed, import the component in your application:

```js
import '@vaadin/panel';
```

## Contributing

Read the [contributing guide](https://vaadin.com/docs/latest/contributing) to learn about our development process, how to propose bugfixes and improvements, and how to test your changes to Vaadin components.

## License

Apache License 2.0

Vaadin collects usage statistics at development time to improve this product.
For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
