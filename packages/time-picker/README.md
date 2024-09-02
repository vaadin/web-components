# @vaadin/time-picker

A web component that allows to enter a time, either by typing, or by selecting from a set of pre-defined options.

[Documentation + Live Demo ↗](https://vaadin.com/docs/latest/components/time-picker)

[![npm version](https://badgen.net/npm/v/@vaadin/time-picker)](https://www.npmjs.com/package/@vaadin/time-picker)

```html
<vaadin-time-picker label="Delivery Time"></vaadin-time-picker>
```

[<img src="https://raw.githubusercontent.com/vaadin/web-components/main/packages/time-picker/screenshot.png" width="215" alt="Screenshot of vaadin-time-picker">](https://vaadin.com/docs/latest/components/time-picker)

## Installation

Install the component:

```sh
npm i @vaadin/time-picker
```

Once installed, import the component in your application:

```js
import '@vaadin/time-picker';
```

## Themes

Vaadin components come with two built-in [themes](https://vaadin.com/docs/latest/styling), Lumo and Material.
The [main entrypoint](https://github.com/vaadin/web-components/blob/main/packages/time-picker/vaadin-time-picker.js) of the package uses the Lumo theme.

To use the Material theme, import the component from the `theme/material` folder:

```js
import '@vaadin/time-picker/theme/material/vaadin-time-picker.js';
```

You can also import the Lumo version of the component explicitly:

```js
import '@vaadin/time-picker/theme/lumo/vaadin-time-picker.js';
```

Finally, you can import the un-themed component from the `src` folder to get a minimal starting point:

```js
import '@vaadin/time-picker/src/vaadin-time-picker.js';
```

## Contributing

Read the [contributing guide](https://vaadin.com/docs/latest/contributing) to learn about our development process, how to propose bugfixes and improvements, and how to test your changes to Vaadin components.

## License

Apache License 2.0

Vaadin collects usage statistics at development time to improve this product.
For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
