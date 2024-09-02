# @vaadin/date-picker

A web component that allows to enter a date by typing or by selecting from a calendar overlay.

[Documentation + Live Demo ↗](https://vaadin.com/docs/latest/components/date-picker)

[![npm version](https://badgen.net/npm/v/@vaadin/date-picker)](https://www.npmjs.com/package/@vaadin/date-picker)

```html
<vaadin-date-picker label="Label" value="2018-12-03" clear-button-visible></vaadin-date-picker>
```

[<img src="https://raw.githubusercontent.com/vaadin/web-components/main/packages/date-picker/screenshot.png" width="343" alt="Screenshot of vaadin-date-picker">](https://vaadin.com/docs/latest/components/date-picker)

## Installation

Install the component:

```sh
npm i @vaadin/date-picker
```

Once installed, import the component in your application:

```js
import '@vaadin/date-picker';
```

## Themes

Vaadin components come with two built-in [themes](https://vaadin.com/docs/latest/styling), Lumo and Material.
The [main entrypoint](https://github.com/vaadin/web-components/blob/main/packages/date-picker/vaadin-date-picker.js) of the package uses the Lumo theme.

To use the Material theme, import the component from the `theme/material` folder:

```js
import '@vaadin/date-picker/theme/material/vaadin-date-picker.js';
```

You can also import the Lumo version of the component explicitly:

```js
import '@vaadin/date-picker/theme/lumo/vaadin-date-picker.js';
```

Finally, you can import the un-themed component from the `src` folder to get a minimal starting point:

```js
import '@vaadin/date-picker/src/vaadin-date-picker.js';
```

## Contributing

Read the [contributing guide](https://vaadin.com/docs/latest/contributing) to learn about our development process, how to propose bugfixes and improvements, and how to test your changes to Vaadin components.

## License

Apache License 2.0

Vaadin collects usage statistics at development time to improve this product.
For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
