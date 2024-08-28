# @vaadin/avatar

A web component for graphical representation of an object or entity, for example a person or an organization.

[Documentation + Live Demo ↗](https://vaadin.com/docs/latest/components/avatar)

[![npm version](https://badgen.net/npm/v/@vaadin/avatar)](https://www.npmjs.com/package/@vaadin/avatar)

```html
<vaadin-avatar></vaadin-avatar>
<vaadin-avatar name="Jens Jansson"></vaadin-avatar>
<vaadin-avatar abbr="SK"></vaadin-avatar>
```

[<img src="https://raw.githubusercontent.com/vaadin/web-components/main/packages/avatar/screenshot.png" width="132" alt="Screenshot of vaadin-avatar">](https://vaadin.com/docs/latest/components/avatar)

## Installation

Install the component:

```sh
npm i @vaadin/avatar
```

Once installed, import the component in your application:

```js
import '@vaadin/avatar';
```

## Themes

Vaadin components come with two built-in [themes](https://vaadin.com/docs/latest/styling), Lumo and Material.
The [main entrypoint](https://github.com/vaadin/web-components/blob/main/packages/avatar/vaadin-avatar.js) of the package uses the Lumo theme.

To use the Material theme, import the component from the `theme/material` folder:

```js
import '@vaadin/avatar/theme/material/vaadin-avatar.js';
```

You can also import the Lumo version of the component explicitly:

```js
import '@vaadin/avatar/theme/lumo/vaadin-avatar.js';
```

Finally, you can import the un-themed component from the `src` folder to get a minimal starting point:

```js
import '@vaadin/avatar/src/vaadin-avatar.js';
```

## Contributing

Read the [contributing guide](https://vaadin.com/docs/latest/contributing) to learn about our development process, how to propose bugfixes and improvements, and how to test your changes to Vaadin components.

## License

Apache License 2.0

Vaadin collects usage statistics at development time to improve this product.
For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
