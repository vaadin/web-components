# @vaadin/badge

A web component for showing information as badges.

[Documentation + Live Demo ↗](https://vaadin.com/docs/latest/components/badge)

[![npm version](https://badgen.net/npm/v/@vaadin/badge)](https://www.npmjs.com/package/@vaadin/badge)
[![Discord](https://img.shields.io/discord/732335336448852018?label=discord)](https://discord.gg/PHmkCKC)

```html
<vaadin-badge>Success!</vaadin-badge>
```

[<img src="https://raw.githubusercontent.com/vaadin/web-components/master/packages/badge/screenshot.png" width="735" alt="Screenshot of vaadin-badge">](https://vaadin.com/docs/latest/components/badge/)

## Installation

Install the component:

```sh
npm i @vaadin/badge
```

Once installed, import the component in your application:

```js
import '@vaadin/badge';
```

## Themes

Vaadin components come with two built-in [themes](https://vaadin.com/docs/latest/styling), Lumo and Material.
The [main entrypoint](https://github.com/vaadin/web-components/blob/master/packages/badge/vaadin-badge.js) of the package uses the Lumo theme.

To use the Material theme, import the component from the `theme/material` folder:

```js
import '@vaadin/badge/theme/material/vaadin-badge.js';
```

You can also import the Lumo version of the component explicitly:

```js
import '@vaadin/badge/theme/lumo/vaadin-badge.js';
```

Finally, you can import the un-themed component from the `src` folder to get a minimal starting point:

```js
import '@vaadin/badge/src/vaadin-badge.js';
```

## Contributing

Read the [contributing guide](https://vaadin.com/docs/latest/contributing/overview) to learn about our development process, how to propose bugfixes and improvements, and how to test your changes to Vaadin components.

## License

Apache License 2.0

Vaadin collects usage statistics at development time to improve this product.
For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
