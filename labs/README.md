# @vaadin/labs

Experimental Vaadin web components, published before they become regular packages.

Any component can change or disappear in any release.
The package can be empty between releases.

## Installation

Install the package:

```sh
npm i @vaadin/labs
```

Once installed, enable the feature flag of a component and import it in your application:

```html
<script type="module">
  window.Vaadin ??= {};
  window.Vaadin.featureFlags ??= {};
  window.Vaadin.featureFlags.<name>Component = true;
</script>
<script type="module">
  import '@vaadin/labs/vaadin-<name>.js';
</script>
```

The flag key is the camel case name of the component with the `Component` suffix.
A component registers only after you enable its feature flag.

## Contributing

Read the [contributing guide](https://vaadin.com/docs/latest/contributing) to learn about our development process, how to propose bugfixes and improvements, and how to test your changes to Vaadin components.

The rules for labs components are in [`guidelines/labs.md`](https://github.com/vaadin/web-components/blob/main/guidelines/labs.md).

## License

Apache License 2.0

Vaadin collects usage statistics at development time to improve this product.
For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
