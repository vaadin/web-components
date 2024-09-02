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

## Themes

Vaadin components come with two built-in [themes](https://vaadin.com/docs/latest/styling), Lumo and Material.
The [main entrypoint](https://github.com/vaadin/web-components/blob/main/packages/side-nav/vaadin-side-nav.js) of the package uses the Lumo theme.

To use the Material theme, import the component from the `theme/material` folder:

```js
import '@vaadin/side-nav/theme/material/vaadin-side-nav.js';
```

You can also import the Lumo version of the component explicitly:

```js
import '@vaadin/side-nav/theme/lumo/vaadin-side-nav.js';
```

Finally, you can import the un-themed component from the `src` folder to get a minimal starting point:

```js
import '@vaadin/side-nav/src/vaadin-side-nav.js';
```

## Contributing

Read the [contributing guide](https://vaadin.com/docs/latest/contributing) to learn about our development process, how to propose bugfixes and improvements, and how to test your changes to Vaadin components.

## License

Apache License 2.0

Vaadin collects usage statistics at development time to improve this product.
For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
