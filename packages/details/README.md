# @vaadin/details

A web component that provides an expandable panel for showing and hiding content.

[Documentation + Live Demo ↗](https://vaadin.com/docs/latest/components/details)

[![npm version](https://badgen.net/npm/v/@vaadin/details)](https://www.npmjs.com/package/@vaadin/details)

```html
<vaadin-details opened>
  <vaadin-details-summary slot="summary">Expandable Details</vaadin-details-summary>
  <div>Toggle using mouse, Enter and Space keys.</div>
</vaadin-details>
```

[<img src="https://raw.githubusercontent.com/vaadin/web-components/main/packages/details/screenshot.png" alt="Screenshot of vaadin-details" width="320">](https://vaadin.com/docs/latest/components/details)

## Installation

Install the component:

```sh
npm i @vaadin/details
```

Once installed, import the component in your application:

```js
import '@vaadin/details';
```

## Themes

Vaadin components come with two built-in [themes](https://vaadin.com/docs/latest/styling), Lumo and Material.
The [main entrypoint](https://github.com/vaadin/web-components/blob/main/packages/details/vaadin-details.js) of the package uses the Lumo theme.

To use the Material theme, import the component from the `theme/material` folder:

```js
import '@vaadin/details/theme/material/vaadin-details.js';
```

You can also import the Lumo version of the component explicitly:

```js
import '@vaadin/details/theme/lumo/vaadin-details.js';
```

Finally, you can import the un-themed component from the `src` folder to get a minimal starting point:

```js
import '@vaadin/details/src/vaadin-details.js';
```

## Contributing

Read the [contributing guide](https://vaadin.com/docs/latest/contributing) to learn about our development process, how to propose bugfixes and improvements, and how to test your changes to Vaadin components.

## License

Apache License 2.0

Vaadin collects usage statistics at development time to improve this product.
For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
