# @vaadin/view-layout

A web component that provides a structured layout for a view, with a header (prefix, title, suffix), scrollable content, and a footer.

> [!WARNING]
> This component is experimental. It is only registered when the `viewLayoutComponent` feature flag is enabled:
>
> ```js
> window.Vaadin ||= {};
> window.Vaadin.featureFlags ||= {};
> window.Vaadin.featureFlags.viewLayoutComponent = true;
> ```

[Documentation + Live Demo ↗](https://vaadin.com/docs/latest/components)

## Installation

Install the component:

```sh
npm i @vaadin/view-layout
```

Once installed, import the component in your application:

```js
import '@vaadin/view-layout';
```

## Notes

- The auto-generated title (via the `headerTitle` property) uses `<div role="heading" aria-level="N">`,
  following the established Vaadin accessibility house style. Rendering a literal `<hN>` element is a
  follow-up.

## Contributing

Read the [contributing guide](https://vaadin.com/docs/latest/contributing) to learn about our development process, how to propose bugfixes and improvements, and how to test your changes to Vaadin components.

## License

Apache License 2.0
