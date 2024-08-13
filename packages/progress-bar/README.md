# @vaadin/progress-bar

A web component for showing the completion status of a task or process.

[Documentation + Live Demo ↗](https://vaadin.com/docs/latest/components/progress-bar)

[![npm version](https://badgen.net/npm/v/@vaadin/progress-bar)](https://www.npmjs.com/package/@vaadin/progress-bar)

```html
<vaadin-progress-bar></vaadin-progress-bar>
<vaadin-progress-bar value="0.3"></vaadin-progress-bar>
<vaadin-progress-bar indeterminate></vaadin-progress-bar>
```

[<img src="https://raw.githubusercontent.com/vaadin/web-components/main/packages/progress-bar/screenshot.gif" width="418" alt="Screenshot of vaadin-progress-bar">](https://vaadin.com/docs/latest/components/progress-bar)

## Installation

Install the component:

```sh
npm i @vaadin/progress-bar
```

Once installed, import the component in your application:

```js
import '@vaadin/progress-bar';
```

## Themes

Vaadin components come with two built-in [themes](https://vaadin.com/docs/latest/styling), Lumo and Material.
The [main entrypoint](https://github.com/vaadin/web-components/blob/main/packages/progress-bar/vaadin-progress-bar.js) of the package uses Lumo theme.

To use the Material theme, import the component from the `theme/material` folder:

```js
import '@vaadin/progress-bar/theme/material/vaadin-progress-bar.js';
```

You can also import the Lumo version of the component explicitly:

```js
import '@vaadin/progress-bar/theme/lumo/vaadin-progress-bar.js';
```

Finally, you can import the un-themed component from the `src` folder to get a minimal starting point:

```js
import '@vaadin/progress-bar/src/vaadin-progress-bar.js';
```

## Contributing

Read the [contributing guide](https://vaadin.com/docs/latest/contributing) to learn about our development process, how to propose bugfixes and improvements, and how to test your changes to Vaadin components.

## License

Apache License 2.0

Vaadin collects usage statistics at development time to improve this product.
For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
