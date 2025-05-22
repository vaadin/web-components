# @vaadin/side-nav

A web component for navigation menus.

[Documentation + Live Demo ↗](https://vaadin.com/docs/latest/components/side-nav)

[![npm version](https://badgen.net/npm/v/@vaadin/side-nav)](https://www.npmjs.com/package/@vaadin/side-nav)

```html
<vaadin-side-nav collapsible>
  <span slot="label">Main menu</span>

  <vaadin-side-nav-item path="/dashboard">
    <vaadin-icon icon="vaadin:chart" slot="prefix"></vaadin-icon>
    Dashboard
    <span theme="badge primary" slot="suffix" aria-label="(2 new items)">2</span>
  </vaadin-side-nav-item>

  <vaadin-side-nav-item>
    <vaadin-icon icon="vaadin:folder-open" slot="prefix"></vaadin-icon>
    Parent

    <vaadin-side-nav-item path="/child1" slot="children"> Child 1 </vaadin-side-nav-item>

    <vaadin-side-nav-item path="/child2" slot="children"> Child 2 </vaadin-side-nav-item>
  </vaadin-side-nav-item>
</vaadin-side-nav>
```

## Installation

Install the component:

```sh
npm i @vaadin/side-nav
```

Once installed, import the component in your application:

```js
import '@vaadin/side-nav';
```

## Contributing

Read the [contributing guide](https://vaadin.com/docs/latest/contributing) to learn about our development process, how to propose bugfixes and improvements, and how to test your changes to Vaadin components.

## License

Apache License 2.0

Vaadin collects usage statistics at development time to improve this product.
For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
