# @vaadin/date-time-picker

An input field web component for selecting both a date and a time.

[Documentation + Live Demo ↗](https://vaadin.com/docs/latest/components/date-time-picker)

[![npm version](https://badgen.net/npm/v/@vaadin/date-time-picker)](https://www.npmjs.com/package/@vaadin/date-time-picker)
[![Discord](https://img.shields.io/discord/732335336448852018?label=discord)](https://discord.gg/PHmkCKC)

```html
<vaadin-date-time-picker></vaadin-date-time-picker>
```

## Installation

Install the component:

```sh
npm i @vaadin/date-time-picker
```

Once installed, import the component in your application:

```js
import '@vaadin/date-time-picker';
```

## Themes

Vaadin components come with two built-in [themes](https://vaadin.com/docs/latest/styling), Lumo and Material.
The [main entrypoint](https://github.com/vaadin/web-components/blob/master/packages/date-time-picker/vaadin-date-time-picker.js) of the package uses the Lumo theme.

To use the Material theme, import the component from the `theme/material` folder:

```js
import '@vaadin/date-time-picker/theme/material/vaadin-date-time-picker.js';
```

You can also import the Lumo version of the component explicitly:

```js
import '@vaadin/date-time-picker/theme/lumo/vaadin-date-time-picker.js';
```

Finally, you can import the un-themed component from the `src` folder to get a minimal starting point:

```js
import '@vaadin/date-time-picker/src/vaadin-date-time-picker.js';
```

## Contributing

Read the [contributing guide](https://vaadin.com/docs/latest/contributing/overview) to learn about our development process, how to propose bugfixes and improvements, and how to test your changes to Vaadin components.

## License

Apache License 2.0

Vaadin collects usage statistics at development time to improve this product.
For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
