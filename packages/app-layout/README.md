# @vaadin/app-layout

A web component for building common application layouts.

[Documentation + Live Demo ↗](https://vaadin.com/docs/latest/ds/components/app-layout)

[![npm version](https://badgen.net/npm/v/@vaadin/app-layout)](https://www.npmjs.com/package/@vaadin/app-layout)
[![Discord](https://img.shields.io/discord/732335336448852018?label=discord)](https://discord.gg/PHmkCKC)

```html
<vaadin-app-layout>
  <vaadin-drawer-toggle slot="navbar touch-optimized"></vaadin-drawer-toggle>
  <h3 slot="navbar touch-optimized">Application Name</h3>
  <vaadin-tabs orientation="vertical" slot="drawer">
    <vaadin-tab>
      <a href="/profile">
        <vaadin-icon icon="lumo:user"></vaadin-icon>
        Profile
      </a>
    </vaadin-tab>
    <vaadin-tab>
      <a href="/contact">
        <vaadin-icon icon="lumo:phone"></vaadin-icon>
        Contact
      </a>
    </vaadin-tab>
  </vaadin-tabs>
  <div>Page content</div>
</vaadin-app-layout>
```

[<img src="https://raw.githubusercontent.com/vaadin/web-components/master/packages/app-layout/screenshot.png" width="900" alt="Screenshot of vaadin-app-layout">](https://vaadin.com/docs/latest/ds/components/app-layout)

[<img src="https://raw.githubusercontent.com/vaadin/web-components/master/packages/app-layout/screenshot-mobile.png" width="350" alt="Screenshot of vaadin-app-layout on mobile">](https://vaadin.com/docs/latest/ds/components/app-layout)

## Installation

Install the component:

```sh
npm i @vaadin/app-layout
```

Once installed, import the components in your application:

```js
import '@vaadin/app-layout';
import '@vaadin/app-layout/vaadin-drawer-toggle.js';
```

## Themes

Vaadin components come with two built-in [themes](https://vaadin.com/docs/latest/ds/customization/using-themes), Lumo and Material.
The [main entrypoint](https://github.com/vaadin/web-components/blob/master/packages/app-layout/vaadin-app-layout.js) of the package uses the Lumo theme.

To use the Material theme, import the components from the `theme/material` folder:

```js
import '@vaadin/app-layout/theme/material/vaadin-app-layout.js';
import '@vaadin/app-layout/theme/material/vaadin-drawer-toggle.js';
```

You can also import the Lumo version of the components explicitly:

```js
import '@vaadin/app-layout/theme/lumo/vaadin-app-layout.js';
import '@vaadin/app-layout/theme/lumo/vaadin-drawer-toggle.js';
```

Finally, you can import the un-themed components from the `src` folder to get a minimal starting point:

```js
import '@vaadin/app-layout/src/vaadin-app-layout.js';
import '@vaadin/app-layout/src/vaadin-drawer-toggle.js';
```

## Contributing

Read the [contributing guide](https://vaadin.com/docs/latest/guide/contributing/overview) to learn about our development process, how to propose bugfixes and improvements, and how to test your changes to Vaadin components.

## License

Apache License 2.0

Vaadin collects usage statistics at development time to improve this product.
For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
