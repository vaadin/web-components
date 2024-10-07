# @vaadin/tooltip

A web component for creating tooltips.

[Documentation + Live Demo ↗](https://vaadin.com/docs/latest/components/tooltip)

[![npm version](https://badgen.net/npm/v/@vaadin/tooltip)](https://www.npmjs.com/package/@vaadin/tooltip)

```html
<vaadin-button id="confirm">Confirm</vaadin-button>
<vaadin-tooltip text="Click to save changes" for="confirm"></vaadin-tooltip>
```

[<img src="https://raw.githubusercontent.com/vaadin/web-components/main/packages/tooltip/screenshot.png" width="200" alt="Screenshot of vaadin-tooltip">](https://vaadin.com/docs/latest/components/tooltip)

## Installation

Install the component:

```sh
npm i @vaadin/tooltip
```

Once installed, import the component in your application:

```js
import '@vaadin/tooltip';
```

## Themes

Vaadin components come with two built-in [themes](https://vaadin.com/docs/latest/styling), Lumo and Material.
The [main entrypoint](https://github.com/vaadin/web-components/blob/main/packages/tooltip/vaadin-tooltip.js) of the package uses the Lumo theme.

To use the Material theme, import the component from the `theme/material` folder:

```js
import '@vaadin/tooltip/theme/material/vaadin-tooltip.js';
```

You can also import the Lumo version of the component explicitly:

```js
import '@vaadin/tooltip/theme/lumo/vaadin-tooltip.js';
```

Finally, you can import the un-themed component from the `src` folder to get a minimal starting point:

```js
import '@vaadin/tooltip/src/vaadin-tooltip.js';
```

## Contributing

Read the [contributing guide](https://vaadin.com/docs/latest/contributing) to learn about our development process, how to propose bugfixes and improvements, and how to test your changes to Vaadin components.

## License

Apache License 2.0

Vaadin collects usage statistics at development time to improve this product.
For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
