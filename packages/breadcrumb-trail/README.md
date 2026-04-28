# @vaadin/breadcrumb-trail

A web component that displays the user's location within a hierarchy as a trail of links from the root to the current page.

> ⚠️ This component is experimental and the API may change. In order to use it, enable the feature flag by setting `window.Vaadin.featureFlags.breadcrumbTrailComponent = true`.

```html
<vaadin-breadcrumb-trail>
  <vaadin-breadcrumb-item path="/">Home</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item path="/docs">Docs</vaadin-breadcrumb-item>
  <vaadin-breadcrumb-item>OAuth2</vaadin-breadcrumb-item>
</vaadin-breadcrumb-trail>
```

## Installation

Install the component:

```sh
npm i @vaadin/breadcrumb-trail
```

Once installed, import the component in your application:

```js
import '@vaadin/breadcrumb-trail';
```

## Contributing

Read the [contributing guide](https://vaadin.com/docs/latest/contributing) to learn about our development process, how to propose bugfixes and improvements, and how to test your changes to Vaadin components.

## License

Apache License 2.0

Vaadin collects usage statistics at development time to improve this product.
For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
